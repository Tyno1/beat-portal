"""Track management endpoints."""

import sqlite3
from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends, Query
from core.database import get_db_connection
from models import (
    BulkDeleteTracksRequest,
    BulkDeleteTracksResponse,
    Pagination,
    Track,
    TrackCreate,
    TrackUpdate,
    TracksListResponse,
)
from storage.track_storage import storage

router = APIRouter(prefix="/tracks", tags=["Tracks"])


@router.get("")
def get_all_tracks(
    page: int = Query(0, ge=0),
    size: int = Query(50, ge=1, le=100),
    search: str = "",
    genre: str = "",
    mood: str = "",
    bpm_min: int = 0,
    bpm_max: int = 0,
    key: str = "",
    sort_by: str = "title",
    sort_order: str = "desc",
    db: sqlite3.Connection = Depends(get_db_connection),
) -> TracksListResponse:
    """
    Get all tracks in the library with filtering, sorting, and pagination.
    """
    cursor = db.cursor()

    # Build WHERE clause for filtering
    where_conditions = []
    params = []

    if search:
        where_conditions.append("(title LIKE ? OR artist LIKE ? OR album LIKE ?)")
        search_param = f"%{search}%"
        params.extend([search_param, search_param, search_param])

    if genre:
        where_conditions.append("genre = ?")
        params.append(genre)

    if mood:
        where_conditions.append("mood = ?")
        params.append(mood)

    if bpm_min > 0:
        where_conditions.append("bpm >= ?")
        params.append(bpm_min)

    if bpm_max > 0:
        where_conditions.append("bpm <= ?")
        params.append(bpm_max)

    if key:
        where_conditions.append("key = ?")
        params.append(key)

    where_clause = " AND ".join(where_conditions) if where_conditions else "1=1"

    # Get total count for pagination
    count_query = f"SELECT COUNT(*) FROM tracks WHERE {where_clause}"
    cursor.execute(count_query, params)
    total_items = cursor.fetchone()[0]

    # Build ORDER BY clause - validate sort_by parameter
    # OpenAPI spec: title, artist, bpm, key, year, created_at
    valid_sort_columns = ["title", "artist", "bpm", "key", "year", "created_at"]
    if sort_by not in valid_sort_columns:
        sort_by = "title"

    db_sort_column = sort_by
    sort_direction = "DESC" if sort_order.lower() == "desc" else "ASC"
    order_clause = f"ORDER BY {db_sort_column} {sort_direction}"

    # Build LIMIT/OFFSET for pagination
    offset = page * size
    limit_clause = f"LIMIT {size} OFFSET {offset}"

    # Execute query
    query = f"SELECT * FROM tracks WHERE {where_clause} {order_clause} {limit_clause}"
    cursor.execute(query, params)
    results = cursor.fetchall()
    cursor.close()

    # Convert database rows to Track objects
    tracks = [storage.row_to_track(row) for row in results]

    # Calculate pagination metadata
    total_pages = (total_items + size - 1) // size if size > 0 else 0
    has_next = page < total_pages - 1
    has_previous = page > 0

    pagination = Pagination(
        page=page,
        size=size,
        total_pages=total_pages,
        total_items=total_items,
        has_next=has_next,
        has_previous=has_previous,
    )

    return TracksListResponse(data=tracks, pagination=pagination)


@router.post("", status_code=201)
def create_track(track_data: TrackCreate) -> Track:
    """
    Manually add a track to the library.
    """
    # Create track with empty file_props since it's manual creation
    track = storage.create_track(track_data, file_props=None)
    return track


@router.get("/{track_id}")
def get_track(track_id: UUID) -> Track:
    """
    Get a single track by its ID.
    """
    track = storage.get_track_by_id(track_id)
    if not track:
        raise HTTPException(status_code=404, detail=f"Track {track_id} not found")
    return track


@router.put("/{track_id}")
def update_track(track_id: UUID, track_update: TrackUpdate) -> Track:
    """
    Update a track's metadata.
    """
    # Convert Pydantic model to dict, excluding None values
    update_dict = track_update.model_dump(exclude_unset=True)

    updated_track = storage.update_track(track_id, update_dict)
    if not updated_track:
        raise HTTPException(status_code=404, detail=f"Track {track_id} not found")
    return updated_track


@router.delete("/{track_id}", status_code=204)
def delete_track(track_id: UUID):
    """
    Delete a track from the library.
    """
    success = storage.delete_track(track_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Track {track_id} not found")
    return None


@router.post("/bulk/delete")
def bulk_delete_tracks(request: BulkDeleteTracksRequest) -> BulkDeleteTracksResponse:
    """
    Delete multiple tracks from the library.
    """
    if not request.track_ids:
        return BulkDeleteTracksResponse(deleted_count=0)

    deleted_count = 0
    for track_id in request.track_ids:
        if storage.delete_track(track_id):
            deleted_count += 1

    return BulkDeleteTracksResponse(deleted_count=deleted_count)
