from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_get_analysis_returns_expected_shape():
    response = client.get("/api/analysis")
    assert response.status_code == 200
    body = response.json()
    assert "meta" in body
    assert "aggregated_points" in body
    assert set(body["models"].keys()) == {"linear", "quadratic"}


def test_get_analysis_quadratic_beats_linear():
    body = client.get("/api/analysis").json()
    assert body["models"]["quadratic"]["r_squared"] > body["models"]["linear"]["r_squared"]
