package com.signalhabitat.application.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.signalhabitat.application.domain.model.AnalysisMeta;
import com.signalhabitat.application.domain.model.AnalysisResult;
import com.signalhabitat.application.domain.model.FittedModel;
import com.signalhabitat.application.ports.out.AnalysisResultRepositoryPort;
import com.signalhabitat.application.ports.out.AnalysisServicePort;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;

class AnalysisApplicationServiceTest {

    private final AnalysisServicePort analysisServicePort = mock(AnalysisServicePort.class);
    private final AnalysisResultRepositoryPort repositoryPort = mock(AnalysisResultRepositoryPort.class);
    private final AnalysisApplicationService service =
            new AnalysisApplicationService(analysisServicePort, repositoryPort);

    private static AnalysisResult resultComputedAt(Instant computedAt) {
        FittedModel model = new FittedModel(1, List.of(0.1, 0.2), List.of(0.01, 0.02), 0.5);
        return new AnalysisResult(new AnalysisMeta(5, 100, 90, 20), List.of(), model, model, computedAt);
    }

    @Test
    void fetchesFromServiceAndPersists_whenNoCacheExists() {
        when(repositoryPort.findLatest()).thenReturn(Optional.empty());
        AnalysisResult fresh = resultComputedAt(Instant.now());
        when(analysisServicePort.fetchAnalysis()).thenReturn(fresh);

        AnalysisResult result = service.getAnalysis();

        assertEquals(fresh, result);
        verify(repositoryPort, times(1)).save(fresh);
    }

    @Test
    void returnsCachedResult_whenCacheIsFresh() {
        AnalysisResult cached = resultComputedAt(Instant.now().minus(1, ChronoUnit.MINUTES));
        when(repositoryPort.findLatest()).thenReturn(Optional.of(cached));

        AnalysisResult result = service.getAnalysis();

        assertEquals(cached, result);
        verify(analysisServicePort, never()).fetchAnalysis();
    }

    @Test
    void refetchesAndPersists_whenCacheIsStale() {
        AnalysisResult stale = resultComputedAt(Instant.now().minus(11, ChronoUnit.MINUTES));
        when(repositoryPort.findLatest()).thenReturn(Optional.of(stale));
        AnalysisResult fresh = resultComputedAt(Instant.now());
        when(analysisServicePort.fetchAnalysis()).thenReturn(fresh);

        AnalysisResult result = service.getAnalysis();

        assertEquals(fresh, result);
        verify(repositoryPort).save(fresh);
        verify(analysisServicePort, times(1)).fetchAnalysis();
    }
}
