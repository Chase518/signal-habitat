"""End-to-end analysis pipeline: simulate -> interpolate -> filter -> aggregate -> fit.

Running this module produces the sample dataset the frontend's first
chart will be built against (see 进度追踪.md, 下一步任务).
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd

from app.interpolate import interpolate_missing
from app.quality import filter_low_confidence
from app.regression import fit_activity_model
from app.simulate import generate_detection_events, generate_sensor_metadata, generate_sensor_readings
from app.storage import (
    DEFAULT_DB_PATH,
    get_connection,
    has_readings,
    init_schema,
    load_detection_events,
    load_sensor_readings,
    save_detection_events,
    save_sensor_metadata,
    save_sensor_readings,
)

TEMPERATURE_BIN_WIDTH_C = 1.0


def aggregate_activity_by_temperature(
    readings: pd.DataFrame, detections: pd.DataFrame, bin_width: float = TEMPERATURE_BIN_WIDTH_C
) -> pd.DataFrame:
    """Bucket confidence-filtered readings by temperature and compute detection frequency per bucket.

    Detection frequency = detections / readings within that bucket, i.e.
    "how often was wildlife activity observed when it was roughly this
    warm" — this is the y variable the regression models.
    """
    merged = readings.merge(detections, on=["timestamp", "sensor_id"], how="left")
    # Loaded-from-storage detections can leave this column as object dtype
    # (NaN mixed with Python bool after the left join); force real bool
    # dtype so the later groupby("detected").sum() always yields a plain
    # int, not a stray Python `False` for an all-absent bin.
    merged["detected"] = merged["detected"].fillna(False).astype(bool)

    bin_edges = np.arange(
        np.floor(merged["temperature"].min()),
        np.ceil(merged["temperature"].max()) + bin_width,
        bin_width,
    )
    merged["temperature_bin"] = pd.cut(merged["temperature"], bins=bin_edges, include_lowest=True)

    grouped = merged.groupby("temperature_bin", observed=True).agg(
        n_readings=("detected", "size"),
        n_detections=("detected", "sum"),
    )
    grouped = grouped[grouped["n_readings"] > 0].copy()
    grouped["temperature_bin_center"] = grouped.index.map(lambda interval: interval.mid).astype(float)
    grouped["activity_frequency"] = grouped["n_detections"] / grouped["n_readings"]
    return grouped.reset_index(drop=True)[
        ["temperature_bin_center", "n_readings", "n_detections", "activity_frequency"]
    ]


def _load_or_generate_raw_data(seed: int, db_path: Path) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Generate sensor_reading/detection_event once and persist them; every
    later call (any process, as long as db_path is unchanged) reads the
    same stored rows instead of re-simulating -- the same
    generate-once-reuse-many pattern the Java backend applies to its own
    analysis_result cache (see docs/decisions.md).
    """
    conn = get_connection(db_path)
    init_schema(conn)

    if has_readings(conn):
        raw_readings = load_sensor_readings(conn)
        detections = load_detection_events(conn)
    else:
        raw_readings = generate_sensor_readings(seed=seed)
        interpolated_for_detection = interpolate_missing(raw_readings)
        detections = generate_detection_events(interpolated_for_detection, seed=seed + 1)

        save_sensor_metadata(conn, generate_sensor_metadata())
        save_sensor_readings(conn, raw_readings)
        save_detection_events(conn, detections[detections["detected"]])

    conn.close()
    return raw_readings, detections


def run_pipeline(seed: int = 42, db_path: Path = DEFAULT_DB_PATH) -> dict:
    """Run the full pipeline and return a JSON-serializable result dict."""
    raw_readings, detections = _load_or_generate_raw_data(seed, db_path)
    interpolated = interpolate_missing(raw_readings)
    confident_readings = filter_low_confidence(interpolated)

    aggregated = aggregate_activity_by_temperature(confident_readings, detections)

    x = aggregated["temperature_bin_center"].to_numpy()
    y = aggregated["activity_frequency"].to_numpy()

    linear_model = fit_activity_model(x, y, degree=1)
    quadratic_model = fit_activity_model(x, y, degree=2)

    return {
        "meta": {
            "sensor_count": raw_readings["sensor_id"].nunique(),
            "raw_reading_count": len(raw_readings),
            "confident_reading_count": len(confident_readings),
            "detection_count": int(detections["detected"].sum()),
        },
        "aggregated_points": aggregated.to_dict(orient="records"),
        "models": {
            "linear": {
                "degree": linear_model.degree,
                "coefficients": linear_model.coefficients,
                "p_values": linear_model.p_values,
                "r_squared": linear_model.r_squared,
            },
            "quadratic": {
                "degree": quadratic_model.degree,
                "coefficients": quadratic_model.coefficients,
                "p_values": quadratic_model.p_values,
                "r_squared": quadratic_model.r_squared,
            },
        },
    }


def write_sample_output(output_dir: Path) -> Path:
    """Run the pipeline and write its result as JSON for the frontend to consume."""
    result = run_pipeline()
    output_path = output_dir / "sample_analysis_output.json"
    output_path.write_text(json.dumps(result, indent=2))
    return output_path


if __name__ == "__main__":
    repo_root = Path(__file__).resolve().parents[2]
    path = write_sample_output(repo_root / "data")
    print(f"wrote {path}")
