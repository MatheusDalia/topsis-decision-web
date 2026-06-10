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

function normalizeWeights(weights: number[]): number[] {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0) {
    if (!weights.length) return [];
    return Array.from({ length: weights.length }, () => 1 / weights.length);
  }
  return weights.map((weight) => weight / total);
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
  if (total <= 1) return "hsl(140, 72%, 35%)";
  const t = (rank - 1) / (total - 1);
  const hue = 120 * (1 - t);
  return `hsl(${hue}, 72%, 38%)`;
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

export default function ResultPage() {
  const data = useSessionStorageJson<TopsisResponse>("topsis:result");
  const request = useSessionStorageJson<TopsisRequest>("topsis:request");
  const [editedWeights, setEditedWeights] = useState<number[] | null>(null);

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
      inversionMessage = `⚠ Inversao de ranking detectada: ${superior} supera ${surpassed} nesta configuracao`;
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

  const barConfig = { responsive: true, displayModeBar: false };

  const distPlotData = [
    {
      type: "bar",
      name: "d+ (distancia ao PIS)",
      x: metrics.map((item) => item.name),
      y: metrics.map((item) => item.dPlus),
      marker: { color: "#D85A30" },
    },
    {
      type: "bar",
      name: "d- (distancia ao NIS)",
      x: metrics.map((item) => item.name),
      y: metrics.map((item) => item.dMinus),
      marker: { color: "#1D9E75" },
    },
  ];

  const scorePlotData = [
    {
      type: "bar",
      orientation: "h",
      x: [...metrics].reverse().map((item) => item.score),
      y: [...metrics].reverse().map((item) => `${item.rank}o - ${item.name}`),
      marker: { color: [...metrics].reverse().map((item) => item.color) },
      hovertemplate: "%{y}<br>Score: %{x:.4f}<extra></extra>",
    },
  ];

  const baseHover = (item: AlternativeMetric) =>
    `${item.name}<br>Rank: ${item.rank}o<br>d+: ${item.dPlus.toFixed(4)}<br>d-: ${item.dMinus.toFixed(4)}<br>Score: ${item.score.toFixed(4)}<br>Ponderados: [${item.values.map((value) => value.toFixed(3)).join(", ")}]`;

  const heatmapZ = metrics.map((item) => item.values);
  const heatmapCustom = metrics.map((item) =>
    item.values.map((value, col) => {
      const toPis = Math.abs(value - (data.pis[col] ?? 0));
      const toNis = Math.abs(value - (data.nis[col] ?? 0));
      return toPis <= toNis ? "mais proximo do PIS" : "mais proximo do NIS";
    }),
  );
  const heatmapAnnotations = metrics.flatMap((item) =>
    item.values.map((value, col) => ({
      x: data.criteria_names[col],
      y: item.name,
      text: value.toFixed(4),
      showarrow: false,
      font: { size: 11, color: "#0f172a" },
    })),
  );
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
            line: { color: "#475569", width: 2, dash: "dash" },
          },
        ]
      : [];

  const dPlusSquaredTotal = metrics.map((item) =>
    item.values.reduce((sum, value, col) => sum + (value - (data.pis[col] ?? 0)) ** 2, 0),
  );
  const contributionTraces = data.criteria_names.map((criterion, col) => {
    const values = metrics.map((item) => (item.values[col] - (data.pis[col] ?? 0)) ** 2);
    return {
      type: "bar",
      name: criterion,
      x: metrics.map((item) => item.name),
      y: values,
      customdata: values.map((value, idx) => {
        const total = dPlusSquaredTotal[idx] || 1;
        return (value / total) * 100;
      }),
      hovertemplate: `${criterion}: %{y:.6f} (%{customdata:.1f}% de d+²)<extra></extra>`,
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
      hovertemplate: "%{y}<br>Score simulado: %{x:.4f}<extra></extra>",
    },
  ];

  const spatialSection = (() => {
    if (criteriaCount === 2) {
      const lineToPisX = metrics.flatMap((item) => [item.values[0], data.pis[0], null]);
      const lineToPisY = metrics.flatMap((item) => [item.values[1], data.pis[1], null]);
      const lineToNisX = metrics.flatMap((item) => [item.values[0], data.nis[0], null]);
      const lineToNisY = metrics.flatMap((item) => [item.values[1], data.nis[1], null]);

      return {
        title: "Visualizacao Espacial 2D",
        subtitle: "2 criterios detectados: scatter 2D com PIS/NIS e linhas de distancia",
        data: [
          {
            type: "scatter",
            mode: "lines",
            name: "Ligacao ao PIS",
            x: lineToPisX,
            y: lineToPisY,
            line: { color: "#378ADD", width: 1.8, dash: "dot" },
            hoverinfo: "skip",
          },
          {
            type: "scatter",
            mode: "lines",
            name: "Ligacao ao NIS",
            x: lineToNisX,
            y: lineToNisY,
            line: { color: "#D85A30", width: 1.8, dash: "dot" },
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
            marker: { color: "#378ADD", size: 18, symbol: "star" },
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
            marker: { color: "#D85A30", size: 16, symbol: "x" },
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
        title: "Visualizacao Espacial 3D",
        subtitle: "3 criterios detectados: scatter 3D interativo com PIS/NIS",
        data: [
          {
            type: "scatter3d",
            mode: "lines",
            name: "Ligacao ao PIS",
            x: lineToPisX,
            y: lineToPisY,
            z: lineToPisZ,
            line: { color: "#378ADD", width: 3 },
            hoverinfo: "skip",
          },
          {
            type: "scatter3d",
            mode: "lines",
            name: "Ligacao ao NIS",
            x: lineToNisX,
            y: lineToNisY,
            z: lineToNisZ,
            line: { color: "#D85A30", width: 3 },
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
            marker: { color: "#378ADD", size: 7, symbol: "diamond" },
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
            marker: { color: "#D85A30", size: 7, symbol: "cross" },
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
      const { projected, explained } = projectPca2(allPoints);
      const pisProjection = projected[metrics.length];
      const nisProjection = projected[metrics.length + 1];
      const altProjections = projected.slice(0, metrics.length);

      const lineToPisX = altProjections.flatMap((point) => [point[0], pisProjection[0], null]);
      const lineToPisY = altProjections.flatMap((point) => [point[1], pisProjection[1], null]);
      const lineToNisX = altProjections.flatMap((point) => [point[0], nisProjection[0], null]);
      const lineToNisY = altProjections.flatMap((point) => [point[1], nisProjection[1], null]);

      return {
        title: "Visualizacao Espacial PCA",
        subtitle: `4-6 criterios detectados: PCA em 2D (variancia explicada: ${explained.toFixed(2)}%)`,
        data: [
          {
            type: "scatter",
            mode: "lines",
            name: "Ligacao ao PIS",
            x: lineToPisX,
            y: lineToPisY,
            line: { color: "#378ADD", width: 1.8, dash: "dot" },
            hoverinfo: "skip",
          },
          {
            type: "scatter",
            mode: "lines",
            name: "Ligacao ao NIS",
            x: lineToNisX,
            y: lineToNisY,
            line: { color: "#D85A30", width: 1.8, dash: "dot" },
            hoverinfo: "skip",
          },
          {
            type: "scatter",
            mode: "markers+text",
            name: "Alternativas",
            x: altProjections.map((point) => point[0]),
            y: altProjections.map((point) => point[1]),
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
            x: [pisProjection[0]],
            y: [pisProjection[1]],
            text: ["★ PIS"],
            textposition: "top right",
            marker: { color: "#378ADD", size: 18, symbol: "star" },
            hovertemplate: "PIS projetado em PCA<extra></extra>",
          },
          {
            type: "scatter",
            mode: "markers+text",
            name: "NIS",
            x: [nisProjection[0]],
            y: [nisProjection[1]],
            text: ["✕ NIS"],
            textposition: "bottom right",
            marker: { color: "#D85A30", size: 16, symbol: "x" },
            hovertemplate: "NIS projetado em PCA<extra></extra>",
          },
        ],
        layout: {
          xaxis: { title: "PCA 1" },
          yaxis: { title: "PCA 2" },
        },
      };
    }

    return {
      title: "Visualizacao Espacial em Coordenadas Paralelas",
      subtitle: "7+ criterios detectados: parallel coordinates para alta dimensionalidade",
      data: [
        {
          type: "parcoords",
          line: {
            color: metrics.map((item) => item.rank),
            colorscale: [
              [0, "#14532d"],
              [0.5, "#facc15"],
              [1, "#b91c1c"],
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
      <nav className="bg-[#231F20] px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#DB1E2F] rounded-md flex items-center justify-center text-white font-black text-sm">
            T
          </div>
          <div>
            <span className="text-white font-bold text-sm tracking-wide">TOPSIS Web</span>
            <span className="text-gray-500 text-xs block leading-none mt-0.5">Sistema de Informações · Cin-UFPE</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
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
      <section className="bg-[#231F20] px-10 pt-12 pb-14 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#DB1E2F] via-[#DB1E2F]/30 to-transparent" />
        <div className="max-w-5xl">
          <p className="text-[#DB1E2F] text-xs font-bold uppercase tracking-[3px] mb-3">
            Resultado
          </p>
          <h1 className="text-4xl font-black text-white mb-2">
            Ranking TOPSIS
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
            Ranking calculado pelo método TOPSIS clássico (distância Euclidiana, p=2).
            Maior coeficiente de proximidade = melhor alternativa.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-10 py-10 flex flex-col gap-6">

        {/* ── VENCEDOR ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#DB1E2F] to-[#AF0421] px-8 py-6 flex items-center justify-between">
            <div>
              <p className="text-red-200 text-xs font-bold uppercase tracking-[2px] mb-1">
                Vencedor
              </p>
              <p className="text-white text-3xl font-black">
                🏆 {winner?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-red-200 text-xs font-bold uppercase tracking-[2px] mb-1">
                Coeficiente
              </p>
              <p className="text-white text-3xl font-black">
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
          <h2 className="text-sm font-extrabold text-[#231F20] mb-5">
            Ranking completo
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["#", "Alternativa", "CCi", "d⁺", "d⁻"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider"
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
                      {item.score.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500">
                      {item.dPlus.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500">
                      {item.dMinus.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── DISTANCIAS AO IDEAL ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <h2 className="text-sm font-extrabold text-[#231F20] mb-1">Distancias ao Ideal</h2>
          <p className="text-xs text-gray-400 mb-4">Comparacao direta entre d+ (PIS) e d- (NIS) por alternativa</p>
          <div className="h-[360px]">
            <Plot
              data={distPlotData}
              layout={{
                barmode: "group",
                margin: { l: 40, r: 20, t: 20, b: 70 },
                paper_bgcolor: "#ffffff",
                plot_bgcolor: "#ffffff",
                legend: { orientation: "h", x: 0, y: 1.15 },
                xaxis: { tickangle: -25 },
                yaxis: { title: "Distancia Euclidiana" },
              }}
              config={barConfig}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* ── SCORE DE PROXIMIDADE ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <h2 className="text-sm font-extrabold text-[#231F20] mb-1">Score de Proximidade</h2>
          <p className="text-xs text-gray-400 mb-4">Score = d- / (d+ + d-), ordenado pelo ranking final</p>
          <div className="h-[360px]">
            <Plot
              data={scorePlotData}
              layout={{
                margin: { l: 110, r: 20, t: 20, b: 40 },
                paper_bgcolor: "#ffffff",
                plot_bgcolor: "#ffffff",
                xaxis: { title: "Score de proximidade", range: [0, 1] },
              }}
              config={barConfig}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* ── CONTRIBUICAO POR CRITERIO ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <h2 className="text-sm font-extrabold text-[#231F20] mb-1">Contribuicao por Criterio</h2>
          <p className="text-xs text-gray-400 mb-4">Heatmap da matriz ponderada e decomposicao de contribuicao para d+²</p>

          <div className="h-[420px] mb-8">
            <Plot
              data={[
                {
                  type: "heatmap",
                  x: data.criteria_names,
                  y: metrics.map((item) => item.name),
                  z: heatmapZ,
                  colorscale: "RdYlGn",
                  customdata: heatmapCustom,
                  hovertemplate: "%{y} × %{x}: %{z:.4f}<br>%{customdata}<extra></extra>",
                },
              ]}
              layout={{
                margin: { l: 110, r: 30, t: 20, b: 60 },
                paper_bgcolor: "#ffffff",
                plot_bgcolor: "#ffffff",
                xaxis: { side: "top" },
                yaxis: { autorange: "reversed" },
                annotations: heatmapAnnotations,
                shapes: winnerSeparator,
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className="h-[380px]">
            <Plot
              data={contributionTraces}
              layout={{
                barmode: "stack",
                margin: { l: 70, r: 20, t: 20, b: 70 },
                paper_bgcolor: "#ffffff",
                plot_bgcolor: "#ffffff",
                yaxis: { title: "Contribuicao quadratica para d+² por criterio" },
                legend: { orientation: "h", x: 0, y: 1.15 },
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* ── VISUALIZACAO ESPACIAL ADAPTATIVA ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <h2 className="text-sm font-extrabold text-[#231F20] mb-1">{spatialSection.title}</h2>
          <p className="text-xs text-gray-400 mb-4">{spatialSection.subtitle}</p>
          <div className="h-[460px]">
            <Plot
              data={spatialSection.data}
              layout={{
                margin: { l: 55, r: 20, t: 20, b: 45 },
                paper_bgcolor: "#ffffff",
                plot_bgcolor: "#ffffff",
                showlegend: true,
                legend: { orientation: "h", x: 0, y: 1.1 },
                ...spatialSection.layout,
              }}
              config={{ responsive: true }}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* ── ANALISE DE SENSIBILIDADE DE PESOS ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-extrabold text-[#231F20] mb-1">Analise de Sensibilidade de Pesos</h2>
              <p className="text-xs text-gray-400">Ajuste os pesos e acompanhe o ranking simulado em tempo real</p>
            </div>
            <button
              onClick={() => setEditedWeights(null)}
              className="text-xs font-bold px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition"
            >
              Resetar pesos originais
            </button>
          </div>

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
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Ranking simulado</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wider text-gray-400">
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
                        <td className="py-2 font-mono">{item.score.toFixed(4)}</td>
                        <td className={`py-2 font-mono ${item.delta >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                          {item.delta >= 0 ? "+" : ""}
                          {item.delta.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className={`mt-4 text-xs font-semibold ${simulated.changed ? "text-amber-700" : "text-emerald-700"}`}>
                {simulated.changed
                  ? simulated.inversionMessage
                  : "✓ Ranking estavel nesta configuracao de pesos"}
              </p>
            </div>

            <div className="border border-gray-100 rounded-lg p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Score simulado</h3>
              <div className="h-[220px]">
                <Plot
                  data={simulatedBars}
                  layout={{
                    margin: { l: 110, r: 20, t: 10, b: 30 },
                    paper_bgcolor: "#ffffff",
                    plot_bgcolor: "#ffffff",
                    xaxis: { range: [0, 1], title: "Score" },
                  }}
                  config={{ responsive: true, displayModeBar: false }}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── MATRIZES ── */}
        <details className="bg-white rounded-xl border border-gray-200 shadow-sm group">
          <summary className="px-7 py-5 cursor-pointer text-sm font-extrabold text-[#231F20] flex items-center justify-between select-none">
            Ver matrizes intermediárias (PIS, NIS, normalizada, ponderada)
            <span className="text-gray-400 text-lg group-open:rotate-180 transition-transform">
              ↓
            </span>
          </summary>
          <div className="px-7 pb-7 pt-2 grid gap-6 border-t border-gray-100">
            <div>
              <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px] mb-3">
                Matriz Normalizada
              </p>
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
              <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px] mb-3">
                Matriz Ponderada
              </p>
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
                <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px] mb-3">
                  Solução Ideal Positiva (PIS)
                </p>
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
                <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px] mb-3">
                  Solução Ideal Negativa (NIS)
                </p>
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
                <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px] mb-3">
                  Componentes de d+ (delta_plus)
                </p>
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
                <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px] mb-3">
                  Componentes de d- (delta_minus)
                </p>
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
          </div>
        </details>

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
