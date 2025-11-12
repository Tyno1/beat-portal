"""
This is the main file for the backend of the application.
"""

import os
import re
import uuid
from datetime import datetime
from typing import List
from uuid import UUID
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from models import (
    Pagination,
    ScanLibraryRequest,
    ScanLibraryResponse,
    Status,
    ScanStatusResponse,
    Track,
    TracksListResponse,
)

from storage import storage
from scan_utils import find_audio_files, extract_metadata
from scan_progress import scan_tracker


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1420", "http://127.0.0.1:1420"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """
    This is the root endpoint of the application.
    """
    return {"Hello": "World"}


def _process_file(
    scan_id: UUID, file_path: str, total_files: int, skip_duplicates: bool, counts: dict
) -> dict:
    """Process a single file and return updated counts."""
    counts["files_scanned"] += 1

    try:
        # Check if track already exists
        existing_track = storage.get_track_by_path(file_path)
        # If skip_duplicates is True and track exists, skip it
        if skip_duplicates and existing_track:
            counts["files_skipped"] += 1

            progress = (counts["files_scanned"] / total_files) * 100
            scan_tracker.update_scan(
                scan_id,
                files_scanned=counts["files_scanned"],
                files_skipped=counts["files_skipped"],
                progress=progress,
            )
            return counts

        # Process the file (extract metadata and create/update track)
        track_data, error, file_props = extract_metadata(file_path)
        if existing_track:
            # Track already exists - update it with new metadata
            storage.update_track(
                existing_track.id,
                {
                    "title": track_data.title,
                    "artist": track_data.artist,
                    "album": track_data.album,
                    "year": track_data.year,
                    "genre": track_data.genre,
                    "file_size": file_props.get("file_size"),
                    "file_format": file_props.get("file_format"),
                    "duration": file_props.get("duration"),
                    "bitrate": file_props.get("bitrate"),
                    "sample_rate": file_props.get("sample_rate"),
                },
            )
            counts["files_added"] += 1  # Count as added even though it's an update
        else:
            # New track - create it
            storage.create_track(track_data, file_props)
            counts["files_added"] += 1

        if error:
            scan_tracker.update_scan(scan_id, error=f"{file_path}: {error}")

        # Progress = (files_scanned / total_files) * 100
        # Each file increments progress by (1 / total_files) * 100
        # Example: 16 files = 6.25% per file, 100 files = 1% per file
        progress = (counts["files_scanned"] / total_files) * 100
        scan_tracker.update_scan(
            scan_id,
            files_scanned=counts["files_scanned"],
            files_added=counts["files_added"],
            files_skipped=counts["files_skipped"],
            progress=progress,
        )

    except (OSError, IOError, ValueError) as e:
        scan_tracker.update_scan(
            scan_id, error=f"Error processing {file_path}: {str(e)}"
        )

        progress = (counts["files_scanned"] / total_files) * 100
        scan_tracker.update_scan(
            scan_id,
            files_scanned=counts["files_scanned"],
            progress=progress,
        )

    return counts


def process_scan(
    scan_id: UUID, paths: List[str], include_subfolders: bool, skip_duplicates: bool
):
    """Background task to process library scan."""
    try:
        # Scan already created in endpoint, just ensure it exists
        if scan_tracker.get_scan_status(scan_id) is None:
            scan_tracker.create_scan(scan_id, paths=paths)

        # Discovery phase: find all audio files
        scan_tracker.update_scan(
            scan_id, status=Status.DISCOVERING, message="Discovering audio files..."
        )

        all_audio_files = []
        for path in paths:
            if not os.path.isdir(path):
                scan_tracker.update_scan(scan_id, error=f"Path does not exist: {path}")
                continue
            files = find_audio_files(path, include_subfolders)
            all_audio_files.extend(files)

        total_files = len(all_audio_files)

        if total_files == 0:
            scan_tracker.update_scan(
                scan_id,
                status=Status.COMPLETED,
                message="No audio files found",
                progress=100.0,
            )
            return

        # Processing phase: start processing files
        scan_tracker.update_scan(
            scan_id,
            status=Status.SCANNING,
            message=f"Processing {total_files} audio file(s)...",
            progress=0.0,
        )

        counts = {"files_scanned": 0, "files_added": 0, "files_skipped": 0}
        for file_path in all_audio_files:
            counts = _process_file(
                scan_id, file_path, total_files, skip_duplicates, counts
            )

        scan_tracker.complete_scan(scan_id)

    except (OSError, IOError, ValueError) as e:
        scan_tracker.fail_scan(scan_id, f"Scan failed: {str(e)}")


@app.post("/library/scan", status_code=202)
def scan_library(
    request: ScanLibraryRequest, background_tasks: BackgroundTasks
) -> ScanLibraryResponse:
    """
    Scan the library for new tracks and add them to the database.
    """
    if len(request.paths) == 0:
        raise HTTPException(status_code=400, detail="No paths provided")

    # Warn about scanning large root directories or home directories
    large_roots = {"/Users", "/", "/System", "/Library", "C:\\", "C:\\Users"}
    # Check for home directory patterns (e.g., /Users/username)
    home_pattern = re.compile(r"^/Users/[^/]+$|^/home/[^/]+$|^C:\\Users\\[^\\]+$")

    for path in request.paths:
        if path in large_roots:
            raise HTTPException(
                status_code=400,
                detail=f"Scanning root directory '{path}' is not recommended. Please select a specific music folder.",
            )
        # Warn about scanning entire home directories
        if home_pattern.match(path):
            raise HTTPException(
                status_code=400,
                detail=f"Scanning entire home directory '{path}' is not recommended. Please select a specific music folder (e.g., {path}/Music).",
            )

    # Validate all paths exist
    for path in request.paths:
        if not os.path.isdir(path):
            raise HTTPException(
                status_code=400,
                detail=f"Path {path} does not exist or is not a directory",
            )

    # Generate scan ID
    scan_id = uuid.uuid4()

    # Create scan status immediately so it's available for polling
    scan_tracker.create_scan(scan_id, paths=request.paths)

    # Note: watch_for_changes is not yet implemented
    # It would require file system watching (e.g., watchdog library)
    if request.watch_for_changes:
        # Log that watch_for_changes is requested but not implemented
        pass

    # Start background scan task
    include_subfolders = (
        request.include_subfolders if request.include_subfolders is not None else True
    )
    skip_duplicates = (
        request.skip_duplicates if request.skip_duplicates is not None else False
    )
    background_tasks.add_task(
        process_scan,
        scan_id,
        request.paths,
        include_subfolders,
        skip_duplicates,
    )

    return ScanLibraryResponse(
        scan_id=str(scan_id),
        status=Status.SCANNING,
        message=f"Library scan started for {len(request.paths)} path(s)",
    )


@app.get("/library/scan/{scan_id}/status")
def get_scan_status(scan_id: UUID) -> ScanStatusResponse:
    """
    Get the currxnt status of a library scan operation.
    """
    status = scan_tracker.get_scan_status(scan_id)
    if status is None:
        raise HTTPException(status_code=404, detail=f"Scan {scan_id} not found")
    return status


@app.get("/tracks")
def get_all_tracks(
    page: int = 0,
    size: int = 50,
    search: str = "",
    genre: str = "",
    mood: str = "",
    bpm_min: int = 0,
    bpm_max: int = 0,
    key: str = "",
    sort_by: str = "title",
    sort_order: str = "desc",
) -> TracksListResponse:
    """
    Get all tracks in the library with filtering, sorting, and pagination.
    """
    # Get all tracks from storage
    tracks = storage.get_all_tracks()

    # Apply search filter
    if search:
        search_lower = search.lower()
        tracks = [
            track
            for track in tracks
            if (
                (track.title and search_lower in track.title.lower())
                or (track.artist and search_lower in track.artist.lower())
                or (track.album and search_lower in track.album.lower())
            )
        ]

    # Apply genre filter
    if genre:
        tracks = [
            track
            for track in tracks
            if track.genre and track.genre.lower() == genre.lower()
        ]

    # Apply mood filter
    if mood:
        tracks = [
            track
            for track in tracks
            if track.mood and track.mood.lower() == mood.lower()
        ]

    # Apply BPM range filter
    if bpm_min > 0:
        tracks = [track for track in tracks if track.bpm and track.bpm >= bpm_min]
    if bpm_max > 0:
        tracks = [track for track in tracks if track.bpm and track.bpm <= bpm_max]

    # Apply key filter
    if key:
        tracks = [
            track for track in tracks if track.key and track.key.lower() == key.lower()
        ]

    # Apply sorting
    reverse_order = sort_order.lower() == "desc"

    # Handle None values in sorting by providing a default value
    def get_sort_value(track: Track, field: str):
        value = getattr(track, field, None)
        if value is None:
            # For strings, use empty string; for numbers, use 0 or -inf
            if field in ["title", "artist", "album", "genre", "mood", "key"]:
                return ""
            elif field in ["bpm", "year", "duration", "play_count"]:
                return 0 if not reverse_order else float("inf")
            elif field in ["created_at", "updated_at", "last_played"]:
                # For datetime fields, use a sentinel value that sorts appropriately
                from datetime import datetime

                return datetime.min if reverse_order else datetime.max
        return value

    if sort_by:
        try:
            tracks.sort(
                key=lambda track: get_sort_value(track, sort_by), reverse=reverse_order
            )
        except (AttributeError, TypeError):
            # If sort_by is invalid, fall back to default sorting
            tracks.sort(
                key=lambda track: get_sort_value(track, "title"), reverse=reverse_order
            )

    # Calculate pagination
    total_items = len(tracks)
    total_pages = (total_items + size - 1) // size if size > 0 else 0
    has_next = page < total_pages - 1
    has_previous = page > 0

    # Apply pagination
    start_idx = page * size
    end_idx = start_idx + size
    paginated_tracks = tracks[start_idx:end_idx]

    # Build pagination metadata
    pagination = Pagination(
        page=page,
        size=size,
        total_pages=total_pages,
        total_items=total_items,
        has_next=has_next,
        has_previous=has_previous,
    )

    return TracksListResponse(data=paginated_tracks, pagination=pagination)
