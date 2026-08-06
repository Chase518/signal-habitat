"""Simulated LoRaWAN-style sensor readings and camera-trap detection events.

Scope (see 项目总纲.md): 5 sensor nodes, 7 days, 15-minute interval,
no real hardware involved. Trigger probability for detections is a
bell curve over temperature so the activity/temperature relationship
is non-monotonic — this is what justifies quadratic regression over
linear in the analysis layer.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

SENSOR_IDS = [f"S{i}" for i in range(1, 6)]
INTERVAL_MINUTES = 15
DAYS = 7
READINGS_PER_DAY = 24 * 60 // INTERVAL_MINUTES

# Bell-curve center/width for detection trigger probability vs. temperature.
# Peak activity around a mild temperature, tapering off toward heat/cold.
ACTIVITY_OPTIMAL_TEMP_C = 18.0
ACTIVITY_TEMP_SIGMA = 7.0
ACTIVITY_PEAK_PROBABILITY = 0.35


def _diurnal_temperature(hours: np.ndarray, base_temp: float, rng: np.random.Generator) -> np.ndarray:
    seasonal_daily_swing = 6.0
    noise = rng.normal(0, 1.0, size=hours.shape)
    return base_temp + seasonal_daily_swing * np.sin((hours - 9) / 24 * 2 * np.pi) + noise


def _humidity_from_temperature(temperature: np.ndarray, rng: np.random.Generator) -> np.ndarray:
    # Roughly inverse relationship to temperature, clipped to a plausible range.
    humidity = 85 - 1.8 * (temperature - 15) + rng.normal(0, 4.0, size=temperature.shape)
    return np.clip(humidity, 20, 100)


def _battery_drain(n: int, rng: np.random.Generator, start_pct: float, drain_rate: tuple[float, float]) -> np.ndarray:
    drain_per_step = rng.uniform(*drain_rate, size=n)
    battery = start_pct - np.cumsum(drain_per_step)
    battery += rng.normal(0, 0.3, size=n)
    return np.clip(battery, 0, 100)


def _rssi(n: int, rng: np.random.Generator, mean_dbm: float, dropout_fraction: float = 0.0) -> np.ndarray:
    rssi = mean_dbm + rng.normal(0, 6.0, size=n)
    if dropout_fraction > 0:
        dropout_idx = rng.choice(n, size=int(n * dropout_fraction), replace=False)
        rssi[dropout_idx] -= rng.uniform(20, 40, size=dropout_idx.size)
    return rssi


def generate_sensor_readings(seed: int = 42, missing_fraction: float = 0.03) -> pd.DataFrame:
    """Generate raw (pre-interpolation) sensor readings for all nodes.

    `missing_fraction` of temperature/humidity values are set to NaN to
    simulate dropped packets, giving the interpolation step something
    real to do.
    """
    rng = np.random.default_rng(seed)
    timestamps = pd.date_range("2026-06-01", periods=DAYS * READINGS_PER_DAY, freq=f"{INTERVAL_MINUTES}min")
    hours = timestamps.hour + timestamps.minute / 60.0

    # The last sensor is deliberately modeled as failing hardware (fast
    # battery drain + frequent RSSI dropouts) so the confidence filter
    # in app/quality.py has real low-quality data to remove.
    faulty_sensor_id = SENSOR_IDS[-1]

    frames = []
    for i, sensor_id in enumerate(SENSOR_IDS):
        base_temp = 14.0 + i * 1.5  # per-sensor microclimate offset
        temperature = _diurnal_temperature(hours.to_numpy(), base_temp, rng)
        humidity = _humidity_from_temperature(temperature, rng)

        is_faulty = sensor_id == faulty_sensor_id
        battery = _battery_drain(
            len(timestamps),
            rng,
            start_pct=rng.uniform(70, 100),
            drain_rate=(0.08, 0.12) if is_faulty else (0.01, 0.03),
        )
        rssi = _rssi(
            len(timestamps),
            rng,
            mean_dbm=rng.uniform(-95, -60),
            dropout_fraction=0.08 if is_faulty else 0.0,
        )

        df = pd.DataFrame({
            "timestamp": timestamps,
            "sensor_id": sensor_id,
            "temperature": temperature,
            "humidity": humidity,
            "battery": battery,
            "rssi": rssi,
        })

        missing_idx = rng.choice(len(df), size=int(len(df) * missing_fraction), replace=False)
        df.loc[missing_idx, ["temperature", "humidity"]] = np.nan
        frames.append(df)

    return pd.concat(frames, ignore_index=True)


def generate_sensor_metadata() -> pd.DataFrame:
    """Per-sensor descriptive attributes -- low update frequency, deliberately
    kept out of sensor_reading (see 项目总纲.md's schema and app/storage.py).
    """
    faulty_sensor_id = SENSOR_IDS[-1]
    return pd.DataFrame({
        "sensor_id": SENSOR_IDS,
        "base_temperature_c": [14.0 + i * 1.5 for i in range(len(SENSOR_IDS))],
        "is_faulty": [sensor_id == faulty_sensor_id for sensor_id in SENSOR_IDS],
    })


def generate_detection_events(sensor_readings: pd.DataFrame, seed: int = 43) -> pd.DataFrame:
    """Simulate camera-trap detections keyed to the same timestamps.

    Detection is a Bernoulli trial per reading; probability follows a
    Gaussian bump over temperature (see module docstring). Rows with
    NaN temperature (not yet interpolated) get zero trigger probability.
    """
    rng = np.random.default_rng(seed)
    temp = sensor_readings["temperature"].to_numpy()
    valid = ~np.isnan(temp)

    probability = np.zeros_like(temp)
    probability[valid] = ACTIVITY_PEAK_PROBABILITY * np.exp(
        -0.5 * ((temp[valid] - ACTIVITY_OPTIMAL_TEMP_C) / ACTIVITY_TEMP_SIGMA) ** 2
    )

    detected = rng.random(len(temp)) < probability
    return pd.DataFrame({
        "timestamp": sensor_readings["timestamp"],
        "sensor_id": sensor_readings["sensor_id"],
        "detected": detected,
    })
