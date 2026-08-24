package com.signalhabitat.application.services;

import com.signalhabitat.application.domain.model.DetectionsOverview;
import com.signalhabitat.application.ports.in.DetectionUseCase;
import com.signalhabitat.application.ports.out.DetectionRepositoryPort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class DetectionApplicationService implements DetectionUseCase {

    private static final int RECENT_EVENT_LIMIT = 50;

    private final DetectionRepositoryPort repositoryPort;

    @Inject
    public DetectionApplicationService(DetectionRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    public DetectionsOverview getDetectionsOverview() {
        return repositoryPort.loadOverview(RECENT_EVENT_LIMIT);
    }
}
