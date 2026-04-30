// Client for the FastAPI TOPSIS backend.

export type CriterionType = "benefit" | "cost";
export type Normalization = "vector" | "linear" | "minmax";

export interface Criterion {
  name: string;
  weight: number;
  type: CriterionType;
}

export interface Alternative {
  name: string;
  values: number[];
}

export interface TopsisRequest {
  criteria: Criterion[];
  alternatives: Alternative[];
  normalization: Normalization;
}

export interface RankedAlternative {
  rank: number;
  name: string;
  closeness: number;
  distance_to_pis: number;
  distance_to_nis: number;
}

export interface TopsisResponse {
  ranking: RankedAlternative[];
  pis: number[];
  nis: number[];
  normalized_matrix: number[][];
  weighted_matrix: number[][];
  criteria_names: string[];
  alternative_names: string[];
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function runTopsis(req: TopsisRequest): Promise<TopsisResponse> {
  const r = await fetch(`${API_BASE}/api/v1/topsis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`API ${r.status}: ${text}`);
  }
  return (await r.json()) as TopsisResponse;
}

export async function exportCsv(req: TopsisRequest): Promise<Blob> {
  const r = await fetch(`${API_BASE}/api/v1/topsis/export.csv`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return await r.blob();
}
