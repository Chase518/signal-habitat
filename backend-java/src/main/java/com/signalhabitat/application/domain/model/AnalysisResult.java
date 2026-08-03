package com.signalhabitat.application.domain.model;

import java.time.Instant;
import java.util.List;

public record AnalysisResult(
        AnalysisMeta meta,
        List<ActivityPoint> points,
        FittedModel linearModel,
        FittedModel quadraticModel,
        Instant computedAt) {
}
