"""FastAPI entry point for the TOPSIS decision-support web service."""
from __future__ import annotations

import csv
import io

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.schemas import RankedAlternative, TopsisRequest, TopsisResponse
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

#confirguração de CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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

    #validação dos pesos para garantir que somam 1.0
    total = sum(weights)
    if not (0.99 <= total <= 1.01):
        raise HTTPException(
            status_code=422,
            detail=f"Os pesos devem somar 1.0. Soma atual: {total:.4f}"
        )

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
