package com.signalhabitat.adapters.in.api.mapper;

import com.signalhabitat.adapters.in.api.dto.DetectionsResponseDto;
import com.signalhabitat.application.domain.model.DetectionsOverview;

public final class DetectionsResponseMapper {

    private DetectionsResponseMapper() {
    }

    public static DetectionsResponseDto toDto(DetectionsOverview overview) {
        return new DetectionsResponseDto(
                overview.totalCount(),
                overview.recentEvents().stream()
                        .map(event -> new DetectionsResponseDto.Event(event.sensorId(), event.occurredAt()))
                        .toList(),
                overview.dailyCounts().stream()
                        .map(count -> new DetectionsResponseDto.DailyCount(count.day(), count.count()))
                        .toList());
    }
}
