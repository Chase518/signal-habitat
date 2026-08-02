"""Data-quality/confidence filtering based on battery and signal strength.

A reading from a sensor with a near-dead battery or a very weak radio
link is treated as untrustworthy and excluded before it reaches the
regression step — this is what "confidence filtering" means in this
project's analysis pipeline (see 项目总纲.md, 分析方法论 step 4).
"""
from __future__ import annotations

import pandas as pd

MIN_BATTERY_PCT = 20.0
MIN_RSSI_DBM = -100.0


def filter_low_confidence(readings: pd.DataFrame) -> pd.DataFrame:
    """Return only readings meeting the battery/RSSI confidence thresholds."""
    confident = (readings["battery"] >= MIN_BATTERY_PCT) & (readings["rssi"] >= MIN_RSSI_DBM)
    return readings[confident].reset_index(drop=True)
