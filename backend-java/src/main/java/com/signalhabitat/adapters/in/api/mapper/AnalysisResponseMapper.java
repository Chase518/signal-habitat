package com.signalhabitat.adapters.in.api.mapper;

import com.signalhabitat.adapters.in.api.dto.AnalysisResponseDto;
import com.signalhabitat.application.domain.model.ActivityPoint;
import com.signalhabitat.application.domain.model.AnalysisResult;
import com.signalhabitat.application.domain.model.FittedModel;
import java.util.List;

public final class AnalysisResponseMapper {

    private AnalysisResponseMapper() {
    }

    public static AnalysisResponseDto toDto(AnalysisResult result) {
        return new AnalysisResponseDto(
                new AnalysisResponseDto.Meta(
                        result.meta().sensorCount(),
                        result.meta().rawReadingCount(),
                        result.meta().confidentReadingCount(),
                        result.meta().detectionCount()),
                toPointDtos(result.points()),
                new AnalysisResponseDto.Models(
                        toModelDto(result.linearModel()), toModelDto(result.quadraticModel())));
    }

    private static List<AnalysisResponseDto.Point> toPointDtos(List<ActivityPoint> points) {
        return points.stream()
                .map(point -> new AnalysisResponseDto.Point(
                        point.temperatureBinCenter(),
                        point.readingCount(),
                        point.detectionCount(),
                        point.activityFrequency()))
                .toList();
    }

    private static AnalysisResponseDto.Model toModelDto(FittedModel model) {
        return new AnalysisResponseDto.Model(
                model.degree(), model.coefficients(), model.pValues(), model.rSquared());
    }
}
