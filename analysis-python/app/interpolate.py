"""Fill gaps in simulated sensor readings.

Interpolation runs per sensor and is time-based (not just row-index
based) so it stays correct even if a sensor's readings aren't evenly
spaced.
"""
from __future__ import annotations

import pandas as pd

INTERPOLATED_COLUMNS = ["temperature", "humidity"]


def interpolate_missing(readings: pd.DataFrame) -> pd.DataFrame:
    """Return a copy of `readings` with NaN temperature/humidity filled in.

    Uses time-based linear interpolation within each sensor's series;
    boundary NaNs (a gap at the very start/end of a sensor's series)
    are filled by nearest-value extrapolation since there's no
    surrounding data to interpolate between.
    """
    filled = readings.sort_values(["sensor_id", "timestamp"]).reset_index(drop=True).copy()

    for _, group_index in filled.groupby("sensor_id").groups.items():
        group = filled.loc[group_index].set_index("timestamp")
        group[INTERPOLATED_COLUMNS] = (
            group[INTERPOLATED_COLUMNS].interpolate(method="time").bfill().ffill()
        )
        filled.loc[group_index, INTERPOLATED_COLUMNS] = group[INTERPOLATED_COLUMNS].to_numpy()

    return filled[readings.columns]
