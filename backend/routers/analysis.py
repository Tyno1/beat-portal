"""Library analysis and statistics endpoints."""

import sqlite3
from fastapi import APIRouter, Depends
from core.database import get_db_connection
from models import (
    BPMDistributionResponse,
    DistributionItem,
    DistributionItem1,
    DistributionItem2,
    DistributionItem3,
    GenreDistributionResponse,
    KeyDistributionResponse,
    LibraryOverview,
    MoodDistributionResponse,
)

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.get("/overview")
def get_library_overview(
    db: sqlite3.Connection = Depends(get_db_connection),
) -> LibraryOverview:
    """
    Get overall statistics about the music library.
    """
    cursor = db.cursor()

    # Total tracks
    cursor.execute("SELECT COUNT(*) FROM tracks")
    total_tracks = cursor.fetchone()[0]

    # Total duration (in seconds)
    cursor.execute(
        "SELECT COALESCE(SUM(duration_seconds), 0) FROM tracks WHERE duration_seconds IS NOT NULL"
    )
    total_duration_seconds = cursor.fetchone()[0] or 0

    # Total size (in bytes)
    cursor.execute(
        "SELECT COALESCE(SUM(file_size_bytes), 0) FROM tracks WHERE file_size_bytes IS NOT NULL"
    )
    total_size_bytes = cursor.fetchone()[0] or 0

    # Total genres (distinct count)
    cursor.execute(
        "SELECT COUNT(DISTINCT genre) FROM tracks WHERE genre IS NOT NULL AND genre != ''"
    )
    total_genres = cursor.fetchone()[0] or 0

    # Average BPM
    cursor.execute("SELECT AVG(bpm) FROM tracks WHERE bpm IS NOT NULL")
    avg_bpm_result = cursor.fetchone()[0]
    average_bpm = float(avg_bpm_result) if avg_bpm_result else None

    # Most common key
    cursor.execute("""
        SELECT key, COUNT(*) as count
        FROM tracks
        WHERE key IS NOT NULL AND key != ''
        GROUP BY key
        ORDER BY count DESC
        LIMIT 1
    """)
    key_result = cursor.fetchone()
    most_common_key = key_result[0] if key_result else None

    # Metadata completeness (percentage of tracks with complete metadata)
    # Consider metadata complete if title, artist, genre, bpm, and key are all present
    cursor.execute("""
        SELECT COUNT(*) FROM tracks
        WHERE title IS NOT NULL AND title != ''
        AND artist IS NOT NULL AND artist != ''
        AND genre IS NOT NULL AND genre != ''
        AND bpm IS NOT NULL
        AND key IS NOT NULL AND key != ''
    """)
    complete_tracks = cursor.fetchone()[0]
    metadata_completeness = (
        (complete_tracks / total_tracks * 100) if total_tracks > 0 else 0.0
    )

    # Tracks missing metadata
    tracks_missing_metadata = total_tracks - complete_tracks

    cursor.close()

    return LibraryOverview(
        total_tracks=total_tracks,
        total_duration_seconds=total_duration_seconds,
        total_size_bytes=total_size_bytes,
        total_genres=total_genres,
        average_bpm=average_bpm,
        most_common_key=most_common_key,
        metadata_completeness=metadata_completeness,
        tracks_missing_metadata=tracks_missing_metadata,
    )


@router.get("/bpm-distribution")
def get_bpm_distribution(
    db: sqlite3.Connection = Depends(get_db_connection),
) -> BPMDistributionResponse:
    """
    Get distribution of tracks by BPM ranges.
    """
    cursor = db.cursor()

    # Define BPM ranges
    ranges = [
        (0, 100, "0-100"),
        (100, 120, "100-120"),
        (120, 130, "120-130"),
        (130, 140, "130-140"),
        (140, 150, "140-150"),
        (150, 160, "150-160"),
        (160, 170, "160-170"),
        (170, 180, "170-180"),
        (180, 200, "180-200"),
        (200, 9999, "200+"),
    ]

    # Get total count for percentage calculation
    cursor.execute("SELECT COUNT(*) FROM tracks WHERE bpm IS NOT NULL")
    total = cursor.fetchone()[0] or 1

    distribution = []
    for min_bpm, max_bpm, range_label in ranges:
        cursor.execute(
            "SELECT COUNT(*) FROM tracks WHERE bpm >= ? AND bpm < ?", (min_bpm, max_bpm)
        )
        count = cursor.fetchone()[0] or 0
        percentage = (count / total * 100) if total > 0 else 0.0

        distribution.append(
            DistributionItem(
                range=range_label, count=count, percentage=round(percentage, 2)
            )
        )

    cursor.close()

    return BPMDistributionResponse(distribution=distribution)


@router.get("/key-distribution")
def get_key_distribution(
    db: sqlite3.Connection = Depends(get_db_connection),
) -> KeyDistributionResponse:
    """
    Get distribution of tracks by musical key.
    """
    cursor = db.cursor()

    # Get total count for percentage calculation
    cursor.execute("SELECT COUNT(*) FROM tracks WHERE key IS NOT NULL AND key != ''")
    total = cursor.fetchone()[0] or 1

    # Get distribution by key
    cursor.execute("""
        SELECT key, COUNT(*) as count
        FROM tracks
        WHERE key IS NOT NULL AND key != ''
        GROUP BY key
        ORDER BY count DESC
    """)

    results = cursor.fetchall()
    distribution = []

    for row in results:
        key_name = row[0]
        count = row[1]
        percentage = (count / total * 100) if total > 0 else 0.0

        distribution.append(
            DistributionItem1(
                key=key_name, count=count, percentage=round(percentage, 2)
            )
        )

    cursor.close()

    return KeyDistributionResponse(distribution=distribution)


@router.get("/genre-distribution")
def get_genre_distribution(
    db: sqlite3.Connection = Depends(get_db_connection),
) -> GenreDistributionResponse:
    """
    Get distribution of tracks by genre.
    """
    cursor = db.cursor()

    # Get total count for percentage calculation
    cursor.execute(
        "SELECT COUNT(*) FROM tracks WHERE genre IS NOT NULL AND genre != ''"
    )
    total = cursor.fetchone()[0] or 1

    # Get distribution by genre
    cursor.execute("""
        SELECT genre, COUNT(*) as count
        FROM tracks
        WHERE genre IS NOT NULL AND genre != ''
        GROUP BY genre
        ORDER BY count DESC
    """)

    results = cursor.fetchall()
    distribution = []

    for row in results:
        genre_name = row[0]
        count = row[1]
        percentage = (count / total * 100) if total > 0 else 0.0

        distribution.append(
            DistributionItem2(
                genre=genre_name, count=count, percentage=round(percentage, 2)
            )
        )

    cursor.close()

    return GenreDistributionResponse(distribution=distribution)


@router.get("/mood-distribution")
def get_mood_distribution(
    db: sqlite3.Connection = Depends(get_db_connection),
) -> MoodDistributionResponse:
    """
    Get distribution of tracks by mood.
    """
    cursor = db.cursor()

    # Get total count for percentage calculation
    cursor.execute("SELECT COUNT(*) FROM tracks WHERE mood IS NOT NULL AND mood != ''")
    total = cursor.fetchone()[0] or 1

    # Get distribution by mood
    cursor.execute("""
        SELECT mood, COUNT(*) as count
        FROM tracks
        WHERE mood IS NOT NULL AND mood != ''
        GROUP BY mood
        ORDER BY count DESC
    """)

    results = cursor.fetchall()
    distribution = []

    for row in results:
        mood_name = row[0]
        count = row[1]
        percentage = (count / total * 100) if total > 0 else 0.0

        distribution.append(
            DistributionItem3(
                mood=mood_name, count=count, percentage=round(percentage, 2)
            )
        )

    cursor.close()

    return MoodDistributionResponse(distribution=distribution)
