// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Legend,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import {
//   TopsisRequest,
//   TopsisResponse,
//   exportCsv,
// } from "@/lib/api";

// const PALETTE = [
//   "#0369a1", "#15803d", "#a16207", "#9333ea", "#be185d",
//   "#0891b2", "#65a30d", "#ea580c", "#7c3aed", "#db2777",
// ];

// export default function ResultPage() {
//   const [data, setData] = useState<TopsisResponse | null>(null);
//   const [request, setRequest] = useState<TopsisRequest | null>(null);

//   useEffect(() => {
//     const stored = sessionStorage.getItem("topsis:result");
//     const reqStored = sessionStorage.getItem("topsis:request");
//     if (stored) setData(JSON.parse(stored) as TopsisResponse);
//     if (reqStored) setRequest(JSON.parse(reqStored) as TopsisRequest);
//   }, []);

//   const handleExport = async () => {
//     if (!request) return;
//     try {
//       const blob = await exportCsv(request);
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "topsis_ranking.csv";
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch (e) {
//       alert(e instanceof Error ? e.message : "Erro ao exportar");
//     }
//   };

//   if (!data) {
//     return (
//       <main className="min-h-screen bg-slate-50">
//         <section className="mx-auto max-w-3xl px-6 py-16 text-center">
//           <p className="text-slate-600">Sem resultados para exibir.</p>
//           <Link
//             href="/decision"
//             className="mt-4 inline-block text-sky-700 hover:underline"
//           >
//             ← Voltar ao formulário
//           </Link>
//         </section>
//       </main>
//     );
//   }

//   const chartData = data.ranking.map((r) => ({
//     name: r.name,
//     cc: Number(r.closeness.toFixed(4)),
//   }));

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <section className="mx-auto max-w-6xl px-6 py-12">
//         <div className="flex items-center justify-between">
//           <Link
//             href="/decision"
//             className="text-sm text-sky-700 hover:underline"
//           >
//             ← Refazer decisão
//           </Link>
//           <button
//             onClick={handleExport}
//             className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
//           >
//             Exportar CSV
//           </button>
//         </div>

//         <h1 className="mt-4 text-3xl font-bold text-slate-900">Resultado</h1>
//         <p className="mt-2 text-slate-600">
//           Ranking calculado pelo método TOPSIS clássico (distância
//           Euclidiana, p=2). Maior coeficiente de proximidade = melhor
//           alternativa.
//         </p>

//         <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
//           <p className="text-sm uppercase tracking-wider text-amber-800">
//             Vencedor
//           </p>
//           <p className="mt-1 text-3xl font-bold text-amber-900">
//             🏆 {data.ranking[0].name}
//           </p>
//           <p className="mt-2 text-sm text-amber-800">
//             CCi = {data.ranking[0].closeness.toFixed(4)}
//           </p>
//         </div>

//         <div className="mt-8 grid gap-6 lg:grid-cols-2">
//           <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//             <h2 className="text-lg font-semibold text-slate-900">
//               Coeficiente de proximidade
//             </h2>
//             <div className="mt-4 h-72">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis domain={[0, 1]} />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="cc" name="CCi">
//                     {chartData.map((_, i) => (
//                       <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//             <h2 className="text-lg font-semibold text-slate-900">
//               Distâncias às soluções ideais
//             </h2>
//             <div className="mt-4 h-72">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={data.ranking.map((r) => ({
//                     name: r.name,
//                     "d* (à PIS)": Number(r.distance_to_pis.toFixed(4)),
//                     "d⁻ (à NIS)": Number(r.distance_to_nis.toFixed(4)),
//                   }))}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="d* (à PIS)" fill="#dc2626" />
//                   <Bar dataKey="d⁻ (à NIS)" fill="#16a34a" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//           <h2 className="text-lg font-semibold text-slate-900">
//             Ranking completo
//           </h2>
//           <div className="mt-4 overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-slate-200 text-left text-slate-600">
//                   <th className="px-3 py-2 font-medium">#</th>
//                   <th className="px-3 py-2 font-medium">Alternativa</th>
//                   <th className="px-3 py-2 font-medium">CCi</th>
//                   <th className="px-3 py-2 font-medium">d*</th>
//                   <th className="px-3 py-2 font-medium">d⁻</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.ranking.map((r) => (
//                   <tr key={r.name} className="border-b border-slate-100">
//                     <td className="px-3 py-2 font-semibold">{r.rank}</td>
//                     <td className="px-3 py-2">{r.name}</td>
//                     <td className="px-3 py-2">{r.closeness.toFixed(4)}</td>
//                     <td className="px-3 py-2">
//                       {r.distance_to_pis.toFixed(4)}
//                     </td>
//                     <td className="px-3 py-2">
//                       {r.distance_to_nis.toFixed(4)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <details className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//           <summary className="cursor-pointer text-sm font-semibold text-slate-700">
//             Ver matrizes intermediárias (PIS, NIS, normalizada, ponderada)
//           </summary>
//           <div className="mt-4 grid gap-6 lg:grid-cols-2">
//             <div>
//               <h3 className="font-medium text-slate-800">
//                 Solução Ideal Positiva (PIS)
//               </h3>
//               <pre className="mt-2 overflow-x-auto rounded bg-slate-50 p-3 text-xs">
//                 {data.criteria_names
//                   .map((c, i) => `${c}: ${data.pis[i].toFixed(4)}`)
//                   .join("\n")}
//               </pre>
//             </div>
//             <div>
//               <h3 className="font-medium text-slate-800">
//                 Solução Ideal Negativa (NIS)
//               </h3>
//               <pre className="mt-2 overflow-x-auto rounded bg-slate-50 p-3 text-xs">
//                 {data.criteria_names
//                   .map((c, i) => `${c}: ${data.nis[i].toFixed(4)}`)
//                   .join("\n")}
//               </pre>
//             </div>
//           </div>
//         </details>
//       </section>
//     </main>
//   );
// }
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  type CSSProperties,
  type ComponentType,
  type ReactNode,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { TopsisRequest, TopsisResponse, exportCsv } from "@/lib/api";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false }) as ComponentType<{
  data: unknown;
  layout?: unknown;
  config?: unknown;
  style?: CSSProperties;
}>;

type AlternativeMetric = {
  index: number;
  name: string;
  rank: number;
  dPlus: number;
  dMinus: number;
  score: number;
  values: number[];
};

type CriterionKind = "benefit" | "cost";

const PALETTE = {
  brand: "#DB1E2F",
  brandDark: "#AF0421",
  pis: "#378ADD",
  nis: "#D85A30",
  criteria: [
    "#7F1D1D",
    "#991B1B",
    "#B91C1C",
    "#DC2626",
    "#EF4444",
    "#F87171",
    "#FCA5A5",
    "#FECACA",
  ],
  rankGradient: ["#7F1D1D", "#991B1B", "#B91C1C", "#DC2626", "#EF4444", "#F87171", "#FCA5A5"],
  dPlus: "#378ADD",
  dMinus: "#D85A30",
  gridLine: "#F1F5F9",
  axisText: "#64748B",
  annotation: "#1E293B",
} as const;

const BASE_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: {
    family: "Inter, ui-sans-serif, system-ui, sans-serif",
    color: PALETTE.axisText,
    size: 12,
  },
  margin: { l: 56, r: 24, t: 16, b: 56 },
  xaxis: {
    gridcolor: PALETTE.gridLine,
    linecolor: PALETTE.gridLine,
    tickcolor: "rgba(0,0,0,0)",
    zeroline: false,
  },
  yaxis: {
    gridcolor: PALETTE.gridLine,
    linecolor: PALETTE.gridLine,
    tickcolor: "rgba(0,0,0,0)",
    zeroline: false,
  },
  legend: {
    bgcolor: "rgba(0,0,0,0)",
    borderwidth: 0,
    font: { size: 11, color: PALETTE.axisText },
  },
};

const BASE_CONFIG = { responsive: true, displayModeBar: false };

const heatColorscale: Plotly.ColorScale = [
  [0, "#FEF2F2"],
  [0.5, "#FCA5A5"],
  [1, "#B91C1C"],
];

const PCA_CONTRAST_COLORS = {
  toPis: "#378ADD",
  toNis: "#D85A30",
  pis: "#378ADD",
  nis: "#D85A30",
} as const;

function normalizeWeights(weights: number[]): number[] {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0) {
    if (!weights.length) return [];
    return Array.from({ length: weights.length }, () => 1 / weights.length);
  }
  return weights.map((weight) => weight / total);
}

function ResultExplanation({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((state) => !state)}
        className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
        aria-label={`${open ? "Fechar" : "Abrir"} ajuda: ${title}`}
        aria-expanded={open}
      >
        <span className="text-sm leading-none">{open ? "✕" : "ⓘ"}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-[min(28rem,88vw)] p-4 bg-white rounded-lg border border-gray-200 shadow-lg text-sm text-gray-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

const noopSubscribe = () => () => {};
const sessionSnapshotCache = new Map<string, { raw: string | null; parsed: unknown }>();

function useSessionStorageJson<T>(key: string): T | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      if (typeof window === "undefined") return null;
      const raw = window.sessionStorage.getItem(key);
      const cached = sessionSnapshotCache.get(key);
      if (cached && cached.raw === raw) {
        return cached.parsed as T | null;
      }

      let parsed: T | null = null;
      if (raw) {
        try {
          parsed = JSON.parse(raw) as T;
        } catch {
          parsed = null;
        }
      }

      sessionSnapshotCache.set(key, { raw, parsed });
      return parsed;
    },
    () => null,
  );
}

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((acc, value, idx) => acc + (value - (b[idx] ?? 0)) ** 2, 0));
}

function rankColor(rank: number, total: number): string {
  if (total <= 1) return PALETTE.rankGradient[0];
  const ratio = (rank - 1) / (total - 1);
  const index = Math.min(
    PALETTE.rankGradient.length - 1,
    Math.max(0, Math.round(ratio * (PALETTE.rankGradient.length - 1))),
  );
  return PALETTE.rankGradient[index];
}

function powerIteration(matrix: number[][], iterations = 200): { value: number; vector: number[] } {
  const n = matrix.length;
  let vector = Array.from({ length: n }, () => Math.random() - 0.5);
  const norm0 = Math.sqrt(vector.reduce((acc, value) => acc + value * value, 0)) || 1;
  vector = vector.map((value) => value / norm0);

  for (let iter = 0; iter < iterations; iter += 1) {
    const next = matrix.map((row) => row.reduce((acc, value, idx) => acc + value * vector[idx], 0));
    const norm = Math.sqrt(next.reduce((acc, value) => acc + value * value, 0)) || 1;
    vector = next.map((value) => value / norm);
  }

  const mv = matrix.map((row) => row.reduce((acc, value, idx) => acc + value * vector[idx], 0));
  const value = vector.reduce((acc, current, idx) => acc + current * mv[idx], 0);
  return { value: Math.max(value, 0), vector };
}

function projectPca2(points: number[][]): { projected: number[][]; explained: number } {
  if (!points.length || !points[0]?.length) {
    return { projected: [], explained: 0 };
  }

  const rows = points.length;
  const cols = points[0].length;
  const means = Array.from({ length: cols }, (_, col) => {
    const sum = points.reduce((acc, row) => acc + row[col], 0);
    return sum / rows;
  });
  const centered = points.map((row) => row.map((value, col) => value - means[col]));

  const covariance = Array.from({ length: cols }, () => Array(cols).fill(0));
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      const sum = centered.reduce((acc, row) => acc + row[i] * row[j], 0);
      covariance[i][j] = sum / Math.max(rows - 1, 1);
    }
  }

  const first = powerIteration(covariance);
  const deflated = covariance.map((row, i) =>
    row.map((value, j) => value - first.value * first.vector[i] * first.vector[j]),
  );
  const second = powerIteration(deflated);

  const components = [first.vector, second.vector];
  const projected = centered.map((row) =>
    components.map((component) => row.reduce((acc, value, idx) => acc + value * component[idx], 0)),
  );

  const trace = covariance.reduce((acc, row, idx) => acc + row[idx], 0);
  const explained = trace > 0 ? ((first.value + second.value) / trace) * 100 : 0;
  return { projected, explained: Math.max(0, Math.min(100, explained)) };
}

function projectPca3(points: number[][]): { projected: number[][]; explained: number } {
  if (!points.length || !points[0]?.length) {
    return { projected: [], explained: 0 };
  }

  const rows = points.length;
  const cols = points[0].length;
  const means = Array.from({ length: cols }, (_, col) => {
    const sum = points.reduce((acc, row) => acc + row[col], 0);
    return sum / rows;
  });
  const centered = points.map((row) => row.map((value, col) => value - means[col]));

  const covariance = Array.from({ length: cols }, () => Array(cols).fill(0));
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      const sum = centered.reduce((acc, row) => acc + row[i] * row[j], 0);
      covariance[i][j] = sum / Math.max(rows - 1, 1);
    }
  }

  const first = powerIteration(covariance);
  const deflated1 = covariance.map((row, i) =>
    row.map((value, j) => value - first.value * first.vector[i] * first.vector[j]),
  );
  const second = powerIteration(deflated1);
  const deflated2 = deflated1.map((row, i) =>
    row.map((value, j) => value - second.value * second.vector[i] * second.vector[j]),
  );
  const third = powerIteration(deflated2);

  const components = [first.vector, second.vector, third.vector];
  const projected = centered.map((row) =>
    components.map((component) => row.reduce((acc, value, idx) => acc + value * component[idx], 0)),
  );

  const trace = covariance.reduce((acc, row, idx) => acc + row[idx], 0);
  const explained = trace > 0 ? ((first.value + second.value + third.value) / trace) * 100 : 0;
  return { projected, explained: Math.max(0, Math.min(100, explained)) };
}

export default function ResultPage() {
  const data = useSessionStorageJson<TopsisResponse>("topsis:result");
  const request = useSessionStorageJson<TopsisRequest>("topsis:request");
  const [editedWeights, setEditedWeights] = useState<number[] | null>(null);
  const [showDistances, setShowDistances] = useState(true);
  const [showScores, setShowScores] = useState(true);
  const [showContribution, setShowContribution] = useState(true);
  const [showSpatial, setShowSpatial] = useState(true);
  const [showSensitivity, setShowSensitivity] = useState(true);
  const [showMatrices, setShowMatrices] = useState(true);

  const handleExport = async () => {
    if (!request) return;
    try {
      const blob = await exportCsv(request);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "topsis_ranking.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao exportar");
    }
  };

  const metrics = useMemo(() => {
    if (!data) return [];
    const rankingByName = new Map(data.ranking.map((item) => [item.name, item]));
    const fromWeighted = data.alternative_names.map((name, index) => {
      const values = data.weighted_matrix[index] ?? [];
      const ranked = rankingByName.get(name);
      const dPlusCalc = euclideanDistance(values, data.pis);
      const dMinusCalc = euclideanDistance(values, data.nis);
      const dPlus = ranked?.distance_to_pis ?? dPlusCalc;
      const dMinus = ranked?.distance_to_nis ?? dMinusCalc;
      const denom = dPlus + dMinus;
      return {
        index,
        name,
        rank: ranked?.rank ?? index + 1,
        dPlus,
        dMinus,
        score: ranked?.closeness ?? (denom === 0 ? 0 : dMinus / denom),
        values,
      } satisfies AlternativeMetric;
    });

    return fromWeighted
      .map((item) => ({
        ...item,
        color: rankColor(item.rank, fromWeighted.length),
        size: 12 + item.score * 16,
      }))
      .sort((a, b) => a.rank - b.rank);
  }, [data]);

  const criteriaCount = data?.criteria_names.length ?? 0;

  const criterionKinds = useMemo<CriterionKind[]>(() => {
    if (!data) return [];
    if (request?.criteria.length === data.criteria_names.length) {
      return request.criteria.map((criterion) => criterion.type);
    }
    return data.criteria_names.map((_, index) =>
      (data.pis[index] ?? 0) >= (data.nis[index] ?? 0) ? "benefit" : "cost",
    );
  }, [data, request]);

  const originalWeights = useMemo(() => {
    if (!data) return [];
    if (request?.criteria.length === data.criteria_names.length) {
      return normalizeWeights(request.criteria.map((criterion) => criterion.weight));
    }
    return normalizeWeights(Array.from({ length: data.criteria_names.length }, () => 1));
  }, [data, request]);

  const activeWeights = useMemo(() => {
    if (!data) return [];
    if (editedWeights && editedWeights.length === data.criteria_names.length) {
      return normalizeWeights(editedWeights);
    }
    return originalWeights;
  }, [data, editedWeights, originalWeights]);

  const handleWeightChange = (index: number, rawValue: number) => {
    if (!data) return;
    const n = data.criteria_names.length;
    if (n === 0) return;

    const clamped = Math.max(0, Math.min(1, rawValue));
    if (n === 1) {
      setEditedWeights([1]);
      return;
    }

    const base = activeWeights.length === n ? [...activeWeights] : normalizeWeights(Array.from({ length: n }, () => 1));
    const othersTotal = base.reduce((sum, weight, idx) => (idx === index ? sum : sum + weight), 0);
    const remaining = Math.max(0, 1 - clamped);
    const redistributed = base.map((weight, idx) => {
      if (idx === index) return clamped;
      if (othersTotal <= 0) return remaining / (n - 1);
      return (weight / othersTotal) * remaining;
    });
    setEditedWeights(redistributed);
  };

  const simulated = useMemo(() => {
    if (!data) {
      return {
        ranking: [] as Array<{ name: string; rank: number; score: number; dPlus: number; dMinus: number; delta: number }>,
        weighted: [] as number[][],
        pis: [] as number[],
        nis: [] as number[],
        changed: false,
        inversionMessage: "",
      };
    }

    const weighted = data.normalized_matrix.map((row) =>
      row.map((value, col) => value * (activeWeights[col] ?? 0)),
    );

    const pis = data.criteria_names.map((_, col) => {
      const colValues = weighted.map((row) => row[col] ?? 0);
      const kind = criterionKinds[col] ?? "benefit";
      return kind === "benefit" ? Math.max(...colValues) : Math.min(...colValues);
    });

    const nis = data.criteria_names.map((_, col) => {
      const colValues = weighted.map((row) => row[col] ?? 0);
      const kind = criterionKinds[col] ?? "benefit";
      return kind === "benefit" ? Math.min(...colValues) : Math.max(...colValues);
    });

    const originalByName = new Map(metrics.map((item) => [item.name, item.score]));
    const ranking = data.alternative_names.map((name, idx) => {
      const values = weighted[idx] ?? [];
      const dPlus = euclideanDistance(values, pis);
      const dMinus = euclideanDistance(values, nis);
      const denom = dPlus + dMinus;
      const score = denom === 0 ? 0 : dMinus / denom;
      return {
        name,
        rank: 0,
        score,
        dPlus,
        dMinus,
        delta: score - (originalByName.get(name) ?? 0),
      };
    });

    ranking.sort((a, b) => b.score - a.score);
    ranking.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    const originalOrder = metrics.map((item) => item.name);
    const simulatedOrder = ranking.map((item) => item.name);
    const changed =
      originalOrder.length === simulatedOrder.length &&
      originalOrder.some((name, idx) => name !== simulatedOrder[idx]);

    let inversionMessage = "";
    if (changed) {
      const changedIndex = simulatedOrder.findIndex((name, idx) => name !== originalOrder[idx]);
      const superior = simulatedOrder[changedIndex] ?? simulatedOrder[0] ?? "";
      const surpassed = originalOrder[changedIndex] ?? originalOrder[0] ?? "";
      inversionMessage = `⚠ Inversão de ranking detectada: ${superior} supera ${surpassed} nesta configuração.`;
    }

    return { ranking, weighted, pis, nis, changed, inversionMessage };
  }, [activeWeights, criterionKinds, data, metrics]);

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-50">
        <nav className="bg-[#231F20] px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#DB1E2F] rounded-md flex items-center justify-center text-white font-black text-sm">
              T
            </div>
            <div>
              <span className="text-white font-bold text-sm tracking-wide">TOPSIS Web</span>
              <span className="text-gray-500 text-xs block leading-none mt-0.5">CIn · UFPE</span>
            </div>
          </Link>
        </nav>
        <section className="max-w-3xl mx-auto px-10 py-20 text-center">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-500 text-sm mb-6">Sem resultados para exibir.</p>
          <Link
            href="/decision"
            className="bg-[#DB1E2F] hover:bg-[#AF0421] text-white text-sm font-bold px-6 py-3 rounded-lg transition"
          >
            ← Voltar ao formulário
          </Link>
        </section>
      </main>
    );
  }

  const winner = metrics[0];
  const winnerMargin = metrics.length > 1 && winner ? winner.score - metrics[1].score : null;

  const scoreChartHeight = Math.max(280, metrics.length * 72);
  const distanceChartHeight = Math.max(320, metrics.length * 56);
  const spatialChartHeight = Math.max(360, metrics.length * 62);
  const heatmapHeight = Math.max(240, metrics.length * 80);

  const activeCriterionIndices = data.criteria_names
    .map((_, col) => col)
    .filter((col) => data.weighted_matrix.some((row) => (row[col] ?? 0) !== 0));
  const criteriaForContribution = activeCriterionIndices.length
    ? activeCriterionIndices
    : data.criteria_names.map((_, col) => col);

  const distPlotData = [
    {
      type: "bar",
      name: "d⁺ (distância ao ideal positivo)",
      x: metrics.map((item) => item.name),
      y: metrics.map((item) => item.dPlus),
      marker: { color: PALETTE.brandDark },
      hovertemplate: "%{x}<br>d⁺: %{y:.3f}<extra></extra>",
    },
    {
      type: "bar",
      name: "d⁻ (distância ao ideal negativo)",
      x: metrics.map((item) => item.name),
      y: metrics.map((item) => item.dMinus),
      marker: { color: "#F87171" },
      hovertemplate: "%{x}<br>d⁻: %{y:.3f}<extra></extra>",
    },
  ];
  const maxDistance = Math.max(
    0,
    ...metrics.flatMap((item) => [item.dPlus, item.dMinus]),
  );
  const distanceYAxisMax = Math.max(0.1, Math.ceil(maxDistance * 10) / 10);
  const distanceDtick = distanceYAxisMax <= 0.5 ? 0.05 : 0.1;

  const scorePlotData = [
    {
      type: "bar",
      orientation: "h",
      x: [...metrics].reverse().map((item) => item.score),
      y: [...metrics].reverse().map((item) => `${item.rank}o - ${item.name}`),
      marker: { color: [...metrics].reverse().map((item) => item.color) },
      text: [...metrics].reverse().map((item) => item.score.toFixed(3)),
      textposition: "outside",
      textfont: { color: PALETTE.annotation, size: 11 },
      hovertemplate: "%{y}<br>Score: %{x:.3f}<extra></extra>",
    },
  ];

  const baseHover = (item: AlternativeMetric) =>
    `${item.name}<br>Rank: ${item.rank}o<br>d+: ${item.dPlus.toFixed(3)}<br>d-: ${item.dMinus.toFixed(3)}<br>Score: ${item.score.toFixed(3)}<br>Ponderados: [${item.values.map((value) => value.toFixed(3)).join(", ")}]`;

  const heatmapZ = metrics.map((item) => criteriaForContribution.map((col) => item.values[col] ?? 0));
  const heatmapCustom = metrics.map((item) =>
    criteriaForContribution.map((col) => {
      const value = item.values[col] ?? 0;
      const toPis = Math.abs(value - (data.pis[col] ?? 0));
      const toNis = Math.abs(value - (data.nis[col] ?? 0));
      return toPis <= toNis ? "mais proximo do PIS" : "mais proximo do NIS";
    }),
  );
  const heatmapAnnotations =
    metrics.length <= 4
      ? metrics.flatMap((item) =>
          criteriaForContribution.map((col) => ({
            x: data.criteria_names[col],
            y: item.name,
            text: (item.values[col] ?? 0).toFixed(3),
            showarrow: false,
            font: { size: 10, color: PALETTE.annotation },
          })),
        )
      : [];
  const winnerSeparator =
    metrics.length > 1
      ? [
          {
            type: "line",
            xref: "paper",
            yref: "paper",
            x0: 0,
            x1: 1,
            y0: 1 - 1 / metrics.length,
            y1: 1 - 1 / metrics.length,
            line: { color: "#94A3B8", width: 1.5, dash: "dot" },
          },
        ]
      : [];

  const dPlusSquaredTotal = metrics.map((item) =>
    criteriaForContribution.reduce((sum, col) => sum + ((item.values[col] ?? 0) - (data.pis[col] ?? 0)) ** 2, 0),
  );
  const contributionTraces = criteriaForContribution.map((col, idx) => {
    const criterion = data.criteria_names[col];
    const values = metrics.map((item) => ((item.values[col] ?? 0) - (data.pis[col] ?? 0)) ** 2);
    const text = values.map((value, rowIdx) => {
      const total = dPlusSquaredTotal[rowIdx] || 1;
      const pct = (value / total) * 100;
      return pct >= 10 ? `${pct.toFixed(0)}%` : "";
    });
    return {
      type: "bar",
      name: criterion,
      legendgroup: criterion,
      x: metrics.map((item) => item.name),
      y: values,
      marker: { color: PALETTE.criteria[idx % PALETTE.criteria.length] },
      text,
      textposition: "inside",
      insidetextanchor: "middle",
      textfont: { size: 10, color: "#ffffff" },
      customdata: values.map((value, idx) => {
        const total = dPlusSquaredTotal[idx] || 1;
        return (value / total) * 100;
      }),
      hovertemplate: `${criterion}: %{y:.6f} (%{customdata:.1f}% de d⁺²)<extra></extra>`,
    };
  });

  const simulatedBars = [
    {
      type: "bar",
      orientation: "h",
      x: [...simulated.ranking].reverse().map((item) => item.score),
      y: [...simulated.ranking].reverse().map((item) => `${item.rank}o - ${item.name}`),
      marker: {
        color: [...simulated.ranking].reverse().map((item) => rankColor(item.rank, simulated.ranking.length)),
      },
      hovertemplate: "%{y}<br>Score simulado: %{x:.3f}<extra></extra>",
    },
  ];

  const spatialSection = (() => {
    if (criteriaCount === 2) {
      const lineToPisX = metrics.flatMap((item) => [item.values[0], data.pis[0], null]);
      const lineToPisY = metrics.flatMap((item) => [item.values[1], data.pis[1], null]);
      const lineToNisX = metrics.flatMap((item) => [item.values[0], data.nis[0], null]);
      const lineToNisY = metrics.flatMap((item) => [item.values[1], data.nis[1], null]);

      return {
        title: "Visualização espacial do espaço de decisão",
        subtitle: "Plano 2D — cada ponto é uma alternativa, cada eixo é um critério.",
        data: [
          {
            type: "scatter",
            mode: "lines",
            name: "Ligação ao PIS",
            x: lineToPisX,
            y: lineToPisY,
            line: { color: PALETTE.dPlus, width: 1.8, dash: "dot" },
            hoverinfo: "skip",
          },
          {
            type: "scatter",
            mode: "lines",
            name: "Ligação ao NIS",
            x: lineToNisX,
            y: lineToNisY,
            line: { color: PALETTE.dMinus, width: 1.8, dash: "dot" },
            hoverinfo: "skip",
          },
          {
            type: "scatter",
            mode: "markers+text",
            name: "Alternativas",
            x: metrics.map((item) => item.values[0]),
            y: metrics.map((item) => item.values[1]),
            text: metrics.map((item) => `${item.rank}o`),
            textposition: "top center",
            marker: {
              color: metrics.map((item) => item.color),
              size: metrics.map((item) => item.size),
              line: { width: 1, color: "#0f172a" },
            },
            hovertext: metrics.map(baseHover),
            hoverinfo: "text",
          },
          {
            type: "scatter",
            mode: "markers+text",
            name: "PIS",
            x: [data.pis[0]],
            y: [data.pis[1]],
            text: ["★ PIS"],
            textposition: "top right",
            marker: { color: PALETTE.pis, size: 18, symbol: "star" },
            hovertemplate: "PIS<extra></extra>",
          },
          {
            type: "scatter",
            mode: "markers+text",
            name: "NIS",
            x: [data.nis[0]],
            y: [data.nis[1]],
            text: ["✕ NIS"],
            textposition: "bottom right",
            marker: { color: PALETTE.nis, size: 16, symbol: "x" },
            hovertemplate: "NIS<extra></extra>",
          },
        ],
        layout: {
          xaxis: { title: data.criteria_names[0] },
          yaxis: { title: data.criteria_names[1] },
        },
      };
    }

    if (criteriaCount === 3) {
      const lineToPisX = metrics.flatMap((item) => [item.values[0], data.pis[0], null]);
      const lineToPisY = metrics.flatMap((item) => [item.values[1], data.pis[1], null]);
      const lineToPisZ = metrics.flatMap((item) => [item.values[2], data.pis[2], null]);
      const lineToNisX = metrics.flatMap((item) => [item.values[0], data.nis[0], null]);
      const lineToNisY = metrics.flatMap((item) => [item.values[1], data.nis[1], null]);
      const lineToNisZ = metrics.flatMap((item) => [item.values[2], data.nis[2], null]);

      return {
        title: "Visualização espacial do espaço de decisão",
        subtitle: "Espaço 3D direto — os três eixos são os três critérios reais. Arraste para explorar ângulos diferentes.",
        data: [
          {
            type: "scatter3d",
            mode: "lines",
            name: "Ligação ao PIS",
            x: lineToPisX,
            y: lineToPisY,
            z: lineToPisZ,
            line: { color: PALETTE.dPlus, width: 3 },
            hoverinfo: "skip",
          },
          {
            type: "scatter3d",
            mode: "lines",
            name: "Ligação ao NIS",
            x: lineToNisX,
            y: lineToNisY,
            z: lineToNisZ,
            line: { color: PALETTE.dMinus, width: 3 },
            hoverinfo: "skip",
          },
          {
            type: "scatter3d",
            mode: "markers+text",
            name: "Alternativas",
            x: metrics.map((item) => item.values[0]),
            y: metrics.map((item) => item.values[1]),
            z: metrics.map((item) => item.values[2]),
            text: metrics.map((item) => `${item.rank}o`),
            marker: {
              color: metrics.map((item) => item.color),
              size: metrics.map((item) => item.size / 3.2),
              line: { width: 1, color: "#0f172a" },
            },
            hovertext: metrics.map(baseHover),
            hoverinfo: "text",
          },
          {
            type: "scatter3d",
            mode: "markers+text",
            name: "PIS",
            x: [data.pis[0]],
            y: [data.pis[1]],
            z: [data.pis[2]],
            text: ["★ PIS"],
            marker: { color: PALETTE.pis, size: 7, symbol: "diamond" },
            hovertemplate: "PIS<extra></extra>",
          },
          {
            type: "scatter3d",
            mode: "markers+text",
            name: "NIS",
            x: [data.nis[0]],
            y: [data.nis[1]],
            z: [data.nis[2]],
            text: ["✕ NIS"],
            marker: { color: PALETTE.nis, size: 7, symbol: "cross" },
            hovertemplate: "NIS<extra></extra>",
          },
        ],
        layout: {
          scene: {
            xaxis: { title: data.criteria_names[0] },
            yaxis: { title: data.criteria_names[1] },
            zaxis: { title: data.criteria_names[2] },
          },
        },
      };
    }

    if (criteriaCount <= 6) {
      const allPoints = [...metrics.map((item) => item.values), data.pis, data.nis];
      const { projected, explained } = projectPca3(allPoints);
      const pisProjection = projected[metrics.length];
      const nisProjection = projected[metrics.length + 1];
      const altProjections = projected.slice(0, metrics.length);
      const pcaMarkerColors = metrics.map((item) => item.color);

      const lineToPisX = altProjections.flatMap((point) => [point[0], pisProjection[0], null]);
      const lineToPisY = altProjections.flatMap((point) => [point[1], pisProjection[1], null]);
      const lineToPisZ = altProjections.flatMap((point) => [point[2], pisProjection[2], null]);
      const lineToNisX = altProjections.flatMap((point) => [point[0], nisProjection[0], null]);
      const lineToNisY = altProjections.flatMap((point) => [point[1], nisProjection[1], null]);
      const lineToNisZ = altProjections.flatMap((point) => [point[2], nisProjection[2], null]);

      return {
        title: "Visualização espacial do espaço de decisão",
        subtitle: `Projeção 3D por PCA — os critérios foram comprimidos em 3 eixos preservando o máximo de separação entre as alternativas. Variância explicada: ${explained.toFixed(2)}%`,
        data: [
          {
            type: "scatter3d",
            mode: "lines",
            name: "Ligação ao PIS",
            x: lineToPisX,
            y: lineToPisY,
            z: lineToPisZ,
            line: { color: PCA_CONTRAST_COLORS.toPis, width: 1.8, dash: "dot" },
            hoverinfo: "skip",
          },
          {
            type: "scatter3d",
            mode: "lines",
            name: "Ligação ao NIS",
            x: lineToNisX,
            y: lineToNisY,
            z: lineToNisZ,
            line: { color: PCA_CONTRAST_COLORS.toNis, width: 1.8, dash: "dot" },
            hoverinfo: "skip",
          },
          {
            type: "scatter3d",
            mode: "markers+text",
            name: "Alternativas",
            x: altProjections.map((point) => point[0]),
            y: altProjections.map((point) => point[1]),
            z: altProjections.map((point) => point[2]),
            text: metrics.map((item) => `${item.rank}o`),
            textposition: "top center",
            marker: {
              color: pcaMarkerColors,
              size: metrics.map((item) => item.size / 3.2),
              line: { width: 1, color: "#0f172a" },
            },
            hovertext: metrics.map(baseHover),
            hoverinfo: "text",
          },
          {
            type: "scatter3d",
            mode: "markers+text",
            name: "PIS",
            x: [pisProjection[0]],
            y: [pisProjection[1]],
            z: [pisProjection[2]],
            text: ["★ PIS"],
            marker: { color: PCA_CONTRAST_COLORS.pis, size: 7, symbol: "diamond" },
            hovertemplate: "PIS projetado em PCA<extra></extra>",
          },
          {
            type: "scatter3d",
            mode: "markers+text",
            name: "NIS",
            x: [nisProjection[0]],
            y: [nisProjection[1]],
            z: [nisProjection[2]],
            text: ["✕ NIS"],
            marker: { color: PCA_CONTRAST_COLORS.nis, size: 7, symbol: "cross" },
            hovertemplate: "NIS projetado em PCA<extra></extra>",
          },
        ],
        layout: {
          scene: {
            xaxis: { title: "PCA 1" },
            yaxis: { title: "PCA 2" },
            zaxis: { title: "PCA 3" },
            dragmode: "orbit",
            aspectmode: "cube",
          },
        },
      };
    }

    return {
        title: "Visualização espacial do espaço de decisão",
        subtitle: "Coordenadas paralelas — cada eixo vertical é um critério, cada linha é uma alternativa.",
      data: [
        {
          type: "parcoords",
          line: {
            color: metrics.map((item) => item.rank),
            colorscale: [
              [0, PALETTE.rankGradient[0]],
              [0.5, PALETTE.rankGradient[3]],
              [1, PALETTE.rankGradient[6]],
            ],
            cmin: 1,
            cmax: metrics.length,
            showscale: true,
            colorbar: { title: "Rank" },
          },
          dimensions: data.criteria_names.map((name, col) => ({
            label: name,
            values: metrics.map((item) => item.values[col]),
          })),
        },
      ],
      layout: {},
    };
  })();

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── NAV ── */}
      <nav className="bg-[#231F20] px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#DB1E2F] rounded-md flex items-center justify-center text-white font-black text-sm">
            T
          </div>
          <div>
            <span className="text-white font-bold text-sm tracking-wide">TOPSIS Web</span>
            <span className="text-gray-500 text-xs block leading-none mt-0.5">Sistema de Informações · Cin-UFPE</span>
          </div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/decision"
            className="text-gray-400 hover:text-white text-sm px-4 py-2 rounded-md hover:bg-white/5 transition"
          >
            ← Refazer decisão
          </Link>
          <button
            onClick={handleExport}
            className="bg-[#DB1E2F] hover:bg-[#AF0421] text-white text-xs font-bold px-4 py-2 rounded-lg transition"
          >
            Exportar CSV
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-[#231F20] px-4 sm:px-6 lg:px-10 pt-10 sm:pt-12 pb-12 sm:pb-14 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#DB1E2F] via-[#DB1E2F]/30 to-transparent" />
        <div className="max-w-5xl">
          <p className="text-[#DB1E2F] text-xs font-bold uppercase tracking-[3px] mb-3">
            Resultado
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Ranking TOPSIS
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
            Ranking calculado pelo método TOPSIS clássico (distância Euclidiana, p=2).
            Maior coeficiente de proximidade = melhor alternativa.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 flex flex-col gap-6">

        {/* ── VENCEDOR ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#DB1E2F] to-[#AF0421] px-8 py-6 flex items-center justify-between">
            <div>
              <p className="text-red-200 text-xs font-bold uppercase tracking-[2px] mb-1">
                Vencedor
              </p>
               <p className="text-white text-2xl sm:text-3xl font-black">
                🏆 {winner?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-red-200 text-xs font-bold uppercase tracking-[2px] mb-1">
                Coeficiente
              </p>
               <p className="text-white text-2xl sm:text-3xl font-black">
                {winner?.score.toFixed(4)}
              </p>
              {winnerMargin !== null && (
                <p className="text-white/70 text-sm font-semibold mt-1">
                  Margem sobre 2º lugar: +{winnerMargin.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── RANKING COMPLETO ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-5">
            <h2 className="text-sm font-extrabold text-[#231F20]">Ranking completo</h2>
            <ResultExplanation title="Ranking Final">
              <p>
                Mostra a classificação final das alternativas após a aplicação do método TOPSIS. Quanto maior o
                coeficiente de proximidade, melhor a alternativa atende ao conjunto de critérios e pesos definidos.
              </p>
              <p className="mt-2">
                A alternativa em primeiro lugar apresenta a melhor combinação de desempenho considerando todos os
                critérios informados.
              </p>
            </ResultExplanation>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["#", "Alternativa", "CCi", "d⁺", "d⁻"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((item) => (
                  <tr
                    key={item.name}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition ${
                      item.rank === 1 ? "bg-red-50/50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                          item.rank === 1
                            ? "bg-[#DB1E2F] text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.rank}o
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#231F20]">{item.name}</td>
                    <td className="px-4 py-3 font-mono text-[#231F20]">
                      {item.score.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500">
                      {item.dPlus.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500">
                      {item.dMinus.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── DISTANCIAS AO IDEAL ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#231F20] mb-1">Distâncias ao Ideal</h2>
              <p className="text-xs text-gray-600 mb-4">Comparação direta entre d⁺ (PIS) e d⁻ (NIS) por alternativa.</p>
            </div>
            <div className="flex items-center gap-2">
              <ResultExplanation title="Distâncias ao Ideal">
                <p>
                  d⁺ é a distância Euclidiana de cada alternativa até a Solução Ideal Positiva (PIS), o vetor com os
                  melhores valores por critério. d⁻ é a distância até a Solução Ideal Negativa (NIS), o cenário com os
                  piores valores.
                </p>
                <p className="mt-2">Uma alternativa desejável combina d⁺ pequeno e d⁻ grande.</p>
              </ResultExplanation>
              <button
                onClick={() => setShowDistances((state) => !state)}
                className="text-xs font-semibold px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                aria-label={showDistances ? "Minimizar distâncias ao ideal" : "Expandir distâncias ao ideal"}
              >
                {showDistances ? "↓" : "↑"}
              </button>
            </div>
          </div>
          {showDistances && <div style={{ height: `${distanceChartHeight}px` }}>
            <Plot
              data={distPlotData}
              layout={{
                ...BASE_LAYOUT,
                barmode: "group",
                margin: { l: 40, r: 20, t: 20, b: 70 },
                legend: { orientation: "h", x: 0, y: -0.22 },
                xaxis: { ...(BASE_LAYOUT.xaxis ?? {}), tickangle: -25 },
                yaxis: {
                  ...(BASE_LAYOUT.yaxis ?? {}),
                  title: "Distância Euclidiana",
                  tickformat: ".3f",
                  range: [0, distanceYAxisMax],
                  tickmode: "linear",
                  dtick: distanceDtick,
                },
                clickmode: "event+select",
              }}
              config={BASE_CONFIG}
              style={{ width: "100%", height: "100%" }}
            />
          </div>}
        </div>

        {/* ── SCORE DE PROXIMIDADE ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#231F20] mb-1">Score de Proximidade</h2>
              <p className="text-xs text-gray-600 mb-4">Score = d⁻ / (d⁺ + d⁻), ordenado pelo ranking final.</p>
            </div>
            <div className="flex items-center gap-2">
              <ResultExplanation title="Score de Proximidade">
                <p>
                  O score C = d⁻ / (d⁺ + d⁻) resume as distâncias em um valor entre 0 e 1. Quanto mais perto de 1,
                  mais próxima a alternativa está do ideal positivo.
                </p>
                <p className="mt-2">
                  O ranking TOPSIS é a ordenação decrescente deste score. O limiar 0.5 separa alternativas mais próximas
                  do PIS das mais próximas do NIS.
                </p>
              </ResultExplanation>
              <button
                onClick={() => setShowScores((state) => !state)}
                className="text-xs font-semibold px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                aria-label={showScores ? "Minimizar score de proximidade" : "Expandir score de proximidade"}
              >
                {showScores ? "↓" : "↑"}
              </button>
            </div>
          </div>
          {showScores && <div className="mt-3" style={{ height: `${scoreChartHeight}px` }}>
            <Plot
              data={scorePlotData}
              layout={{
                ...BASE_LAYOUT,
                margin: { l: 130, r: 24, t: 20, b: 40 },
                xaxis: { ...(BASE_LAYOUT.xaxis ?? {}), title: "Score de proximidade", range: [0, 1], tickformat: ".2f" },
                shapes: [
                  {
                    type: "line",
                    x0: 0.5,
                    x1: 0.5,
                    y0: 0,
                    y1: 1,
                    xref: "x",
                    yref: "paper",
                    line: { color: "#94A3B8", width: 1.5, dash: "dash" },
                  },
                ],
                annotations: [
                  {
                    x: 0.5,
                    y: 1.04,
                    xref: "x",
                    yref: "paper",
                    text: "limiar 0.5",
                    showarrow: false,
                    font: { size: 11, color: PALETTE.axisText },
                  },
                ],
              }}
              config={BASE_CONFIG}
              style={{ width: "100%", height: "100%" }}
            />
          </div>}
        </div>

        {/* ── CONTRIBUICAO POR CRITERIO ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#231F20] mb-1">Contribuição por Critério</h2>
              <p className="text-xs text-gray-600 mb-4">Heatmap da matriz ponderada e decomposição da contribuição para d⁺².</p>
            </div>
            <div className="flex items-center gap-2">
              <ResultExplanation title="Contribuição por Critério">
                <p>
                  Esta seção mostra, por critério, como cada alternativa se comporta no espaço ponderado e quanto cada
                  critério contribui para a distância ao ideal positivo.
                </p>
              </ResultExplanation>
              <button
                onClick={() => setShowContribution((state) => !state)}
                className="text-xs font-semibold px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                aria-label={showContribution ? "Minimizar contribuição por critério" : "Expandir contribuição por critério"}
              >
                {showContribution ? "↓" : "↑"}
              </button>
            </div>
          </div>
          {showContribution && <>
          <div className="flex flex-wrap gap-2 mb-3">
            {criteriaForContribution.map((col, idx) => (
              <span
                key={`criterion-chip-${data.criteria_names[col]}`}
                className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-300 px-2 py-1 text-[11px] text-slate-700"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: PALETTE.criteria[idx % PALETTE.criteria.length] }}
                />
                {data.criteria_names[col]}
              </span>
            ))}
          </div>

          <div className="flex items-start justify-between gap-3 mb-1">
            <p className="text-sm font-semibold text-[#231F20]">Heatmap da matriz ponderada</p>
            <ResultExplanation title="Heatmap da Matriz Ponderada">
              <p>
                Cada célula representa o valor de uma alternativa em um critério após normalização e ponderação.
                Tons mais escuros indicam valores mais altos.
              </p>
              <p className="mt-2">
                Use esta visão para identificar rapidamente critérios em que cada alternativa se destaca ou perde.
              </p>
            </ResultExplanation>
          </div>

          <div className="mt-3 mb-8" style={{ height: `${heatmapHeight}px` }}>
            <Plot
              data={[
                {
                  type: "heatmap",
                  x: criteriaForContribution.map((col) => data.criteria_names[col]),
                  y: metrics.map((item) => item.name),
                  z: heatmapZ,
                  zmin: 0,
                  colorscale: heatColorscale,
                  customdata: heatmapCustom,
                  hovertemplate: "%{y} × %{x}: %{z:.3f}<br>%{customdata}<extra></extra>",
                },
              ]}
              layout={{
                ...BASE_LAYOUT,
                margin: { l: 110, r: 30, t: 20, b: 60 },
                xaxis: { ...(BASE_LAYOUT.xaxis ?? {}), side: "top" },
                yaxis: { ...(BASE_LAYOUT.yaxis ?? {}), autorange: "reversed" },
                annotations: heatmapAnnotations,
                shapes: winnerSeparator,
              }}
              config={BASE_CONFIG}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className="flex items-start justify-between gap-3 mb-1">
            <p className="text-sm font-semibold text-[#231F20]">Decomposição da distância por critério</p>
            <ResultExplanation title="Decomposição de d+ por Critério">
              <p>
                Cada segmento empilhado mostra a contribuição quadrática de um critério para d⁺² da alternativa.
              </p>
              <p className="mt-2">
                Segmentos maiores indicam critérios que mais afastam a alternativa do ideal positivo.
              </p>
            </ResultExplanation>
          </div>

          <div className="h-[300px] mt-3">
            <Plot
              data={contributionTraces}
              layout={{
                ...BASE_LAYOUT,
                barmode: "stack",
                margin: { l: 70, r: 130, t: 20, b: 70 },
                yaxis: { ...(BASE_LAYOUT.yaxis ?? {}), title: "Contribuição quadrática para d⁺² por critério" },
                legend: { orientation: "v", x: 1.02, y: 1, xanchor: "left" },
              }}
              config={BASE_CONFIG}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          </>}
        </div>

        {/* ── VISUALIZAÇÃO ESPACIAL ADAPTATIVA ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#231F20] mb-1">{spatialSection.title}</h2>
              <p className="text-xs text-gray-600 mb-4">{spatialSection.subtitle}.</p>
            </div>
            <div className="flex items-center gap-2">
              <ResultExplanation title="Visualização Espacial">
                <p>
                  Esta visualização se adapta automaticamente à quantidade de critérios do seu problema.
                </p>
                <p className="mt-2">
                  Com 2 critérios, os pontos aparecem num plano 2D — simples e direto.
                </p>
                <p className="mt-2">
                  Com 3 critérios, o espaço é tridimensional real: cada eixo é um critério. Arraste para rotacionar e explorar ângulos diferentes.
                </p>
                <p className="mt-2">
                  Entre 4 e 6 critérios, os dados são comprimidos em 3 dimensões pela PCA — uma técnica que reorganiza os eixos para preservar o máximo de separação entre as alternativas. A porcentagem exibida indica o quanto da informação original foi mantida na projeção.
                </p>
                <p className="mt-2">
                  Com 7 ou mais critérios, cada critério vira um eixo vertical e cada alternativa vira uma linha — esse formato é o único que consegue mostrar muitas dimensões sem perder legibilidade.
                </p>
                <p className="mt-2">
                  Em todos os casos, as linhas azuis mostram a distância ao cenário ideal (PIS) e as linhas laranjas mostram a distância ao pior cenário (NIS). Alternativas com linhas azuis curtas e laranjas longas são as melhores posicionadas no ranking.
                </p>
              </ResultExplanation>
              <button
                onClick={() => setShowSpatial((state) => !state)}
                className="text-xs font-semibold px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                aria-label={showSpatial ? "Minimizar visualização espacial" : "Expandir visualização espacial"}
              >
                {showSpatial ? "↓" : "↑"}
              </button>
            </div>
          </div>
          {showSpatial && <div style={{ height: `${spatialChartHeight}px` }}>
            <Plot
              data={spatialSection.data}
              layout={{
                ...BASE_LAYOUT,
                margin: { l: 55, r: 20, t: 20, b: 45 },
                showlegend: true,
                legend: { orientation: "v", x: 1.02, y: 1, xanchor: "left" },
                ...spatialSection.layout,
              }}
              config={{ ...BASE_CONFIG, scrollZoom: true }}
              style={{ width: "100%", height: "100%" }}
            />
          </div>}
        </div>

        {/* ── ANÁLISE DE SENSIBILIDADE DE PESOS ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#231F20] mb-1">Análise de Sensibilidade de Pesos</h2>
              <p className="text-xs text-gray-600">Ajuste os pesos e acompanhe o ranking simulado em tempo real.</p>
            </div>
            <div className="flex items-center gap-2">
              <ResultExplanation title="Análise de Sensibilidade">
                <p>
                  O ranking TOPSIS depende dos pesos. Aqui você testa cenários &quot;e se&quot; ajustando pesos e recalculando
                  localmente sem chamar a API.
                </p>
                <p className="mt-2">
                  Se houver inversão de ranking, a decisão é sensível e merece revisão de pesos.
                </p>
              </ResultExplanation>
              <button
                onClick={() => setShowSensitivity((state) => !state)}
                className="text-xs font-semibold px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                aria-label={showSensitivity ? "Minimizar análise de sensibilidade" : "Expandir análise de sensibilidade"}
              >
                {showSensitivity ? "↓" : "↑"}
              </button>
              <button
                onClick={() => setEditedWeights(null)}
                className="text-xs font-bold px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition"
              >
                Resetar pesos originais
              </button>
            </div>
          </div>
          {showSensitivity && <>

          <div className="grid gap-3 mb-6">
            {data.criteria_names.map((name, idx) => (
              <div key={name} className="grid grid-cols-[minmax(130px,1fr)_3fr_auto] items-center gap-3">
                <label className="text-xs font-semibold text-gray-600">{name}</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={activeWeights[idx] ?? 0}
                  onChange={(event) => handleWeightChange(idx, Number(event.target.value))}
                />
                <span className="text-xs font-mono text-[#231F20] w-12 text-right">
                  {(activeWeights[idx] ?? 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">Ranking simulado</h3>
                <ResultExplanation title="Ranking Simulado">
                  <p>
                    Mostra a nova ordem das alternativas para os pesos ajustados, incluindo variação de score em
                    relação ao cenário original.
                  </p>
                </ResultExplanation>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wider text-gray-600">
                      <th className="py-2">#</th>
                      <th className="py-2">Alternativa</th>
                      <th className="py-2">Score</th>
                      <th className="py-2">Δscore</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulated.ranking.map((item) => (
                      <tr key={item.name} className="border-b border-gray-50">
                        <td className="py-2 font-semibold">{item.rank}o</td>
                        <td className="py-2 font-semibold text-[#231F20]">{item.name}</td>
                        <td className="py-2 font-mono">{item.score.toFixed(3)}</td>
                        <td className={`py-2 font-mono ${item.delta >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                          {item.delta >= 0 ? "+" : ""}
                          {item.delta.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className={`mt-4 text-xs font-semibold ${simulated.changed ? "text-amber-700" : "text-emerald-700"}`}>
                {simulated.changed
                  ? simulated.inversionMessage
                  : "✓ Ranking estável nesta configuração de pesos."}
              </p>
            </div>

            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">Score simulado</h3>
                <ResultExplanation title="Score Simulado">
                  <p>
                    Exibe visualmente os novos coeficientes de proximidade após ajustes de peso para facilitar comparação
                    rápida entre alternativas.
                  </p>
                </ResultExplanation>
              </div>
              <div className="h-[220px]">
                <Plot
                  data={simulatedBars}
                  layout={{
                    ...BASE_LAYOUT,
                    margin: { l: 110, r: 20, t: 10, b: 30 },
                    xaxis: { ...(BASE_LAYOUT.xaxis ?? {}), range: [0, 1], title: "Score", tickformat: ".2f" },
                  }}
                  config={BASE_CONFIG}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
          </>}
        </div>

        {/* ── MATRIZES ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-7 py-5 flex items-center justify-between border-b border-gray-100">
            <h2 className="text-sm font-extrabold text-[#231F20]">Ver matrizes intermediárias (PIS, NIS, normalizada, ponderada)</h2>
            <button
              onClick={() => setShowMatrices((state) => !state)}
              className="text-xs font-semibold px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
              aria-label={showMatrices ? "Minimizar matrizes intermediárias" : "Expandir matrizes intermediárias"}
            >
              {showMatrices ? "↓" : "↑"}
            </button>
          </div>
          {showMatrices && <div className="px-7 pb-7 pt-4 grid gap-6">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px]">
                  Matriz Normalizada
                </p>
                <ResultExplanation title="Matriz Normalizada">
                  <p>
                    Mostra os valores dos critérios após normalização, removendo diferenças de escala entre unidades.
                  </p>
                  <p className="mt-2">Isso permite comparar critérios originalmente medidos em escalas diferentes.</p>
                </ResultExplanation>
              </div>
              <div className="overflow-auto max-h-80 border border-gray-100 rounded-lg">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-500 font-bold">Alternativa</th>
                      {data.criteria_names.map((criterion) => (
                        <th key={criterion} className="px-3 py-2 text-left text-gray-500 font-bold">
                          {criterion}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.alternative_names.map((name, row) => (
                      <tr key={`norm-${name}`} className="border-t border-gray-50">
                        <td className="px-3 py-2 font-semibold text-[#231F20]">{name}</td>
                        {(data.normalized_matrix[row] ?? []).map((value, col) => (
                          <td key={`${name}-${data.criteria_names[col]}`} className="px-3 py-2 font-mono text-gray-600">
                            {value.toFixed(6)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px]">
                  Matriz Ponderada
                </p>
                <ResultExplanation title="Matriz Ponderada">
                  <p>
                    Apresenta a matriz normalizada após aplicação dos pesos definidos pelo usuário.
                  </p>
                  <p className="mt-2">Critérios com maior peso exercem maior influência no resultado final.</p>
                </ResultExplanation>
              </div>
              <div className="overflow-auto max-h-80 border border-gray-100 rounded-lg">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-500 font-bold">Alternativa</th>
                      {data.criteria_names.map((criterion) => (
                        <th key={`weight-${criterion}`} className="px-3 py-2 text-left text-gray-500 font-bold">
                          {criterion}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.alternative_names.map((name, row) => (
                      <tr key={`weighted-${name}`} className="border-t border-gray-50">
                        <td className="px-3 py-2 font-semibold text-[#231F20]">{name}</td>
                        {(data.weighted_matrix[row] ?? []).map((value, col) => (
                          <td key={`weighted-${name}-${data.criteria_names[col]}`} className="px-3 py-2 font-mono text-gray-600">
                            {value.toFixed(6)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-t border-gray-200 bg-gray-100">
                      <td className="px-3 py-2 font-bold text-[#231F20]">PIS</td>
                      {data.pis.map((value, col) => (
                        <td key={`pis-${data.criteria_names[col]}`} className="px-3 py-2 font-mono font-semibold text-blue-700">
                          {value.toFixed(6)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-200 bg-gray-100">
                      <td className="px-3 py-2 font-bold text-[#231F20]">NIS</td>
                      {data.nis.map((value, col) => (
                        <td key={`nis-${data.criteria_names[col]}`} className="px-3 py-2 font-mono font-semibold text-orange-700">
                          {value.toFixed(6)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px]">
                    Solução Ideal Positiva (PIS)
                  </p>
                  <ResultExplanation title="PIS">
                    <p>
                      A PIS é composta pelos melhores valores por critério e funciona como referência de excelência.
                    </p>
                    <p className="mt-2">Quanto mais próxima a alternativa da PIS, mais desejável ela tende a ser.</p>
                  </ResultExplanation>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  {data.criteria_names.map((criterion, idx) => (
                    <div key={`pis-list-${criterion}`} className="flex justify-between text-xs">
                      <span className="text-gray-500">{criterion}</span>
                      <span className="font-mono text-[#231F20] font-semibold">{data.pis[idx].toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px]">
                    Solução Ideal Negativa (NIS)
                  </p>
                  <ResultExplanation title="NIS">
                    <p>
                      A NIS representa o pior cenário por critério e serve como referência do desempenho indesejável.
                    </p>
                    <p className="mt-2">Quanto mais distante da NIS, melhor tende a ser a alternativa.</p>
                  </ResultExplanation>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  {data.criteria_names.map((criterion, idx) => (
                    <div key={`nis-list-${criterion}`} className="flex justify-between text-xs">
                      <span className="text-gray-500">{criterion}</span>
                      <span className="font-mono text-[#231F20] font-semibold">{data.nis[idx].toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px]">
                    Componentes de d+ (delta_plus)
                  </p>
                  <ResultExplanation title="Componentes de d+">
                    <p>
                      Cada célula mostra a contribuição quadrática por critério para a distância ao ideal positivo.
                    </p>
                    <p className="mt-2">A soma das contribuições, após raiz quadrada, resulta em d⁺.</p>
                  </ResultExplanation>
                </div>
                <div className="overflow-auto border border-gray-100 rounded-lg max-h-72">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-gray-500 font-bold">Alternativa</th>
                        {data.criteria_names.map((criterion) => (
                          <th key={`dp-${criterion}`} className="px-3 py-2 text-left text-gray-500 font-bold">{criterion}</th>
                        ))}
                        <th className="px-3 py-2 text-left text-gray-500 font-bold">d+</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.map((item) => {
                        const deltas = item.values.map((value, col) => (value - (data.pis[col] ?? 0)) ** 2);
                        const dPlus = Math.sqrt(deltas.reduce((sum, value) => sum + value, 0));
                        return (
                          <tr key={`dp-row-${item.name}`} className="border-t border-gray-50">
                            <td className="px-3 py-2 font-semibold text-[#231F20]">{item.name}</td>
                            {deltas.map((value, col) => (
                              <td key={`dp-cell-${item.name}-${data.criteria_names[col]}`} className="px-3 py-2 font-mono text-gray-600">
                                {value.toFixed(6)}
                              </td>
                            ))}
                            <td className="px-3 py-2 font-mono font-semibold text-blue-700">{dPlus.toFixed(6)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px]">
                    Componentes de d- (delta_minus)
                  </p>
                  <ResultExplanation title="Componentes de d-">
                    <p>
                      Cada célula mostra a contribuição quadrática por critério para a distância ao ideal negativo.
                    </p>
                    <p className="mt-2">A soma das contribuições, após raiz quadrada, resulta em d⁻.</p>
                  </ResultExplanation>
                </div>
                <div className="overflow-auto border border-gray-100 rounded-lg max-h-72">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-gray-500 font-bold">Alternativa</th>
                        {data.criteria_names.map((criterion) => (
                          <th key={`dm-${criterion}`} className="px-3 py-2 text-left text-gray-500 font-bold">{criterion}</th>
                        ))}
                        <th className="px-3 py-2 text-left text-gray-500 font-bold">d-</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.map((item) => {
                        const deltas = item.values.map((value, col) => (value - (data.nis[col] ?? 0)) ** 2);
                        const dMinus = Math.sqrt(deltas.reduce((sum, value) => sum + value, 0));
                        return (
                          <tr key={`dm-row-${item.name}`} className="border-t border-gray-50">
                            <td className="px-3 py-2 font-semibold text-[#231F20]">{item.name}</td>
                            {deltas.map((value, col) => (
                              <td key={`dm-cell-${item.name}-${data.criteria_names[col]}`} className="px-3 py-2 font-mono text-gray-600">
                                {value.toFixed(6)}
                              </td>
                            ))}
                            <td className="px-3 py-2 font-mono font-semibold text-emerald-700">{dMinus.toFixed(6)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>}
        </div>

      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-[#111] px-10 py-8 flex justify-between items-center border-t border-white/5">
        <p className="text-gray-600 text-xs">© 2026 TOPSIS Web | Projeto SAD</p>
        <div className="flex items-center gap-2 text-gray-600 text-xs">
          <span className="w-2 h-2 bg-[#DB1E2F] rounded-full" />
          Centro de Informática · UFPE
        </div>
      </footer>

    </main>
  );
}
