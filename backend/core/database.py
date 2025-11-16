"""
Database connection module.
"""

import sqlite3
from contextlib import contextmanager
from typing import Generator, Tuple


@contextmanager
def get_db() -> Generator[Tuple[sqlite3.Connection, sqlite3.Cursor], None, None]:
    """
    Context manager for database connections.
    Opens a connection and cursor, yields them, and ensures cleanup.

    Usage:
        with get_db() as (conn, cursor):
            cursor.execute("SELECT * FROM tracks")
            results = cursor.fetchall()
    """
    connection = sqlite3.connect("beat_portal.db")
    connection.row_factory = sqlite3.Row  # Enable column access by name
    cursor = connection.cursor()
    try:
        yield connection, cursor
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        cursor.close()
        connection.close()


def get_db_connection() -> Generator[sqlite3.Connection, None, None]:
    """
    FastAPI dependency for database connections.
    Opens a connection per request and ensures cleanup.

    Usage in route:
        @app.get("/tracks")
        def get_tracks(db: sqlite3.Connection = Depends(get_db_connection)):
            cursor = db.cursor()
            ...
    """
    conn = sqlite3.connect("beat_portal.db")
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    """Initialize the database schema."""
    with get_db() as (conn, cursor):
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tracks (
                id TEXT PRIMARY KEY,
                title TEXT,
                artist TEXT,
                album TEXT,
                year INTEGER,
                genre TEXT,
                mood TEXT,
                bpm INTEGER,
                key TEXT,
                duration_seconds INTEGER,
                file_path TEXT UNIQUE,
                file_size_bytes INTEGER,
                file_format TEXT,
                bitrate_bps INTEGER,
                sample_rate_hz INTEGER,
                created_at TEXT,
                updated_at TEXT,
                last_played TEXT,
                play_count INTEGER DEFAULT 0,
                metadata_complete INTEGER DEFAULT 0
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS playlists (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                created_at TEXT,
                updated_at TEXT
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS playlist_tracks (
                playlist_id TEXT,
                track_id TEXT,
                position INTEGER,
                added_at TEXT,
                PRIMARY KEY (playlist_id, track_id),
                FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
                FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
            )
        """)
        # Create index for faster lookups
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id 
            ON playlist_tracks(playlist_id)
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_playlist_tracks_track_id 
            ON playlist_tracks(track_id)
        """)
        conn.commit()
