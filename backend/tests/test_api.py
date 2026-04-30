"""Integration tests for the FastAPI endpoints."""
from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _payload():
    return {
        "criteria": [
            {"name": "Estabilidade Emocional", "weight": 0.90, "type": "benefit"},
            {"name": "Comunicação", "weight": 1.00, "type": "benefit"},
            {"name": "Personalidade", "weight": 0.93, "type": "benefit"},
            {"name": "Experiência", "weight": 1.00, "type": "benefit"},
            {"name": "Autoconfiança", "weight": 0.63, "type": "benefit"},
        ],
        "alternatives": [
            {"name": "A1", "values": [7.7, 7.0, 7.7, 9.67, 5.0]},
            {"name": "A2", "values": [8.3, 10.0, 9.7, 10.0, 9.0]},
            {"name": "A3", "values": [8.0, 9.0, 9.0, 9.0, 8.3]},
        ],
        "normalization": "linear",
    }


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_topsis_chen_example():
    r = client.post("/api/v1/topsis", json=_payload())
    assert r.status_code == 200
    data = r.json()
    names = [row["name"] for row in data["ranking"]]
    assert names == ["A2", "A3", "A1"]
    assert data["ranking"][0]["rank"] == 1


def test_topsis_export_csv():
    r = client.post("/api/v1/topsis/export.csv", json=_payload())
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("text/csv")
    body = r.text
    assert "rank,alternative,closeness" in body
    assert "A2" in body


def test_validation_mismatched_values():
    bad = _payload()
    bad["alternatives"][0]["values"] = [1, 2]
    r = client.post("/api/v1/topsis", json=bad)
    assert r.status_code == 422
