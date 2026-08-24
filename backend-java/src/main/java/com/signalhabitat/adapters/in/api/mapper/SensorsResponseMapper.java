package com.signalhabitat.adapters.in.api.mapper;

import com.signalhabitat.adapters.in.api.dto.SensorsResponseDto;
import com.signalhabitat.application.domain.model.SensorsOverview;

public final class SensorsResponseMapper {

    private SensorsResponseMapper() {
    }

    public static SensorsResponseDto toDto(SensorsOverview overview) {
        return new SensorsResponseDto(
                overview.sensors().stream()
                        .map(sensor -> new SensorsResponseDto.Sensor(
                                sensor.sensorId(),
                                sensor.baseTemperatureC(),
                                sensor.isFaulty(),
                                sensor.readingCount(),
                                sensor.latestBattery(),
                                sensor.latestRssi(),
                                sensor.latestReadingAt()))
                        .toList(),
                overview.batteryTrend().stream()
                        .map(point -> new SensorsResponseDto.BatteryTrendPoint(
                                point.sensorId(), point.day(), point.avgBattery()))
                        .toList());
    }
}
