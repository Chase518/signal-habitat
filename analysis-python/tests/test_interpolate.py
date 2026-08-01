import numpy as np
import pandas as pd

from app.interpolate import interpolate_missing


def _readings(temperatures, humidities):
    timestamps = pd.date_range("2026-06-01", periods=len(temperatures), freq="15min")
    return pd.DataFrame({
        "timestamp": timestamps,
        "sensor_id": "S1",
        "temperature": temperatures,
        "humidity": humidities,
        "battery": 90.0,
        "rssi": -60.0,
    })


def test_interpolates_interior_gap_linearly():
    df = _readings([10.0, np.nan, np.nan, 13.0], [50.0, np.nan, np.nan, 53.0])
    out = interpolate_missing(df)
    assert not out["temperature"].isna().any()
    np.testing.assert_allclose(out["temperature"].to_numpy(), [10.0, 11.0, 12.0, 13.0])


def test_fills_leading_and_trailing_gaps_by_nearest_value():
    df = _readings([np.nan, 10.0, 11.0, np.nan], [np.nan, 50.0, 51.0, np.nan])
    out = interpolate_missing(df)
    assert not out["temperature"].isna().any()
    assert out["temperature"].iloc[0] == 10.0
    assert out["temperature"].iloc[-1] == 11.0


def test_interpolation_is_independent_per_sensor():
    a = _readings([10.0, np.nan, 12.0], [50.0, np.nan, 52.0])
    b = _readings([20.0, np.nan, 24.0], [60.0, np.nan, 64.0])
    b["sensor_id"] = "S2"
    combined = pd.concat([a, b], ignore_index=True)

    out = interpolate_missing(combined)

    s1_mid = out[out["sensor_id"] == "S1"]["temperature"].iloc[1]
    s2_mid = out[out["sensor_id"] == "S2"]["temperature"].iloc[1]
    assert s1_mid == 11.0
    assert s2_mid == 22.0


def test_columns_and_row_count_preserved():
    df = _readings([10.0, np.nan], [50.0, np.nan])
    out = interpolate_missing(df)
    assert list(out.columns) == list(df.columns)
    assert len(out) == len(df)
