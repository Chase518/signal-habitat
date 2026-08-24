package com.signalhabitat.application.domain.model;

public record SensorSummary(
        String sensorId,
        double baseTemperatureC,
        boolean isFaulty,
        int readingCount,
        Double latestBattery,
        Double latestRssi,
        String latestReadingAt) {
}
