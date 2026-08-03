package com.signalhabitat.application.domain.model;

import java.util.List;

public record FittedModel(
        int degree,
        List<Double> coefficients,
        List<Double> pValues,
        double rSquared) {
}
