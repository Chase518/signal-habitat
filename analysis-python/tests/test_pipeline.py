from unittest.mock import patch

from app.pipeline import aggregate_activity_by_temperature, run_pipeline
from app.simulate import generate_detection_events, generate_sensor_readings
from app.interpolate import interpolate_missing


def test_aggregate_activity_by_temperature_produces_bounded_frequencies():
    readings = interpolate_missing(generate_sensor_readings())
    detections = generate_detection_events(readings)
    aggregated = aggregate_activity_by_temperature(readings, detections)
    assert (aggregated["activity_frequency"] >= 0).all()
    assert (aggregated["activity_frequency"] <= 1).all()
    assert aggregated["n_readings"].sum() == len(readings)


def test_run_pipeline_returns_expected_shape(tmp_path):
    result = run_pipeline(db_path=tmp_path / "test.db")
    assert result["meta"]["confident_reading_count"] < result["meta"]["raw_reading_count"]
    assert "linear" in result["models"] and "quadratic" in result["models"]
    assert len(result["aggregated_points"]) > 0


def test_run_pipeline_quadratic_beats_linear(tmp_path):
    result = run_pipeline(db_path=tmp_path / "test.db")
    assert result["models"]["quadratic"]["r_squared"] > result["models"]["linear"]["r_squared"]


def test_run_pipeline_persists_raw_data_and_reuses_it_on_second_call(tmp_path):
    db_path = tmp_path / "test.db"

    with patch("app.pipeline.generate_sensor_readings", wraps=generate_sensor_readings) as spy:
        first = run_pipeline(db_path=db_path)
        second = run_pipeline(db_path=db_path)

    spy.assert_called_once()
    assert first["meta"]["raw_reading_count"] == second["meta"]["raw_reading_count"]
    assert first["meta"]["detection_count"] == second["meta"]["detection_count"]

    # Regression check: loading detections back from storage used to leave
    # the merged "detected" column as object dtype, which made an all-absent
    # bin's n_detections serialize as the JSON literal `false` instead of `0`.
    # (bool is a subclass of int in Python, so this must reject bool explicitly.)
    for point in second["aggregated_points"]:
        assert not isinstance(point["n_detections"], bool)
        assert isinstance(point["n_detections"], int)


def test_run_pipeline_persists_sensor_metadata(tmp_path):
    from app.storage import get_connection

    db_path = tmp_path / "test.db"
    run_pipeline(db_path=db_path)

    conn = get_connection(db_path)
    row_count = conn.execute("SELECT count(*) FROM sensor_metadata").fetchone()[0]
    conn.close()
    assert row_count == 5
