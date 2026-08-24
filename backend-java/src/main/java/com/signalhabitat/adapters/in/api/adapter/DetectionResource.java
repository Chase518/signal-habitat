package com.signalhabitat.adapters.in.api.adapter;

import com.signalhabitat.adapters.in.api.dto.DetectionsResponseDto;
import com.signalhabitat.adapters.in.api.mapper.DetectionsResponseMapper;
import com.signalhabitat.application.ports.in.DetectionUseCase;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/detections")
public class DetectionResource {

    private final DetectionUseCase detectionUseCase;

    @Inject
    public DetectionResource(DetectionUseCase detectionUseCase) {
        this.detectionUseCase = detectionUseCase;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public DetectionsResponseDto getDetections() {
        return DetectionsResponseMapper.toDto(detectionUseCase.getDetectionsOverview());
    }
}
