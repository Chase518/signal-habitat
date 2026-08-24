package com.signalhabitat.adapters.in.api.dto;

import java.util.List;

public record SensorsResponseDto(List<Sensor> sensors, List<BatteryTrendPoint> batteryTrend) {

    public record Sensor(
            String sensorId,
            double baseTemperatureC,
            boolean isFaulty,
            int readingCount,
            Double latestBattery,
            Double latestRssi,
            String latestReadingAt) {
    }

    public record BatteryTrendPoint(String sensorId, String day, double avgBattery) {
    }
}
