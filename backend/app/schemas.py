"""Schemas for the TOPSIS API."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator


class Criterion(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    weight: float = Field(..., ge=0)
    type: Literal["benefit", "cost"]


class Alternative(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    values: list[float]


class TopsisRequest(BaseModel):
    criteria: list[Criterion] = Field(..., min_length=1)
    alternatives: list[Alternative] = Field(..., min_length=2)
    normalization: Literal["vector", "linear", "minmax"] = "vector"

    @field_validator("alternatives")
    @classmethod
    def _consistent_lengths(cls, v: list[Alternative], info):
        criteria = info.data.get("criteria") or []
        n = len(criteria)
        for alt in v:
            if len(alt.values) != n:
                raise ValueError(
                    f"Alternativa '{alt.name}' possui {len(alt.values)} valores "
                    f"mas {n} critérios foram fornecidos."
                )
        return v
    
    @field_validator("criteria")
    @classmethod
    def _weights_sum_to_one(cls, v: list[Criterion]):
        total = sum(c.weight for c in v)
        if not (0.99 <= total <= 1.01):
            raise ValueError(
                f"Os pesos devem somar 1.0. Soma atual: {total:.4f}"
            )
        return v

    @field_validator("values")
    @classmethod
    def _positive_values(cls, v: list[float]):
        if any(x < 0 for x in v):
            raise ValueError("Todos os valores das alternativas devem ser não-negativos.")
        return v


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
