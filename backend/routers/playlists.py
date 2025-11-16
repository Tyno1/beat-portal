"""Playlist management endpoints."""

import json
import os
import shutil
from pathlib import Path
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException

from models import (
    AddTracksToPlaylistRequest,
    CreatePlaylistRequest,
    ExportPlaylistRequest,
    ExportPlaylistResponse,
    Format,
    Playlist,
    PlaylistDetail,
    RemoveTracksFromPlaylistRequest,
    Track,
    UpdatePlaylistRequest,
)
from storage.playlist_storage import playlist_storage

router = APIRouter(prefix="/playlists", tags=["Playlists"])


@router.get("")
def get_all_playlists() -> List[Playlist]:
    """
    Get all playlists.
    """
    return playlist_storage.get_all_playlists()


@router.post("", status_code=201)
def create_playlist(request: CreatePlaylistRequest) -> Playlist:
    """
    Create a new playlist.
    """
    playlist = playlist_storage.create_playlist(
        name=request.name, description=request.description
    )
    return playlist


@router.get("/{playlist_id}")
def get_playlist(playlist_id: UUID) -> PlaylistDetail:
    """
    Get playlist details including tracks.
    """
    playlist = playlist_storage.get_playlist_detail(playlist_id)
    if not playlist:
        raise HTTPException(status_code=404, detail=f"Playlist {playlist_id} not found")
    return playlist


@router.put("/{playlist_id}")
def update_playlist(playlist_id: UUID, request: UpdatePlaylistRequest) -> Playlist:
    """
    Update playlist name or description.
    """
    updated_playlist = playlist_storage.update_playlist(
        playlist_id=playlist_id, name=request.name, description=request.description
    )
    if not updated_playlist:
        raise HTTPException(status_code=404, detail=f"Playlist {playlist_id} not found")
    return updated_playlist


@router.delete("/{playlist_id}", status_code=204)
def delete_playlist(playlist_id: UUID):
    """
    Delete a playlist.
    """
    success = playlist_storage.delete_playlist(playlist_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Playlist {playlist_id} not found")
    return None


@router.post("/{playlist_id}/tracks")
def add_tracks_to_playlist(playlist_id: UUID, request: AddTracksToPlaylistRequest):
    """
    Add one or more tracks to a playlist.
    """
    if not request.track_ids:
        raise HTTPException(status_code=400, detail="No track IDs provided")

    success = playlist_storage.add_tracks_to_playlist(playlist_id, request.track_ids)
    if not success:
        raise HTTPException(status_code=404, detail=f"Playlist {playlist_id} not found")
    return {"message": "Tracks added successfully"}


@router.delete("/{playlist_id}/tracks")
def remove_tracks_from_playlist(
    playlist_id: UUID, request: RemoveTracksFromPlaylistRequest
):
    """
    Remove tracks from a playlist.
    """
    if not request.track_ids:
        raise HTTPException(status_code=400, detail="No track IDs provided")

    success = playlist_storage.remove_tracks_from_playlist(
        playlist_id, request.track_ids
    )
    if not success:
        raise HTTPException(status_code=404, detail=f"Playlist {playlist_id} not found")
    return {"message": "Tracks removed successfully"}


def _normalize_format(export_format: Optional[Format]) -> Format:
    """Normalize export format from request."""
    if export_format is None:
        return Format.M3U
    if isinstance(export_format, str):
        format_map = {
            "m3u": Format.M3U,
            "pls": Format.PLS,
            "xspf": Format.XSPF,
            "json": Format.JSON,
        }
        return format_map.get(export_format.lower(), Format.M3U)
    return export_format


def _generate_safe_filename(playlist_name: Optional[str]) -> str:
    """Generate a safe filename from playlist name."""
    name = playlist_name or "playlist"
    safe_name = "".join(c for c in name if c.isalnum() or c in (" ", "-", "_")).strip()
    return safe_name.replace(" ", "_")[:50]


def _export_m3u(
    file_path: Path, tracks_list: List[Track], file_mapping: dict[str, Path]
):
    """Export playlist in M3U format with relative paths to copied files."""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write("#EXTM3U\n")
        for track in tracks_list:
            if track.file_path and track.file_path in file_mapping:
                copied_file = file_mapping[track.file_path]
                relative_path = copied_file.relative_to(file_path.parent)
                artist = track.artist or "Unknown"
                title = track.title or "Unknown"
                duration = track.duration_seconds or -1
                f.write(f"#EXTINF:{duration},{artist} - {title}\n")
                f.write(f"{relative_path}\n")


def _export_pls(
    file_path: Path, tracks_list: List[Track], file_mapping: dict[str, Path]
):
    """Export playlist in PLS format with relative paths to copied files."""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write("[playlist]\n")
        f.write(f"NumberOfEntries={len(tracks_list)}\n")
        for i, track in enumerate(tracks_list, 1):
            if track.file_path and track.file_path in file_mapping:
                copied_file = file_mapping[track.file_path]
                relative_path = copied_file.relative_to(file_path.parent)
                artist = track.artist or "Unknown"
                title = track.title or "Unknown"
                f.write(f"File{i}={relative_path}\n")
                f.write(f"Title{i}={artist} - {title}\n")
                if track.duration_seconds:
                    f.write(f"Length{i}={track.duration_seconds}\n")
                f.write("\n")


def _write_xspf_track(
    f, track: Track, file_mapping: dict[str, Path], playlist_file: Path
):
    """Write a single track entry in XSPF format with relative path."""
    if not track.file_path or track.file_path not in file_mapping:
        return
    copied_file = file_mapping[track.file_path]
    relative_path = copied_file.relative_to(playlist_file.parent)
    f.write("    <track>\n")
    if track.title:
        f.write(f"      <title>{track.title}</title>\n")
    if track.artist:
        f.write(f"      <creator>{track.artist}</creator>\n")
    if track.album:
        f.write(f"      <album>{track.album}</album>\n")
    if track.duration_seconds:
        f.write(f"      <duration>{track.duration_seconds * 1000}</duration>\n")
    f.write(f"      <location>{relative_path}</location>\n")
    f.write("    </track>\n")


def _export_xspf(
    file_path: Path,
    playlist: PlaylistDetail,
    tracks_list: List[Track],
    file_mapping: dict[str, Path],
):
    """Export playlist in XSPF format with relative paths to copied files."""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<playlist version="1" xmlns="http://xspf.org/ns/0/">\n')
        f.write(f"  <title>{playlist.name}</title>\n")
        if playlist.description:
            f.write(f"  <annotation>{playlist.description}</annotation>\n")
        f.write("  <trackList>\n")
        for track in tracks_list:
            _write_xspf_track(f, track, file_mapping, file_path)
        f.write("  </trackList>\n")
        f.write("</playlist>\n")


def _export_json(
    file_path: Path,
    playlist: PlaylistDetail,
    tracks_list: List[Track],
    file_mapping: dict[str, Path],
):
    """Export playlist in JSON format with relative paths to copied files."""
    tracks_data = []
    for track in tracks_list:
        if track.file_path and track.file_path in file_mapping:
            copied_file = file_mapping[track.file_path]
            relative_path = str(copied_file.relative_to(file_path.parent))
        else:
            relative_path = None

        tracks_data.append(
            {
                "id": str(track.id),
                "title": track.title,
                "artist": track.artist,
                "album": track.album,
                "file_path": relative_path,
                "duration_seconds": track.duration_seconds,
            }
        )

    export_data = {
        "name": playlist.name,
        "description": playlist.description,
        "track_count": playlist.track_count,
        "total_duration_seconds": playlist.total_duration_seconds,
        "tracks": tracks_data,
    }
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)


def _copy_track_files(
    tracks_list: List[Track], destination_folder: Path
) -> tuple[dict[str, Path], List[str]]:
    """Copy track files to destination folder.

    Returns:
        Tuple of (mapping from original file_path to copied file Path, list of error messages)
    """
    file_mapping = {}
    errors = []
    for track in tracks_list:
        if not track.file_path:
            continue
        try:
            source_path = Path(track.file_path)
            if not source_path.exists():
                errors.append(f"File not found: {track.file_path}")
                continue

            # Use original filename, handle duplicates by appending number
            dest_file = destination_folder / source_path.name
            counter = 1
            while dest_file.exists():
                stem = source_path.stem
                suffix = source_path.suffix
                dest_file = destination_folder / f"{stem}_{counter}{suffix}"
                counter += 1

            shutil.copy2(source_path, dest_file)
            file_mapping[track.file_path] = dest_file
        except OSError as e:
            errors.append(f"Error copying {track.file_path}: {str(e)}")
    return file_mapping, errors


def _export_playlist_file(
    export_format: Format,
    file_path: Path,
    playlist: PlaylistDetail,
    tracks_list: List[Track],
    file_mapping: dict[str, Path],
):
    """Export playlist to file based on format."""
    if export_format == Format.M3U:
        _export_m3u(file_path, tracks_list, file_mapping)
    elif export_format == Format.PLS:
        _export_pls(file_path, tracks_list, file_mapping)
    elif export_format == Format.XSPF:
        _export_xspf(file_path, playlist, tracks_list, file_mapping)
    elif export_format == Format.JSON:
        _export_json(file_path, playlist, tracks_list, file_mapping)
    else:
        raise HTTPException(
            status_code=400, detail=f"Unsupported format: {export_format}"
        )


@router.post("/{playlist_id}/export")
def export_playlist(
    playlist_id: UUID, request: ExportPlaylistRequest
) -> ExportPlaylistResponse:
    """
    Export playlist in various formats (M3U, PLS, XSPF, JSON).
    """
    # Get playlist with tracks
    playlist = playlist_storage.get_playlist_detail(playlist_id)
    if not playlist:
        raise HTTPException(status_code=404, detail=f"Playlist {playlist_id} not found")

    if not playlist.tracks:
        raise HTTPException(status_code=400, detail="Playlist is empty")

    # Normalize format
    export_format = _normalize_format(request.format)

    # Create exports directory if it doesn't exist
    export_dir = Path("exports")
    export_dir.mkdir(exist_ok=True)

    # Generate folder name for this playlist export
    safe_name = _generate_safe_filename(playlist.name)
    playlist_folder = export_dir / safe_name
    playlist_folder.mkdir(exist_ok=True)

    # Create music subfolder for copied files
    music_folder = playlist_folder / "music"
    music_folder.mkdir(exist_ok=True)

    # Copy track files to music folder
    tracks_list = playlist.tracks or []
    file_mapping, copy_errors = _copy_track_files(tracks_list, music_folder)

    if copy_errors:
        # Log errors but continue with export
        # Could optionally raise an error if all files failed
        pass

    # Generate playlist filename
    extension_map = {
        Format.M3U: "m3u",
        Format.PLS: "pls",
        Format.XSPF: "xspf",
        Format.JSON: "json",
    }
    extension = extension_map.get(export_format, "m3u")
    playlist_file = playlist_folder / f"{safe_name}.{extension}"

    # Export playlist file with relative paths to copied music files
    _export_playlist_file(
        export_format, playlist_file, playlist, tracks_list, file_mapping
    )

    # Return absolute path to the folder (not just the playlist file)
    abs_path = os.path.abspath(playlist_folder)
    format_str = (
        export_format.value if hasattr(export_format, "value") else str(export_format)
    )

    return ExportPlaylistResponse(file_path=abs_path, format=format_str)
