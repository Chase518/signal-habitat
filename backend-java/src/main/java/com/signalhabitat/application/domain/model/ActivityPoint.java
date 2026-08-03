package com.signalhabitat.application.domain.model;

public record ActivityPoint(
        double temperatureBinCenter,
        int readingCount,
        int detectionCount,
        double activityFrequency) {
}
