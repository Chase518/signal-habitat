package com.signalhabitat.adapters.out.persistence;

import com.signalhabitat.application.domain.model.SensorsOverview;
import com.signalhabitat.application.ports.out.SensorRepositoryPort;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Alternative;
import java.util.List;

@Alternative
@Priority(1)
@ApplicationScoped
public class FakeSensorRepository implements SensorRepositoryPort {

    private SensorsOverview overview = new SensorsOverview(List.of(), List.of());

    public void setOverview(SensorsOverview overview) {
        this.overview = overview;
    }

    @Override
    public SensorsOverview loadOverview() {
        return overview;
    }
}
