package com.signalhabitat.application.ports.out;

import com.signalhabitat.application.domain.model.AnalysisResult;

/**
 * Outbound port to the Python analysis service. Treated the same as the
 * persistence port: an external dependency the domain doesn't know the
 * concrete shape of (see docs/decisions.md).
 */
public interface AnalysisServicePort {

    AnalysisResult fetchAnalysis();
}
