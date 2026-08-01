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


def test_run_pipeline_returns_expected_shape():
    result = run_pipeline()
    assert result["meta"]["confident_reading_count"] < result["meta"]["raw_reading_count"]
    assert "linear" in result["models"] and "quadratic" in result["models"]
    assert len(result["aggregated_points"]) > 0


def test_run_pipeline_quadratic_beats_linear():
    result = run_pipeline()
    assert result["models"]["quadratic"]["r_squared"] > result["models"]["linear"]["r_squared"]
