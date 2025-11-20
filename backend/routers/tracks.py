"""Track management endpoints."""

import sqlite3
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends
from core.database import get_db_connection
from models import (
    BulkDeleteTracksRequest,
    BulkDeleteTracksResponse,
    GetTracksQueryParams,
    Pagination,
    ResetMetadataRequest,
    ResetMetadataResponse,
    Track,
    TrackCreate,
    TrackUpdate,
    TracksListResponse,
)
from storage.track_storage import storage
from utils.scan_utils import extract_metadata

router = APIRouter(prefix="/tracks", tags=["Tracks"])


@router.get("")
def get_all_tracks(
    query_params: GetTracksQueryParams = Depends(),
    db: sqlite3.Connection = Depends(get_db_connection),
) -> TracksListResponse:
    """
    Get all tracks in the library with filtering, sorting, and pagination.
    """
    cursor = db.cursor()

    # Build WHERE clause for filtering
    where_conditions = []
    params = []

    if query_params.search:
        where_conditions.append("(title LIKE ? OR artist LIKE ? OR album LIKE ?)")
        search_param = f"%{query_params.search}%"
        params.extend([search_param, search_param, search_param])

    if query_params.genre:
        where_conditions.append("genre = ?")
        params.append(query_params.genre)

    if query_params.mood:
        where_conditions.append("mood = ?")
        params.append(query_params.mood)

    if query_params.bpm_min > 0:
        where_conditions.append("bpm >= ?")
        params.append(query_params.bpm_min)

    if query_params.bpm_max > 0:
        where_conditions.append("bpm <= ?")
        params.append(query_params.bpm_max)

    if query_params.key:
        where_conditions.append("key = ?")
        params.append(query_params.key)

    if query_params.artist:
        where_conditions.append("artist = ?")
        params.append(query_params.artist)

    if query_params.year_min > 0:
        where_conditions.append("year >= ?")
        params.append(query_params.year_min)

    if query_params.year_max > 0:
        where_conditions.append("year <= ?")
        params.append(query_params.year_max)

    where_clause = " AND ".join(where_conditions) if where_conditions else "1=1"

    # Get total count for pagination
    count_query = f"SELECT COUNT(*) FROM tracks WHERE {where_clause}"
    cursor.execute(count_query, params)
    total_items = cursor.fetchone()[0]

    # Build ORDER BY clause - validate sort_by parameter
    valid_sort_columns = ["title", "artist", "bpm", "key", "year", "created_at"]
    sort_by = query_params.sort_by
    if sort_by not in valid_sort_columns:
        sort_by = "title"

    db_sort_column = sort_by
    sort_direction = "DESC" if query_params.sort_order.lower() == "desc" else "ASC"
    order_clause = f"ORDER BY {db_sort_column} {sort_direction}"

    offset = (query_params.page - 1) * query_params.size
    limit_clause = f"LIMIT {query_params.size} OFFSET {offset}"

    # Execute query
    query = f"SELECT * FROM tracks WHERE {where_clause} {order_clause} {limit_clause}"
    cursor.execute(query, params)
    results = cursor.fetchall()
    cursor.close()

    # Convert database rows to Track objects
    tracks = [storage.row_to_track(row) for row in results]

    # Calculate pagination metadata (page starts from 1)
    total_pages = (total_items + query_params.size - 1) // query_params.size if query_params.size > 0 else 0
    has_next = query_params.page < total_pages
    has_previous = query_params.page > 1

    pagination = Pagination(
        page=query_params.page,
        size=query_params.size,
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


@router.post("/{track_id}/reset-metadata")
def reset_track_metadata(
    track_id: UUID, request: Optional[ResetMetadataRequest] = None
) -> ResetMetadataResponse:
    """
    Reset track metadata to original values from the audio file.
    Reads metadata directly from the file tags and optionally updates the track.
    """
    # Get track from database
    track = storage.get_track_by_id(track_id)
    if not track:
        raise HTTPException(status_code=404, detail=f"Track {track_id} not found")

    if not track.file_path:
        raise HTTPException(
            status_code=400, detail=f"Track {track_id} has no file path"
        )

    # Extract original metadata from file
    track_data, error, _ = extract_metadata(track.file_path)
    if error:
        raise HTTPException(
            status_code=500, detail=f"Error reading metadata from file: {error}"
        )

    # Build response with original metadata
    original_metadata = {
        "title": track_data.title,
        "artist": track_data.artist,
        "album": track_data.album,
        "year": track_data.year,
        "genre": track_data.genre,
        "bpm": track_data.bpm,
        "key": track_data.key,
    }

    # Optionally update the track in database
    should_update = request.update_track if request else False
    if should_update:
        update_dict = {
            "title": track_data.title,
            "artist": track_data.artist,
            "album": track_data.album,
            "year": track_data.year,
            "genre": track_data.genre,
            "bpm": track_data.bpm,
            "key": track_data.key,
        }
        # Remove None values
        update_dict = {k: v for k, v in update_dict.items() if v is not None}
        if update_dict:
            storage.update_track(track_id, update_dict)

    return ResetMetadataResponse(
        track_id=track_id,
        file_path=track.file_path,
        original_metadata=original_metadata,
        updated=should_update,
    )
