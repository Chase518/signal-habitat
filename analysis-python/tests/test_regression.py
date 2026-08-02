import numpy as np
import pytest

from app.regression import fit_activity_model


def test_linear_fit_recovers_known_line():
    x = np.linspace(0, 10, 20)
    y = 2.0 * x + 3.0
    result = fit_activity_model(x, y, degree=1)
    np.testing.assert_allclose(result.coefficients, [3.0, 2.0], atol=1e-8)
    assert result.r_squared > 0.999


def test_quadratic_fit_recovers_known_parabola():
    x = np.linspace(-5, 5, 30)
    y = 1.0 + 2.0 * x - 0.5 * x**2
    result = fit_activity_model(x, y, degree=2)
    np.testing.assert_allclose(result.coefficients, [1.0, 2.0, -0.5], atol=1e-8)


def test_quadratic_outperforms_linear_on_non_monotonic_data():
    rng = np.random.default_rng(0)
    x = np.linspace(0, 30, 50)
    y = -0.5 * (x - 15) ** 2 + 100 + rng.normal(0, 5, 50)
    linear = fit_activity_model(x, y, degree=1)
    quadratic = fit_activity_model(x, y, degree=2)
    assert quadratic.r_squared > linear.r_squared


def test_rejects_unsupported_degree():
    with pytest.raises(ValueError):
        fit_activity_model(np.arange(10.0), np.arange(10.0), degree=3)


def test_rejects_mismatched_shapes():
    with pytest.raises(ValueError):
        fit_activity_model(np.arange(10.0), np.arange(5.0), degree=1)


def test_predict_matches_manual_polynomial_evaluation():
    x = np.linspace(-5, 5, 30)
    y = 1.0 + 2.0 * x - 0.5 * x**2
    result = fit_activity_model(x, y, degree=2)
    x_new = np.array([0.0, 1.0, 2.0])
    expected = 1.0 + 2.0 * x_new - 0.5 * x_new**2
    np.testing.assert_allclose(result.predict(x_new), expected, atol=1e-8)
