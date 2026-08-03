package com.signalhabitat.application.services;

import com.signalhabitat.application.domain.model.AnalysisResult;
import com.signalhabitat.application.ports.in.AnalysisUseCase;
import com.signalhabitat.application.ports.out.AnalysisResultRepositoryPort;
import com.signalhabitat.application.ports.out.AnalysisServicePort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.Duration;
import java.time.Instant;

/**
 * Orchestrates the two outbound ports: serve a cached result if it's still
 * fresh, otherwise pull a new one from the Python analysis service and
 * persist it. See docs/decisions.md for why this cache exists at all.
 */
@ApplicationScoped
public class AnalysisApplicationService implements AnalysisUseCase {

    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    private final AnalysisServicePort analysisServicePort;
    private final AnalysisResultRepositoryPort repositoryPort;

    @Inject
    public AnalysisApplicationService(
            AnalysisServicePort analysisServicePort, AnalysisResultRepositoryPort repositoryPort) {
        this.analysisServicePort = analysisServicePort;
        this.repositoryPort = repositoryPort;
    }

    @Override
    public AnalysisResult getAnalysis() {
        return repositoryPort.findLatest()
                .filter(this::isFresh)
                .orElseGet(this::refreshAndPersist);
    }

    private boolean isFresh(AnalysisResult result) {
        return Duration.between(result.computedAt(), Instant.now()).compareTo(CACHE_TTL) < 0;
    }

    private AnalysisResult refreshAndPersist() {
        AnalysisResult result = analysisServicePort.fetchAnalysis();
        repositoryPort.save(result);
        return result;
    }
}
