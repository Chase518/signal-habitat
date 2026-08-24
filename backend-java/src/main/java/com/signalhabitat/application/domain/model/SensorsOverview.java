package com.signalhabitat.application.domain.model;

import java.util.List;

public record SensorsOverview(List<SensorSummary> sensors, List<BatteryTrendPoint> batteryTrend) {
}
