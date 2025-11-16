"""
Storage module for managing playlists in the library.
Uses SQLite database for persistent storage.
"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4

from core.database import get_db
from models import Playlist, PlaylistDetail, Track


class PlaylistStorage:
    """Database-backed storage for playlists."""

    @staticmethod
    def row_to_playlist(row) -> Playlist:
        """Convert a database row to a Playlist object."""
        row_dict = dict(row)
        return Playlist(**row_dict)

    def create_playlist(self, name: str, description: Optional[str] = None) -> Playlist:
        """Create a new playlist."""
        playlist_id = uuid4()
        now = datetime.now()

        with get_db() as (conn, cursor):
            cursor.execute(
                """INSERT INTO playlists (id, name, description, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?)""",
                (
                    str(playlist_id),
                    name,
                    description,
                    now.isoformat(),
                    now.isoformat(),
                ),
            )
            conn.commit()

            # Fetch the created playlist
            cursor.execute("SELECT * FROM playlists WHERE id = ?", (str(playlist_id),))
            result = cursor.fetchone()
            if result:
                return self.row_to_playlist(result)
            else:
                raise RuntimeError("Failed to create playlist")

    def get_playlist_by_id(self, playlist_id: UUID) -> Optional[Playlist]:
        """Get a playlist by its ID."""
        with get_db() as (_, cursor):
            cursor.execute("SELECT * FROM playlists WHERE id = ?", (str(playlist_id),))
            result = cursor.fetchone()
            if result:
                return self.row_to_playlist(result)
            return None

    def get_all_playlists(self) -> List[Playlist]:
        """Get all playlists with track count and duration."""
        with get_db() as (_, cursor):
            cursor.execute("""
                SELECT p.*,
                       COUNT(pt.track_id) as track_count,
                       COALESCE(SUM(t.duration_seconds), 0) as total_duration_seconds
                FROM playlists p
                LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id
                LEFT JOIN tracks t ON pt.track_id = t.id
                GROUP BY p.id
                ORDER BY p.created_at DESC
            """)
            results = cursor.fetchall()
            playlists = []
            for row in results:
                row_dict = dict(row)
                playlists.append(Playlist(**row_dict))
            return playlists

    def update_playlist(
        self,
        playlist_id: UUID,
        name: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Optional[Playlist]:
        """Update a playlist's metadata."""
        with get_db() as (conn, cursor):
            # Check if playlist exists
            cursor.execute("SELECT * FROM playlists WHERE id = ?", (str(playlist_id),))
            result = cursor.fetchone()
            if not result:
                return None

            # Build UPDATE query dynamically
            update_fields = []
            update_values = []

            if name is not None:
                update_fields.append("name = ?")
                update_values.append(name)

            if description is not None:
                update_fields.append("description = ?")
                update_values.append(description)

            if not update_fields:
                # No fields to update, return existing playlist
                return self.row_to_playlist(result)

            # Add updated_at timestamp
            update_fields.append("updated_at = ?")
            update_values.append(datetime.now().isoformat())

            # Add playlist_id for WHERE clause
            update_values.append(str(playlist_id))

            # Execute UPDATE
            update_query = (
                f"UPDATE playlists SET {', '.join(update_fields)} WHERE id = ?"
            )
            cursor.execute(update_query, update_values)
            conn.commit()

            # Fetch updated playlist
            cursor.execute("SELECT * FROM playlists WHERE id = ?", (str(playlist_id),))
            result = cursor.fetchone()
            if result:
                return self.row_to_playlist(result)
            return None

    def delete_playlist(self, playlist_id: UUID) -> bool:
        """Delete a playlist (cascade deletes playlist_tracks)."""
        with get_db() as (conn, cursor):
            # Check if playlist exists
            cursor.execute(
                "SELECT COUNT(*) FROM playlists WHERE id = ?", (str(playlist_id),)
            )
            result = cursor.fetchone()
            if not result or result[0] == 0:
                return False

            # Delete the playlist (cascade will delete playlist_tracks)
            cursor.execute("DELETE FROM playlists WHERE id = ?", (str(playlist_id),))
            conn.commit()
            return True

    def get_playlist_detail(self, playlist_id: UUID) -> Optional[PlaylistDetail]:
        """Get a playlist with its tracks."""
        with get_db() as (_, cursor):
            # Get playlist
            cursor.execute("SELECT * FROM playlists WHERE id = ?", (str(playlist_id),))
            playlist_row = cursor.fetchone()
            if not playlist_row:
                return None

            playlist_dict = dict(playlist_row)

            # Get tracks for this playlist
            cursor.execute(
                """
                SELECT t.*
                FROM tracks t
                INNER JOIN playlist_tracks pt ON t.id = pt.track_id
                WHERE pt.playlist_id = ?
                ORDER BY pt.position ASC, pt.added_at ASC
            """,
                (str(playlist_id),),
            )
            track_rows = cursor.fetchall()

            # Convert tracks
            from storage.track_storage import storage

            tracks = [storage.row_to_track(row) for row in track_rows]

            # Calculate track_count and total_duration_seconds
            track_count = len(tracks)
            total_duration_seconds = sum(track.duration_seconds or 0 for track in tracks)

            playlist_dict["track_count"] = track_count
            playlist_dict["total_duration_seconds"] = total_duration_seconds

            return PlaylistDetail(**playlist_dict, tracks=tracks)

    def add_tracks_to_playlist(self, playlist_id: UUID, track_ids: List[UUID]) -> bool:
        """Add tracks to a playlist."""
        if not track_ids:
            return True

        with get_db() as (conn, cursor):
            # Check if playlist exists
            cursor.execute(
                "SELECT COUNT(*) FROM playlists WHERE id = ?", (str(playlist_id),)
            )
            if cursor.fetchone()[0] == 0:
                return False

            # Get current max position
            cursor.execute(
                "SELECT COALESCE(MAX(position), -1) FROM playlist_tracks WHERE playlist_id = ?",
                (str(playlist_id),),
            )
            max_position = cursor.fetchone()[0] or -1

            now = datetime.now().isoformat()
            for i, track_id in enumerate(track_ids):
                # Check if track exists
                cursor.execute(
                    "SELECT COUNT(*) FROM tracks WHERE id = ?", (str(track_id),)
                )
                if cursor.fetchone()[0] == 0:
                    continue  # Skip non-existent tracks

                # Check if already in playlist
                cursor.execute(
                    "SELECT COUNT(*) FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?",
                    (str(playlist_id), str(track_id)),
                )
                if cursor.fetchone()[0] > 0:
                    continue  # Skip duplicates

                # Add track
                cursor.execute(
                    """INSERT INTO playlist_tracks (playlist_id, track_id, position, added_at)
                       VALUES (?, ?, ?, ?)""",
                    (str(playlist_id), str(track_id), max_position + 1 + i, now),
                )

            conn.commit()
            return True

    def remove_tracks_from_playlist(
        self, playlist_id: UUID, track_ids: List[UUID]
    ) -> bool:
        """Remove tracks from a playlist."""
        if not track_ids:
            return True

        with get_db() as (conn, cursor):
            # Check if playlist exists
            cursor.execute(
                "SELECT COUNT(*) FROM playlists WHERE id = ?", (str(playlist_id),)
            )
            if cursor.fetchone()[0] == 0:
                return False

            # Remove tracks
            placeholders = ",".join("?" * len(track_ids))
            cursor.execute(
                f"""DELETE FROM playlist_tracks
                   WHERE playlist_id = ? AND track_id IN ({placeholders})""",
                [str(playlist_id)] + [str(tid) for tid in track_ids],
            )
            conn.commit()
            return True


# Global storage instance
playlist_storage = PlaylistStorage()
