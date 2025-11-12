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