"""FastAPI entry point for the TOPSIS decision-support web service."""
from __future__ import annotations

import csv
import io
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.schemas import (
    RankedAlternative,
    TopsisProjectionResponse,
    TopsisRequest,
    TopsisResponse,
)
from app.services.pca_service import project_weighted_space
from app.topsis import topsis

app = FastAPI(
    title="TOPSIS Decision Web - API Support ",
    description=(
        "REST API implementing the classical TOPSIS algorithm "
        "(Hwang & Yoon, 1981; Chen, 2000). "
        "Built for SAD, "
        "Project."
    ),
    version="0.1.0",
)

# CORS: origens permitidas vêm de ALLOWED_ORIGINS (lista separada por
# vírgula). Mantém localhost:3000 como fallback para dev local.
_default_origins = "http://localhost:3000"
_allowed_origins = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", _default_origins).split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

#monitoramento de saúde da do backend
@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}

#solução do problema de decisão usando TOPSIS, retornando resposta estruturada para o usuário, e tratamento de erros caso a entrada seja inválida
def _solve(req: TopsisRequest) -> TopsisResponse:
    matrix = [a.values for a in req.alternatives]
    weights = [c.weight for c in req.criteria]
    types = [c.type for c in req.criteria]

    try:
        result = topsis(matrix, weights, types, normalization=req.normalization)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e

    #nomes das alternativas e critérios para incluir no resultado
    alt_names = [a.name for a in req.alternatives]
    crit_names = [c.name for c in req.criteria]

    #ranking das alternativas com base nos resultados do TOPSIS, incluindo informações de proximidade e distância para os ideais
    ranked = [
        RankedAlternative(
            rank=position + 1,
            name=alt_names[idx],
            closeness=result.closeness[idx],
            distance_to_pis=result.distance_to_pis[idx],
            distance_to_nis=result.distance_to_nis[idx],
        )
        for position, idx in enumerate(result.ranking)
    ]

    #construindo a resposta final com o ranking e os detalhes do cálculo para o frontend consumir e exibir ao usuário na página de Resultado
    return TopsisResponse(
        ranking=ranked,
        pis=result.pis,
        nis=result.nis,
        normalized_matrix=result.normalized,
        weighted_matrix=result.weighted,
        criteria_names=crit_names,
        alternative_names=alt_names,
    )

#endpoint que recebe a requisição do frontend com os dados da matriz de decisão, pesos e tipos dos critérios, e retorna o resultado completo
@app.post("/api/v1/topsis", response_model=TopsisResponse, tags=["topsis"])
def run_topsis(req: TopsisRequest) -> TopsisResponse:
    """Run TOPSIS on the provided decision matrix and return full results."""
    return _solve(req)

#endpoint que exporta o ranking das alternativas como um arquivo CSV, permitindo que o usuário baixe os resultados
@app.post("/api/v1/topsis/export.csv", tags=["topsis"])
def export_csv(req: TopsisRequest) -> StreamingResponse:
    """Run TOPSIS and stream the ranking as CSV."""
    response = _solve(req)
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["rank", "alternative", "closeness", "d_pis", "d_nis"])
    for r in response.ranking:
        writer.writerow([r.rank, r.name,
                         f"{r.closeness:.6f}",
                         f"{r.distance_to_pis:.6f}",
                         f"{r.distance_to_nis:.6f}"])
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=topsis_ranking.csv"},
    )


@app.post("/api/v1/topsis/projection", response_model=TopsisProjectionResponse, tags=["topsis"])
def project_topsis(req: TopsisRequest) -> TopsisProjectionResponse:
    """Project weighted alternatives + PIS/NIS into 3D PCA space."""
    response = _solve(req)
    points, variance_explained = project_weighted_space(
        weighted_matrix=response.weighted_matrix,
        pis=response.pis,
        nis=response.nis,
        alternative_names=response.alternative_names,
    )
    d_plus = {item.name: item.distance_to_pis for item in response.ranking}
    d_minus = {item.name: item.distance_to_nis for item in response.ranking}
    cc = {item.name: item.closeness for item in response.ranking}
    return TopsisProjectionResponse(
        points=points,
        variance_explained=variance_explained,
        d_plus=d_plus,
        d_minus=d_minus,
        cc=cc,
    )
