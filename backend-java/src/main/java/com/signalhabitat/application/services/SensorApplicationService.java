package com.signalhabitat.application.services;

import com.signalhabitat.application.domain.model.SensorsOverview;
import com.signalhabitat.application.ports.in.SensorUseCase;
import com.signalhabitat.application.ports.out.SensorRepositoryPort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * No cache here, unlike AnalysisApplicationService -- this reads straight
 * from SQLite (cheap, local) rather than round-tripping to the Python
 * service, so there's nothing expensive to shield against.
 */
@ApplicationScoped
public class SensorApplicationService implements SensorUseCase {

    private final SensorRepositoryPort repositoryPort;

    @Inject
    public SensorApplicationService(SensorRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    public SensorsOverview getSensorsOverview() {
        return repositoryPort.loadOverview();
    }
}
