package com.signalhabitat.application.domain.model;

import java.util.List;

public record DetectionsOverview(
        int totalCount, List<DetectionEvent> recentEvents, List<DailyDetectionCount> dailyCounts) {
}
