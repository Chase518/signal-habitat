package com.signalhabitat.application.ports.out;

import com.signalhabitat.application.domain.model.DetectionsOverview;

public interface DetectionRepositoryPort {

    DetectionsOverview loadOverview(int recentEventLimit);
}
