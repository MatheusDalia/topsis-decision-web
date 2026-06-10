"""Schemas for the TOPSIS API."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator


class Criterion(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    weight: float = Field(..., ge=0)
    type: Literal["benefit", "cost"]


class Alternative(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    values: list[float]

    @field_validator("values")
    @classmethod
    def _positive_values(cls, v: list[float]):
        if any(x < 0 for x in v):
            raise ValueError("Todos os valores das alternativas devem ser não-negativos.")
        return v


class TopsisRequest(BaseModel):
    criteria: list[Criterion] = Field(..., min_length=1)
    alternatives: list[Alternative] = Field(..., min_length=2)
    normalization: Literal["vector", "linear", "minmax"] = "vector"

    @model_validator(mode="after")
    def _normalize_weights_and_validate_lengths(self):
        total = sum(c.weight for c in self.criteria)
        if total == 0:
            raise ValueError("A soma dos pesos nao pode ser 0.")

        self.criteria = [
            Criterion(name=c.name, weight=c.weight / total, type=c.type)
            for c in self.criteria
        ]

        n = len(self.criteria)
        for alt in self.alternatives:
            if len(alt.values) != n:
                raise ValueError(
                    f"Alternativa '{alt.name}' possui {len(alt.values)} valores "
                    f"mas {n} critérios foram fornecidos."
                )

        return self

class RankedAlternative(BaseModel):
    rank: int
    name: str
    closeness: float
    distance_to_pis: float
    distance_to_nis: float


class TopsisResponse(BaseModel):
    ranking: list[RankedAlternative]
    pis: list[float]
    nis: list[float]
    normalized_matrix: list[list[float]]
    weighted_matrix: list[list[float]]
    criteria_names: list[str]
    alternative_names: list[str]


class ProjectionPoint(BaseModel):
    id: str
    label: str
    type: Literal["alternative", "pis", "nis"]
    x: float
    y: float
    z: float


class TopsisProjectionResponse(BaseModel):
    points: list[ProjectionPoint]
    variance_explained: float
    d_plus: dict[str, float]
    d_minus: dict[str, float]
    cc: dict[str, float]
