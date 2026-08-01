import pandas as pd

from app.quality import MIN_BATTERY_PCT, MIN_RSSI_DBM, filter_low_confidence


def _reading(battery, rssi):
    return {
        "timestamp": pd.Timestamp("2026-06-01"),
        "sensor_id": "S1",
        "temperature": 15.0,
        "humidity": 60.0,
        "battery": battery,
        "rssi": rssi,
    }


def test_keeps_readings_above_both_thresholds():
    df = pd.DataFrame([_reading(MIN_BATTERY_PCT + 1, MIN_RSSI_DBM + 1)])
    assert len(filter_low_confidence(df)) == 1


def test_drops_readings_below_battery_threshold():
    df = pd.DataFrame([_reading(MIN_BATTERY_PCT - 1, MIN_RSSI_DBM + 1)])
    assert len(filter_low_confidence(df)) == 0


def test_drops_readings_below_rssi_threshold():
    df = pd.DataFrame([_reading(MIN_BATTERY_PCT + 1, MIN_RSSI_DBM - 1)])
    assert len(filter_low_confidence(df)) == 0


def test_mixed_batch_keeps_only_confident_rows():
    df = pd.DataFrame([
        _reading(MIN_BATTERY_PCT + 5, MIN_RSSI_DBM + 5),
        _reading(5.0, MIN_RSSI_DBM + 5),
        _reading(MIN_BATTERY_PCT + 5, -120.0),
    ])
    out = filter_low_confidence(df)
    assert len(out) == 1
    assert out.index.tolist() == [0]
