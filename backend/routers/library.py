"""Library scanning endpoints."""

import os
import re
import uuid
from typing import List
from uuid import UUID
from fastapi import APIRouter, HTTPException, BackgroundTasks
from models import ScanLibraryRequest, ScanLibraryResponse, ScanStatusResponse, Status
from utils.scan_utils import find_audio_files, extract_metadata
from utils.scan_progress import scan_tracker
from storage.track_storage import storage

router = APIRouter(prefix="/library", tags=["Library"])


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
                    "file_size_bytes": file_props.get("file_size_bytes"),
                    "file_format": file_props.get("file_format"),
                    "duration_seconds": file_props.get("duration_seconds"),
                    "bitrate_bps": file_props.get("bitrate_bps"),
                    "sample_rate_hz": file_props.get("sample_rate_hz"),
                },
            )
            counts["files_added"] += 1  # Count as added even though it's an update
        else:
            # New track - create it
            storage.create_track(track_data, file_props)
            counts["files_added"] += 1

        if error:
            scan_tracker.update_scan(scan_id, error=f"{file_path}: {error}")

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


@router.post("/scan", status_code=202)
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


@router.get("/scan/{scan_id}/status")
def get_scan_status(scan_id: UUID) -> ScanStatusResponse:
    """
    Get the current status of a library scan operation.
    """
    status = scan_tracker.get_scan_status(scan_id)
    if status is None:
        raise HTTPException(status_code=404, detail=f"Scan {scan_id} not found")
    return status
