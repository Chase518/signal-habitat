import numpy as np

from app.simulate import (
    DAYS,
    READINGS_PER_DAY,
    SENSOR_IDS,
    generate_detection_events,
    generate_sensor_readings,
)


def test_generate_sensor_readings_shape_and_columns():
    df = generate_sensor_readings()
    assert len(df) == len(SENSOR_IDS) * DAYS * READINGS_PER_DAY
    assert set(df["sensor_id"].unique()) == set(SENSOR_IDS)
    assert list(df.columns) == ["timestamp", "sensor_id", "temperature", "humidity", "battery", "rssi"]


def test_generate_sensor_readings_has_missing_values_for_interpolation_to_fix():
    df = generate_sensor_readings(missing_fraction=0.05)
    assert df["temperature"].isna().sum() > 0
    assert df["humidity"].isna().sum() > 0


def test_generate_sensor_readings_is_deterministic_given_seed():
    a = generate_sensor_readings(seed=1)
    b = generate_sensor_readings(seed=1)
    assert a["temperature"].equals(b["temperature"])


def test_faulty_sensor_has_lower_battery_and_weaker_rssi():
    df = generate_sensor_readings()
    battery_by_sensor = df.groupby("sensor_id")["battery"].min()
    rssi_by_sensor = df.groupby("sensor_id")["rssi"].min()
    faulty = SENSOR_IDS[-1]
    assert battery_by_sensor[faulty] < battery_by_sensor.drop(faulty).min()
    assert rssi_by_sensor[faulty] < rssi_by_sensor.drop(faulty).min()


def test_detection_events_align_with_readings_and_have_no_detections_on_nan_temperature():
    readings = generate_sensor_readings()
    detections = generate_detection_events(readings)
    assert len(detections) == len(readings)
    nan_mask = readings["temperature"].isna()
    assert not detections.loc[nan_mask, "detected"].any()


def test_detection_probability_peaks_near_optimal_temperature():
    # Far from the optimal temperature, detection rate should be much lower
    # than right around it -- this is the non-linearity the whole analysis
    # narrative depends on.
    readings = generate_sensor_readings(seed=7)
    detections = generate_detection_events(readings, seed=8)
    merged = readings.assign(detected=detections["detected"]).dropna(subset=["temperature"])
    temp = merged["temperature"]
    near_optimal = merged[(temp - 18.0).abs() < 3]
    far_from_optimal = merged[(temp - 18.0).abs() > temp.std() * 1.5]
    assert len(near_optimal) > 0 and len(far_from_optimal) > 0
    assert near_optimal["detected"].mean() > far_from_optimal["detected"].mean()
