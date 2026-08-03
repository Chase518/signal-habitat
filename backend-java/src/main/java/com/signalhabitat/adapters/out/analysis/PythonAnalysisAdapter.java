package com.signalhabitat.adapters.out.analysis;

import com.signalhabitat.application.domain.model.AnalysisResult;
import com.signalhabitat.application.ports.out.AnalysisServicePort;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@ApplicationScoped
public class PythonAnalysisAdapter implements AnalysisServicePort {

    @RestClient
    PythonAnalysisClient client;

    @Override
    public AnalysisResult fetchAnalysis() {
        return PythonAnalysisMapper.toDomain(client.getAnalysis());
    }
}
