package com.signalhabitat.adapters.out.analysis;

import com.signalhabitat.application.domain.model.ActivityPoint;
import com.signalhabitat.application.domain.model.AnalysisMeta;
import com.signalhabitat.application.domain.model.AnalysisResult;
import com.signalhabitat.application.domain.model.FittedModel;
import java.time.Instant;
import java.util.List;

final class PythonAnalysisMapper {

    private PythonAnalysisMapper() {
    }

    static AnalysisResult toDomain(PythonAnalysisResponse response) {
        return new AnalysisResult(
                toMeta(response.meta()),
                toPoints(response.aggregatedPoints()),
                toModel(response.models().linear()),
                toModel(response.models().quadratic()),
                Instant.now());
    }

    private static AnalysisMeta toMeta(PythonAnalysisResponse.Meta meta) {
        return new AnalysisMeta(
                meta.sensorCount(), meta.rawReadingCount(), meta.confidentReadingCount(), meta.detectionCount());
    }

    private static List<ActivityPoint> toPoints(List<PythonAnalysisResponse.Point> points) {
        return points.stream()
                .map(point -> new ActivityPoint(
                        point.temperatureBinCenter(),
                        point.nReadings(),
                        point.nDetections(),
                        point.activityFrequency()))
                .toList();
    }

    private static FittedModel toModel(PythonAnalysisResponse.Model model) {
        return new FittedModel(model.degree(), model.coefficients(), model.pValues(), model.rSquared());
    }
}
