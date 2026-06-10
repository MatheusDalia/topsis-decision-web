"""PCA projection utilities for TOPSIS vectors."""
from __future__ import annotations

from typing import Sequence

import numpy as np

from app.schemas import ProjectionPoint


def _power_iteration(
    matrix: np.ndarray,
    *,
    max_iter: int = 1_000,
    tol: float = 1e-10,
    seed: int = 42,
) -> tuple[float, np.ndarray]:
    n = matrix.shape[0]
    vec = np.random.default_rng(seed).normal(size=n)
    norm = np.linalg.norm(vec)
    if norm == 0:
        vec = np.ones(n)
        norm = np.linalg.norm(vec)
    vec = vec / norm

    for _ in range(max_iter):
        nxt = matrix @ vec
        nxt_norm = np.linalg.norm(nxt)
        if nxt_norm == 0:
            return 0.0, vec
        nxt = nxt / nxt_norm
        if np.linalg.norm(nxt - vec) < tol:
            vec = nxt
            break
        vec = nxt

    eigenvalue = float(vec.T @ matrix @ vec)
    return max(eigenvalue, 0.0), vec


def _top_components(covariance: np.ndarray, n_components: int) -> tuple[np.ndarray, np.ndarray]:
    work = covariance.astype(float).copy()
    vectors: list[np.ndarray] = []
    values: list[float] = []

    for idx in range(n_components):
        eigenvalue, eigenvector = _power_iteration(work, seed=42 + idx)
        if eigenvalue <= 1e-12:
            break
        values.append(eigenvalue)
        vectors.append(eigenvector)
        work = work - eigenvalue * np.outer(eigenvector, eigenvector)

    if not vectors:
        return np.zeros((covariance.shape[0], 0)), np.array([])

    return np.column_stack(vectors), np.asarray(values, dtype=float)


def project_weighted_space(
    weighted_matrix: Sequence[Sequence[float]],
    pis: Sequence[float],
    nis: Sequence[float],
    alternative_names: Sequence[str],
) -> tuple[list[ProjectionPoint], float]:
    alternatives = np.asarray(weighted_matrix, dtype=float)
    pis_vec = np.asarray(pis, dtype=float)
    nis_vec = np.asarray(nis, dtype=float)

    if alternatives.ndim != 2:
        raise ValueError("weighted_matrix must be 2D")
    if len(alternative_names) != alternatives.shape[0]:
        raise ValueError("alternative_names length mismatch")
    if pis_vec.shape != (alternatives.shape[1],) or nis_vec.shape != (alternatives.shape[1],):
        raise ValueError("pis/nis dimension mismatch")

    all_points = np.vstack([alternatives, pis_vec, nis_vec])
    centered = all_points - all_points.mean(axis=0, keepdims=True)

    if centered.shape[0] <= 1:
        covariance = np.zeros((centered.shape[1], centered.shape[1]))
    else:
        covariance = (centered.T @ centered) / (centered.shape[0] - 1)

    components, eigenvalues = _top_components(covariance, n_components=min(3, covariance.shape[0]))

    if components.shape[1] == 0:
        projected = np.zeros((all_points.shape[0], 3))
    else:
        projected_raw = centered @ components
        projected = np.zeros((projected_raw.shape[0], 3))
        projected[:, : projected_raw.shape[1]] = projected_raw

    total_variance = float(np.trace(covariance))
    explained = 0.0 if total_variance <= 0 else float((eigenvalues.sum() / total_variance) * 100.0)
    explained = max(0.0, min(100.0, explained))

    points: list[ProjectionPoint] = []
    for idx, label in enumerate(alternative_names):
        x, y, z = projected[idx]
        points.append(
            ProjectionPoint(
                id=f"alt-{idx}",
                label=label,
                type="alternative",
                x=float(x),
                y=float(y),
                z=float(z),
            )
        )

    pis_idx = len(alternative_names)
    nis_idx = len(alternative_names) + 1
    points.append(
        ProjectionPoint(
            id="pis",
            label="PIS",
            type="pis",
            x=float(projected[pis_idx, 0]),
            y=float(projected[pis_idx, 1]),
            z=float(projected[pis_idx, 2]),
        )
    )
    points.append(
        ProjectionPoint(
            id="nis",
            label="NIS",
            type="nis",
            x=float(projected[nis_idx, 0]),
            y=float(projected[nis_idx, 1]),
            z=float(projected[nis_idx, 2]),
        )
    )

    return points, explained
