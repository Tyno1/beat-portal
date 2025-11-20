"""Reference data endpoints for filters and other stable data."""

import sqlite3
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from core.database import get_db_connection
from models import (
    CreateRefdataRequest,
    CreateRefdataResponse,
    DeleteRefdataResponse,
    RefdataItem,
    RefdataResponse,
    RefdataType,
)

router = APIRouter(prefix="/refdata", tags=["Reference Data"])


def _ensure_refdata_value_exists(
    cursor, refdata_type: str, key: str, value: str, current_time: str
):
    """Check if a refdata value exists, and insert it if it doesn't."""
    cursor.execute("""
        SELECT value FROM refdata
        WHERE type = ? AND key = ? AND value = ?
    """, (refdata_type, key, value))
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO refdata (type, key, value, count, updated_at)
            VALUES (?, ?, ?, 1, ?)
        """, (refdata_type, key, value, current_time))


def _sync_bpm_ranges(cursor, refdata_type: str, current_time: str):
    """Sync BPM ranges from tracks to refdata."""
    cursor.execute("""
        SELECT MIN(bpm), MAX(bpm) FROM tracks
        WHERE bpm IS NOT NULL
    """)
    result = cursor.fetchone()
    if result and result[0] is not None and result[1] is not None:
        _, max_bpm = result[0], result[1]
        for i in range(60, max_bpm + 1, 20):
            range_end = min(i + 19, max_bpm)
            bpm_range = f"{i}-{range_end} BPM"
            _ensure_refdata_value_exists(cursor, refdata_type, "bpm", bpm_range, current_time)


def _sync_year_ranges(cursor, refdata_type: str, current_time: str):
    """Sync year ranges from tracks to refdata."""
    cursor.execute("""
        SELECT MIN(year), MAX(year) FROM tracks
        WHERE year IS NOT NULL
    """)
    result = cursor.fetchone()
    if result and result[0] is not None and result[1] is not None:
        min_year, max_year = result[0], result[1]
        decade_start = (min_year // 10) * 10
        decade_end = ((max_year // 10) + 1) * 10
        year_ranges = [
            f"{i}s" for i in range(decade_start, decade_end + 1, 10)
        ]
        for year_range in year_ranges:
            _ensure_refdata_value_exists(cursor, refdata_type, "year", year_range, current_time)


def _sync_track_values(cursor, refdata_type: str, key: str, current_time: str):
    """Sync distinct values from tracks table to refdata for a given key."""
    cursor.execute(f"""
        SELECT DISTINCT {key} FROM tracks
        WHERE {key} IS NOT NULL AND {key} != ''
        ORDER BY {key}
    """)
    track_values = [row[0] for row in cursor.fetchall()]
    for track_value in track_values:
        _ensure_refdata_value_exists(cursor, refdata_type, key, track_value, current_time)


@router.get("/{refdata_type}")
def get_refdata(
    refdata_type: RefdataType,
    db: sqlite3.Connection = Depends(get_db_connection),
) -> RefdataResponse:
    """
    Get reference data for filters and other stable values.

    This endpoint syncs refdata from tracks table - it checks tracks for values
    and adds any missing values to refdata before returning the results.

    Types:
    - 'trackfilters': Returns all filter options (genre, mood, key, artist, bpm ranges, year ranges)
    """
    cursor = db.cursor()
    current_time = datetime.now().isoformat()
    refdata_type_str = refdata_type.value

    # Define all filter categories that should always be present
    filter_keys = ["genre", "mood", "key", "artist", "bpm", "year"]

    # Sync refdata from tracks table
    _sync_bpm_ranges(cursor, refdata_type_str, current_time)
    _sync_year_ranges(cursor, refdata_type_str, current_time)

    # Sync simple values (genre, mood, key, artist)
    for key in ["genre", "mood", "key", "artist"]:
        _sync_track_values(cursor, refdata_type_str, key, current_time)

    # Commit the synced values
    db.commit()

    # Query refdata table for each filter key and return
    filters = []
    for key in filter_keys:
        cursor.execute("""
            SELECT value FROM refdata
            WHERE type = ? AND key = ?
            ORDER BY value
        """, (refdata_type_str, key))
        values = [row[0] for row in cursor.fetchall()]
        filters.append(RefdataItem(key=key, value=values))

    cursor.close()
    return RefdataResponse(data=filters)


@router.post("/{refdata_type}", status_code=201)
def create_refdata(
    refdata_type: RefdataType,
    request: CreateRefdataRequest,
    db: sqlite3.Connection = Depends(get_db_connection),
) -> CreateRefdataResponse:
    """
    Create or update reference data entries for a specific type and key.

    This endpoint allows you to store filter options in the refdata table.
    Each value in the request will be stored as a separate row in the database.
    If a value already exists, it will be updated (count incremented, updated_at refreshed).
    """
    cursor = db.cursor()
    created_count = 0
    updated_count = 0
    current_time = datetime.now().isoformat()

    try:
        for value in request.value:
            if not value or not value.strip():
                continue

            # Check if entry already exists
            cursor.execute(
                """
                SELECT count FROM refdata
                WHERE type = ? AND key = ? AND value = ?
                """,
                (refdata_type.value, request.key, value.strip()),
            )
            existing = cursor.fetchone()

            if existing:
                # Update existing entry
                cursor.execute(
                    """
                    UPDATE refdata
                    SET count = count + 1, updated_at = ?
                    WHERE type = ? AND key = ? AND value = ?
                    """,
                    (current_time, refdata_type.value, request.key, value.strip()),
                )
                updated_count += 1
            else:
                # Insert new entry
                cursor.execute(
                    """
                    INSERT INTO refdata (type, key, value, count, updated_at)
                    VALUES (?, ?, ?, 1, ?)
                    """,
                    (refdata_type.value, request.key, value.strip(), current_time),
                )
                created_count += 1

        db.commit()
        cursor.close()

        return CreateRefdataResponse(
            type=refdata_type.value,
            key=request.key,
            created_count=created_count,
            updated_count=updated_count,
        )
    except Exception as e:
        db.rollback()
        cursor.close()
        raise HTTPException(
            status_code=500, detail=f"Error creating reference data: {str(e)}"
        ) from e


@router.delete("/{refdata_type}", status_code=200)
def delete_refdata(
    refdata_type: RefdataType,
    db: sqlite3.Connection = Depends(get_db_connection),
) -> DeleteRefdataResponse:
    """
    Delete all reference data entries for a specific type.

    This endpoint deletes all filter options from the refdata table for the specified type.
    """
    cursor = db.cursor()

    try:
        # Delete all entries for this refdata type
        cursor.execute(
            """
            DELETE FROM refdata
            WHERE type = ?
            """,
            (refdata_type.value,),
        )
        deleted_count = cursor.rowcount

        db.commit()
        cursor.close()

        return DeleteRefdataResponse(
            type=refdata_type.value,
            key="*",  # All keys
            deleted_count=deleted_count,
        )
    except Exception as e:
        db.rollback()
        cursor.close()
        raise HTTPException(
            status_code=500, detail=f"Error deleting reference data: {str(e)}"
        ) from e
