"""SQLite persistence for the raw simulated data (see 项目总纲.md's schema).

Python owns generating and storing `sensor_metadata`/`sensor_reading`/
`detection_event` -- the raw inputs to the analysis -- the same way the
Java backend owns caching `analysis_result`, the computed output.
Both share the same SQLite file (see docs/decisions.md) but each
service only ever writes its own tables.
"""
from __future__ import annotations

import sqlite3
from pathlib import Path

import pandas as pd

DEFAULT_DB_PATH = Path(__file__).resolve().parents[2] / "data" / "signal-habitat.db"

_SCHEMA = """
CREATE TABLE IF NOT EXISTS sensor_metadata (
    sensor_id TEXT PRIMARY KEY,
    base_temperature_c REAL NOT NULL,
    is_faulty INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sensor_reading (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensor_id TEXT NOT NULL REFERENCES sensor_metadata(sensor_id),
    timestamp TEXT NOT NULL,
    temperature REAL,
    humidity REAL,
    battery REAL NOT NULL,
    rssi REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS detection_event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensor_id TEXT NOT NULL REFERENCES sensor_metadata(sensor_id),
    timestamp TEXT NOT NULL
);
"""


def get_connection(db_path: Path = DEFAULT_DB_PATH) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    return sqlite3.connect(db_path)


def init_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(_SCHEMA)
    conn.commit()


def has_readings(conn: sqlite3.Connection) -> bool:
    cursor = conn.execute("SELECT 1 FROM sensor_reading LIMIT 1")
    return cursor.fetchone() is not None


def save_sensor_metadata(conn: sqlite3.Connection, metadata: pd.DataFrame) -> None:
    metadata.to_sql("sensor_metadata", conn, if_exists="append", index=False)
    conn.commit()


def save_sensor_readings(conn: sqlite3.Connection, readings: pd.DataFrame) -> None:
    readings = readings.copy()
    readings["timestamp"] = readings["timestamp"].astype(str)
    readings.to_sql("sensor_reading", conn, if_exists="append", index=False)
    conn.commit()


def save_detection_events(conn: sqlite3.Connection, events: pd.DataFrame) -> None:
    events = events[["sensor_id", "timestamp"]].copy()
    events["timestamp"] = events["timestamp"].astype(str)
    events.to_sql("detection_event", conn, if_exists="append", index=False)
    conn.commit()


def load_sensor_readings(conn: sqlite3.Connection) -> pd.DataFrame:
    readings = pd.read_sql(
        "SELECT sensor_id, timestamp, temperature, humidity, battery, rssi FROM sensor_reading", conn
    )
    readings["timestamp"] = pd.to_datetime(readings["timestamp"])
    return readings


def load_detection_events(conn: sqlite3.Connection) -> pd.DataFrame:
    """Returns confirmed detections only, shaped like generate_detection_events()'s output."""
    events = pd.read_sql("SELECT sensor_id, timestamp FROM detection_event", conn)
    events["timestamp"] = pd.to_datetime(events["timestamp"])
    events["detected"] = True
    return events
