package com.signalhabitat.application.ports.out;

import com.signalhabitat.application.domain.model.AnalysisResult;
import java.util.Optional;

public interface AnalysisResultRepositoryPort {

    Optional<AnalysisResult> findLatest();

    void save(AnalysisResult result);
}
