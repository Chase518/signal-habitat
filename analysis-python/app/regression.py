"""Polynomial regression core: activity frequency vs. an environmental variable.

Degree is switchable between 1 (linear) and 2 (quadratic) — see
docs/decisions.md for why quadratic was chosen as the default and why
a neural-network fit was deliberately left out. Still linear in its
parameters either way, so ordinary least squares applies directly and
each coefficient gets a proper p-value.
"""
from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import statsmodels.api as sm


@dataclass
class ActivityModelResult:
    degree: int
    coefficients: list[float]  # [intercept, x^1, x^2, ...]
    p_values: list[float]      # same order as coefficients
    r_squared: float
    n_observations: int

    def predict(self, x: np.ndarray) -> np.ndarray:
        x = np.asarray(x, dtype=float)
        design = np.vander(x, N=self.degree + 1, increasing=True)
        return design @ np.array(self.coefficients)


def fit_activity_model(X: np.ndarray, y: np.ndarray, degree: int = 1) -> ActivityModelResult:
    """Fit y ~ poly(X, degree) via OLS and return coefficients + p-values.

    `X` is a single environmental variable (e.g. temperature), `y` is
    the corresponding activity frequency (e.g. detections per bucket).
    Degree must be 1 or 2, matching the "linear vs. quadratic" choice
    this project's analysis narrative is built around.
    """
    if degree not in (1, 2):
        raise ValueError("degree must be 1 or 2")

    x = np.asarray(X, dtype=float)
    y = np.asarray(y, dtype=float)
    if x.shape != y.shape:
        raise ValueError("X and y must have the same shape")
    if x.size < degree + 2:
        raise ValueError("not enough observations to fit this degree")

    design = np.vander(x, N=degree + 1, increasing=True)
    model = sm.OLS(y, design).fit()

    return ActivityModelResult(
        degree=degree,
        coefficients=model.params.tolist(),
        p_values=model.pvalues.tolist(),
        r_squared=float(model.rsquared),
        n_observations=int(model.nobs),
    )
