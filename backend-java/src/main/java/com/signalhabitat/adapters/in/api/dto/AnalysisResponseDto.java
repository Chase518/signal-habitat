package com.signalhabitat.adapters.in.api.dto;

import java.util.List;

/** JSON shape served to the frontend at GET /api/analysis -- matches what analysisApi.js already expects. */
public record AnalysisResponseDto(Meta meta, List<Point> aggregatedPoints, Models models) {

    public record Meta(
            int sensorCount, int rawReadingCount, int confidentReadingCount, int detectionCount) {
    }

    public record Point(
            double temperatureBinCenter, int nReadings, int nDetections, double activityFrequency) {
    }

    public record Models(Model linear, Model quadratic) {
    }

    public record Model(int degree, List<Double> coefficients, List<Double> pValues, double rSquared) {
    }
}
