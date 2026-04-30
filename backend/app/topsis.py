"""TOPSIS — Technique for Order Preference by Similarity to Ideal Solution.

Implementation based on:
    Hwang, C.L. & Yoon, K. (1981). Multiple Attribute Decision Making.
    Hwang, C.L., Lai, Y.J. & Liu, T.Y. (1993). A new approach for MODM.
    Chen, C.T. (2000). Extensions of the TOPSIS for group decision-making
        under fuzzy environment. Fuzzy Sets and Systems 114, 1–9.
"""
from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Sequence

import numpy as np


class CriterionType(str, Enum):
    BENEFIT = "benefit"
    COST = "cost"


class Normalization(str, Enum):
    VECTOR = "vector"      # rij = xij / sqrt(sum xij^2)   — TOPSIS clássico
    LINEAR = "linear"      # rij = xij / max  (benefit) | min/xij (cost)
    MINMAX = "minmax"      # (xij - min) / (max - min)


@dataclass
class TopsisResult:
    ranking: list[int]              # alternative indices, best first
    closeness: list[float]          # CCi for each alternative (in original order)
    distance_to_pis: list[float]    # di*
    distance_to_nis: list[float]    # di-
    normalized: list[list[float]]
    weighted: list[list[float]]
    pis: list[float]
    nis: list[float]


def _normalize(matrix: np.ndarray, types: list[CriterionType],
               method: Normalization) -> np.ndarray:
    if method is Normalization.VECTOR:
        norms = np.sqrt((matrix ** 2).sum(axis=0))
        norms[norms == 0] = 1.0
        return matrix / norms

    if method is Normalization.LINEAR:
        out = np.empty_like(matrix, dtype=float)
        for j, t in enumerate(types):
            col = matrix[:, j]
            if t is CriterionType.BENEFIT:
                m = col.max()
                out[:, j] = col / m if m else 0.0
            else:
                m = col.min()
                if m == 0:
                    safe = np.where(col == 0, 1.0, col)
                    out[:, j] = 0.0
                    out[col == 0, j] = 1.0
                    nonzero = col != 0
                    out[nonzero, j] = m / safe[nonzero] if m else 0.0
                else:
                    out[:, j] = m / col
        return out

    if method is Normalization.MINMAX:
        out = np.empty_like(matrix, dtype=float)
        for j, t in enumerate(types):
            col = matrix[:, j]
            lo, hi = col.min(), col.max()
            rng = hi - lo
            if rng == 0:
                out[:, j] = 1.0
                continue
            if t is CriterionType.BENEFIT:
                out[:, j] = (col - lo) / rng
            else:
                out[:, j] = (hi - col) / rng
        return out

    raise ValueError(f"unknown normalization: {method}")


def topsis(
    matrix: Sequence[Sequence[float]],
    weights: Sequence[float],
    types: Sequence[CriterionType | str],
    *,
    normalization: Normalization | str = Normalization.VECTOR,
) -> TopsisResult:
    """Run TOPSIS on a decision matrix.

    matrix: m x n matrix; rows are alternatives, cols are criteria
    weights: length-n vector; will be normalized to sum 1
    types: length-n sequence of CriterionType (benefit or cost)
    """
    m = np.asarray(matrix, dtype=float)
    if m.ndim != 2:
        raise ValueError("matrix must be 2D")

    rows, cols = m.shape
    if rows < 2:
        raise ValueError("need at least 2 alternatives")
    if cols < 1:
        raise ValueError("need at least 1 criterion")

    w = np.asarray(weights, dtype=float)
    if w.shape != (cols,):
        raise ValueError(f"weights length {w.shape} != criteria count {cols}")
    if (w < 0).any():
        raise ValueError("weights must be non-negative")
    s = w.sum()
    if s == 0:
        raise ValueError("weights cannot all be zero")
    w = w / s

    parsed_types = [CriterionType(t) if isinstance(t, str) else t for t in types]
    if len(parsed_types) != cols:
        raise ValueError("types length != criteria count")

    norm_method = (Normalization(normalization)
                   if isinstance(normalization, str) else normalization)

    r = _normalize(m, parsed_types, norm_method)
    v = r * w

    pis = np.empty(cols)
    nis = np.empty(cols)
    for j, t in enumerate(parsed_types):
        if t is CriterionType.BENEFIT:
            pis[j] = v[:, j].max()
            nis[j] = v[:, j].min()
        else:
            pis[j] = v[:, j].min()
            nis[j] = v[:, j].max()

    d_pis = np.sqrt(((v - pis) ** 2).sum(axis=1))
    d_nis = np.sqrt(((v - nis) ** 2).sum(axis=1))

    denom = d_pis + d_nis
    cc = np.where(denom == 0, 0.0, d_nis / denom)

    ranking = np.argsort(-cc).tolist()

    return TopsisResult(
        ranking=ranking,
        closeness=cc.tolist(),
        distance_to_pis=d_pis.tolist(),
        distance_to_nis=d_nis.tolist(),
        normalized=r.tolist(),
        weighted=v.tolist(),
        pis=pis.tolist(),
        nis=nis.tolist(),
    )
