"""Tests for the TOPSIS algorithm.

The reference example replicates Chen (2000), Section 4 — selection of
a system analyst among 3 candidates. Using crisp midpoints of the
triangular fuzzy numbers, the expected ranking is A2 > A3 > A1.
"""
from __future__ import annotations

import math

import pytest

from app.topsis import CriterionType, Normalization, topsis


def test_chen_2000_example_ranking():
    matrix = [
        [7.7, 7.0, 7.7, 9.67, 5.0],
        [8.3, 10.0, 9.7, 10.0, 9.0],
        [8.0, 9.0, 9.0, 9.0, 8.3],
    ]
    weights = [0.90, 1.00, 0.93, 1.00, 0.63]
    types = [CriterionType.BENEFIT] * 5

    res = topsis(matrix, weights, types, normalization=Normalization.LINEAR)

    assert res.ranking == [1, 2, 0]
    assert res.closeness[1] > res.closeness[2] > res.closeness[0]
    for cc in res.closeness:
        assert 0.0 <= cc <= 1.0


def test_classic_minimal_example():
    matrix = [
        [250, 16, 12, 5],
        [200, 16, 8, 3],
        [300, 32, 16, 4],
        [275, 32, 8, 4],
        [225, 16, 16, 2],
    ]
    weights = [0.25, 0.25, 0.25, 0.25]
    types = ["cost", "benefit", "benefit", "benefit"]

    res = topsis(matrix, weights, types, normalization="vector")
    assert len(res.ranking) == 5
    assert all(0.0 <= cc <= 1.0 for cc in res.closeness)
    assert sorted(res.ranking) == [0, 1, 2, 3, 4]


def test_weights_get_normalized():
    matrix = [[1, 2], [3, 4]]
    r1 = topsis(matrix, [1, 1], ["benefit", "benefit"])
    r2 = topsis(matrix, [10, 10], ["benefit", "benefit"])
    for a, b in zip(r1.closeness, r2.closeness):
        assert math.isclose(a, b, rel_tol=1e-9)


def test_invalid_dimensions_raise():
    with pytest.raises(ValueError):
        topsis([[1, 2]], [0.5, 0.5], ["benefit", "benefit"])


def test_mismatched_weights_raise():
    with pytest.raises(ValueError):
        topsis([[1, 2], [3, 4]], [0.5], ["benefit", "benefit"])


def test_zero_weights_raise():
    with pytest.raises(ValueError):
        topsis([[1, 2], [3, 4]], [0, 0], ["benefit", "benefit"])
