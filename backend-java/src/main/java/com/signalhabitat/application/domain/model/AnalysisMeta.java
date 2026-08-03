package com.signalhabitat.application.domain.model;

public record AnalysisMeta(
        int sensorCount,
        int rawReadingCount,
        int confidentReadingCount,
        int detectionCount) {
}
