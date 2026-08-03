package com.signalhabitat.adapters.out.analysis;

import com.signalhabitat.application.domain.model.AnalysisResult;
import com.signalhabitat.application.ports.out.AnalysisServicePort;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Alternative;

/**
 * Test double swapped in for the real Python adapter via CDI's alternative
 * mechanism -- avoids depending on a running Python service (or on a
 * mocking-framework's own Quarkus integration) just to test the REST layer.
 */
@Alternative
@Priority(1)
@ApplicationScoped
public class FakeAnalysisServicePort implements AnalysisServicePort {

    private AnalysisResult result;

    public void setResult(AnalysisResult result) {
        this.result = result;
    }

    @Override
    public AnalysisResult fetchAnalysis() {
        return result;
    }
}
