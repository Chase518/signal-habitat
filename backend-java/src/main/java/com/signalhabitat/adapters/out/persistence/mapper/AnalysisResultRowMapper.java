package com.signalhabitat.adapters.out.persistence.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.signalhabitat.adapters.out.persistence.entity.AnalysisResultRow;
import com.signalhabitat.application.domain.model.AnalysisResult;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class AnalysisResultRowMapper {

    private final ObjectMapper objectMapper;

    @Inject
    public AnalysisResultRowMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String toPayloadJson(AnalysisResult result) {
        try {
            return objectMapper.writeValueAsString(result);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize AnalysisResult", e);
        }
    }

    public AnalysisResult toDomain(AnalysisResultRow row) {
        try {
            return objectMapper.readValue(row.payloadJson(), AnalysisResult.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to deserialize AnalysisResult", e);
        }
    }
}
