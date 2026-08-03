package com.signalhabitat.adapters.out.analysis;

import java.util.List;

/** Mirrors the JSON shape returned by GET /api/analysis on the Python service. */
public record PythonAnalysisResponse(
        Meta meta, List<Point> aggregatedPoints, Models models) {

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
