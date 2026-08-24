package com.signalhabitat.application.ports.out;

import com.signalhabitat.application.domain.model.SensorsOverview;

public interface SensorRepositoryPort {

    SensorsOverview loadOverview();
}
