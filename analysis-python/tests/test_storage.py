from app.simulate import generate_detection_events, generate_sensor_metadata, generate_sensor_readings
from app.storage import (
    get_connection,
    has_readings,
    init_schema,
    load_detection_events,
    load_sensor_readings,
    save_detection_events,
    save_sensor_metadata,
    save_sensor_readings,
)


def test_has_readings_false_on_empty_db(tmp_path):
    conn = get_connection(tmp_path / "test.db")
    init_schema(conn)
    assert has_readings(conn) is False
    conn.close()


def test_save_and_load_round_trip(tmp_path):
    conn = get_connection(tmp_path / "test.db")
    init_schema(conn)

    readings = generate_sensor_readings(seed=1)
    detections = generate_detection_events(readings, seed=2)

    save_sensor_metadata(conn, generate_sensor_metadata())
    save_sensor_readings(conn, readings)
    save_detection_events(conn, detections[detections["detected"]])

    assert has_readings(conn) is True

    loaded_readings = load_sensor_readings(conn)
    loaded_detections = load_detection_events(conn)
    conn.close()

    assert len(loaded_readings) == len(readings)
    assert set(loaded_readings["sensor_id"].unique()) == set(readings["sensor_id"].unique())
    assert loaded_detections["detected"].all()
    assert len(loaded_detections) == int(detections["detected"].sum())


def test_schema_init_is_idempotent(tmp_path):
    conn = get_connection(tmp_path / "test.db")
    init_schema(conn)
    init_schema(conn)  # must not raise
    conn.close()
