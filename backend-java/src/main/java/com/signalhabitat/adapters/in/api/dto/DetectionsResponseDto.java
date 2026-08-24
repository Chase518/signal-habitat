package com.signalhabitat.adapters.in.api.dto;

import java.util.List;

public record DetectionsResponseDto(
        int totalCount, List<Event> recentEvents, List<DailyCount> dailyCounts) {

    public record Event(String sensorId, String timestamp) {
    }

    public record DailyCount(String day, int count) {
    }
}
