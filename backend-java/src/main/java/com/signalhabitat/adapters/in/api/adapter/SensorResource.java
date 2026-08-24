package com.signalhabitat.adapters.in.api.adapter;

import com.signalhabitat.adapters.in.api.dto.SensorsResponseDto;
import com.signalhabitat.adapters.in.api.mapper.SensorsResponseMapper;
import com.signalhabitat.application.ports.in.SensorUseCase;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/sensors")
public class SensorResource {

    private final SensorUseCase sensorUseCase;

    @Inject
    public SensorResource(SensorUseCase sensorUseCase) {
        this.sensorUseCase = sensorUseCase;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public SensorsResponseDto getSensors() {
        return SensorsResponseMapper.toDto(sensorUseCase.getSensorsOverview());
    }
}
