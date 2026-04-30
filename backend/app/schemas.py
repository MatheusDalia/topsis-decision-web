"""Pydantic schemas for the TOPSIS API."""
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
                    f"alternative '{alt.name}' has {len(alt.values)} values "
                    f"but {n} criteria were declared"
                )
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
