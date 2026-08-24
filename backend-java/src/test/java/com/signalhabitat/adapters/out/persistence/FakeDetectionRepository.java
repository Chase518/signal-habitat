package com.signalhabitat.adapters.out.persistence;

import com.signalhabitat.application.domain.model.DetectionsOverview;
import com.signalhabitat.application.ports.out.DetectionRepositoryPort;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Alternative;
import java.util.List;

@Alternative
@Priority(1)
@ApplicationScoped
public class FakeDetectionRepository implements DetectionRepositoryPort {

    private DetectionsOverview overview = new DetectionsOverview(0, List.of(), List.of());
    private int lastRequestedLimit = -1;

    public void setOverview(DetectionsOverview overview) {
        this.overview = overview;
    }

    public int getLastRequestedLimit() {
        return lastRequestedLimit;
    }

    @Override
    public DetectionsOverview loadOverview(int recentEventLimit) {
        this.lastRequestedLimit = recentEventLimit;
        return overview;
    }
}
