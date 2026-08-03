package com.signalhabitat.adapters.in.api.adapter;

import com.signalhabitat.adapters.in.api.dto.AnalysisResponseDto;
import com.signalhabitat.adapters.in.api.mapper.AnalysisResponseMapper;
import com.signalhabitat.application.ports.in.AnalysisUseCase;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/analysis")
public class AnalysisResource {

    private final AnalysisUseCase analysisUseCase;

    @Inject
    public AnalysisResource(AnalysisUseCase analysisUseCase) {
        this.analysisUseCase = analysisUseCase;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public AnalysisResponseDto getAnalysis() {
        return AnalysisResponseMapper.toDto(analysisUseCase.getAnalysis());
    }
}
