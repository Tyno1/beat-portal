"""
Storage module for managing tracks in the library.
Uses SQLite database for persistent storage.
"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4

from core.database import get_db
from models import Track, TrackCreate


# SQL query constants
SELECT_TRACK_BY_ID = "SELECT * FROM tracks WHERE id = ?"


class TrackStorage:
    """Database-backed storage for tracks."""

    @staticmethod
    def row_to_track(row) -> Track:
        """Convert a database row to a Track object."""
        row_dict = dict(row)
        # Convert metadata_complete from int to bool
        if (
            "metadata_complete" in row_dict
            and row_dict["metadata_complete"] is not None
        ):
            row_dict["metadata_complete"] = bool(row_dict["metadata_complete"])
        return Track(**row_dict)

    def create_track(
        self, track_data: TrackCreate, file_props: Optional[dict] = None
    ) -> Track:
        """Create a new track in storage."""
        file_props = file_props or {}
        track_id = uuid4()
        now = datetime.now()

        with get_db() as (conn, cursor):
            # Check if track with same path already exists
            cursor.execute(
                "SELECT * FROM tracks WHERE file_path = ?", (track_data.file_path,)
            )
            result = cursor.fetchone()
            if result:
                return self.row_to_track(result)

            # Insert new track
            cursor.execute(
                """INSERT INTO tracks 
                   (id, file_path, title, artist, album, year, genre, mood, bpm, key, 
                    file_size_bytes, file_format, duration_seconds, bitrate_bps, sample_rate_hz, 
                    created_at, updated_at, play_count) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    str(track_id),
                    track_data.file_path,
                    track_data.title,
                    track_data.artist,
                    track_data.album,
                    track_data.year,
                    track_data.genre,
                    track_data.mood,
                    track_data.bpm,
                    track_data.key,
                    file_props.get("file_size_bytes"),
                    file_props.get("file_format"),
                    file_props.get("duration_seconds"),
                    file_props.get("bitrate_bps"),
                    file_props.get("sample_rate_hz"),
                    now.isoformat(),
                    now.isoformat(),
                    0,
                ),
            )
            conn.commit()

            # Fetch the created track
            cursor.execute(SELECT_TRACK_BY_ID, (str(track_id),))
            result = cursor.fetchone()
            if result:
                return self.row_to_track(result)
            else:
                raise RuntimeError("Failed to create track")

    def get_track_by_path(self, file_path: str) -> Optional[Track]:
        """Get a track by its file path."""
        with get_db() as (_, cursor):
            cursor.execute("SELECT * FROM tracks WHERE file_path = ?", (file_path,))
            result = cursor.fetchone()
            if result:
                return self.row_to_track(result)
            return None

    def track_exists(self, file_path: str) -> bool:
        """Check if a track with the given path exists."""
        with get_db() as (_, cursor):
            cursor.execute(
                "SELECT COUNT(*) FROM tracks WHERE file_path = ?", (file_path,)
            )
            result = cursor.fetchone()
            return result[0] > 0 if result else False

    def get_all_tracks(self) -> List[Track]:
        """Get all tracks."""
        with get_db() as (_, cursor):
            cursor.execute("SELECT * FROM tracks")
            results = cursor.fetchall()
            return [self.row_to_track(row) for row in results]

    def get_track_by_id(self, track_id: UUID) -> Optional[Track]:
        """Get a track by its ID."""
        with get_db() as (_, cursor):
            cursor.execute(SELECT_TRACK_BY_ID, (str(track_id),))
            result = cursor.fetchone()
            if result:
                return self.row_to_track(result)
            return None

    def update_track(self, track_id: UUID, track_update: dict) -> Optional[Track]:
        """Update a track's metadata."""
        with get_db() as (conn, cursor):
            # Check if track exists
            cursor.execute(SELECT_TRACK_BY_ID, (str(track_id),))
            result = cursor.fetchone()
            if not result:
                return None

            # Build UPDATE query dynamically based on provided fields
            update_fields = []
            update_values = []

            for key, value in track_update.items():
                if value is not None:
                    update_fields.append(f"{key} = ?")
                    update_values.append(value)

            if not update_fields:
                # No fields to update, return existing track
                return self.row_to_track(result)

            # Add updated_at timestamp
            update_fields.append("updated_at = ?")
            update_values.append(datetime.now().isoformat())

            # Add track_id for WHERE clause
            update_values.append(str(track_id))

            # Execute UPDATE
            update_query = f"UPDATE tracks SET {', '.join(update_fields)} WHERE id = ?"
            cursor.execute(update_query, update_values)
            conn.commit()

            # Fetch updated track
            cursor.execute(SELECT_TRACK_BY_ID, (str(track_id),))
            result = cursor.fetchone()
            if result:
                return self.row_to_track(result)
            return None

    def delete_track(self, track_id: UUID) -> bool:
        """Delete a track."""
        with get_db() as (conn, cursor):
            # Check if track exists
            cursor.execute("SELECT COUNT(*) FROM tracks WHERE id = ?", (str(track_id),))
            result = cursor.fetchone()
            if not result or result[0] == 0:
                return False

            # Delete the track
            cursor.execute("DELETE FROM tracks WHERE id = ?", (str(track_id),))
            conn.commit()
            return True


# Global storage instance
storage = TrackStorage()
