package com.signalhabitat.adapters.out.persistence;

import com.signalhabitat.application.domain.model.AnalysisResult;
import com.signalhabitat.application.ports.out.AnalysisResultRepositoryPort;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Alternative;
import java.util.Optional;

@Alternative
@Priority(1)
@ApplicationScoped
public class FakeAnalysisResultRepository implements AnalysisResultRepositoryPort {

    private Optional<AnalysisResult> cached = Optional.empty();
    private AnalysisResult lastSaved;

    public void setCached(Optional<AnalysisResult> cached) {
        this.cached = cached;
    }

    public AnalysisResult getLastSaved() {
        return lastSaved;
    }

    @Override
    public Optional<AnalysisResult> findLatest() {
        return cached;
    }

    @Override
    public void save(AnalysisResult result) {
        this.lastSaved = result;
    }
}
