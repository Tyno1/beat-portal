"""
Storage module for managing tracks in the library.
Currently uses in-memory storage, but can be easily replaced with a database.
"""
from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID, uuid4

from models import Track, TrackCreate


class TrackStorage:
    """In-memory storage for tracks. Can be replaced with database later."""

    def __init__(self):
        self._tracks: Dict[UUID, Track] = {}
        self._tracks_by_path: Dict[str, UUID] = {}

    def create_track(self, track_data: TrackCreate, file_props: Optional[dict] = None) -> Track:
        """Create a new track in storage."""
        # Check if track with same path already exists
        if track_data.file_path in self._tracks_by_path:
            existing_id = self._tracks_by_path[track_data.file_path]
            return self._tracks[existing_id]

        # Create new track
        track_id = uuid4()
        now = datetime.now()
        file_props = file_props or {}

        track = Track(
            id=track_id,
            file_path=track_data.file_path,
            title=track_data.title,
            artist=track_data.artist,
            album=track_data.album,
            year=track_data.year,
            genre=track_data.genre,
            mood=track_data.mood,
            bpm=track_data.bpm,
            key=track_data.key,
            file_size=file_props.get('file_size'),
            file_format=file_props.get('file_format'),
            duration=file_props.get('duration'),
            bitrate=file_props.get('bitrate'),
            sample_rate=file_props.get('sample_rate'),
            created_at=now,
            updated_at=now,
            play_count=0,
        )

        self._tracks[track_id] = track
        self._tracks_by_path[track_data.file_path] = track_id

        return track

    def get_track_by_path(self, file_path: str) -> Optional[Track]:
        """Get a track by its file path."""
        track_id = self._tracks_by_path.get(file_path)
        if track_id:
            return self._tracks.get(track_id)
        return None

    def track_exists(self, file_path: str) -> bool:
        """Check if a track with the given path exists."""
        return file_path in self._tracks_by_path

    def get_all_tracks(self) -> List[Track]:
        """Get all tracks."""
        return list(self._tracks.values())

    def update_track(self, track_id: UUID, track_update: dict) -> Optional[Track]:
        """Update a track's metadata."""
        track = self._tracks.get(track_id)
        if not track:
            return None

        # Update fields
        for key, value in track_update.items():
            if value is not None:
                setattr(track, key, value)

        track.updated_at = datetime.now()
        return track

    def delete_track(self, track_id: UUID) -> bool:
        """Delete a track."""
        track = self._tracks.get(track_id)
        if not track:
            return False

        # Remove from both indexes
        if track.file_path:
            del self._tracks_by_path[track.file_path]
        del self._tracks[track_id]
        return True


# Global storage instance
storage = TrackStorage()
