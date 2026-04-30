"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  TopsisRequest,
  TopsisResponse,
  exportCsv,
} from "@/lib/api";

const PALETTE = [
  "#0369a1", "#15803d", "#a16207", "#9333ea", "#be185d",
  "#0891b2", "#65a30d", "#ea580c", "#7c3aed", "#db2777",
];

export default function ResultPage() {
  const [data, setData] = useState<TopsisResponse | null>(null);
  const [request, setRequest] = useState<TopsisRequest | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("topsis:result");
    const reqStored = sessionStorage.getItem("topsis:request");
    if (stored) setData(JSON.parse(stored) as TopsisResponse);
    if (reqStored) setRequest(JSON.parse(reqStored) as TopsisRequest);
  }, []);

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

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-slate-600">Sem resultados para exibir.</p>
          <Link
            href="/decision"
            className="mt-4 inline-block text-sky-700 hover:underline"
          >
            ← Voltar ao formulário
          </Link>
        </section>
      </main>
    );
  }

  const chartData = data.ranking.map((r) => ({
    name: r.name,
    cc: Number(r.closeness.toFixed(4)),
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between">
          <Link
            href="/decision"
            className="text-sm text-sky-700 hover:underline"
          >
            ← Refazer decisão
          </Link>
          <button
            onClick={handleExport}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Exportar CSV
          </button>
        </div>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">Resultado</h1>
        <p className="mt-2 text-slate-600">
          Ranking calculado pelo método TOPSIS clássico (distância
          Euclidiana, p=2). Maior coeficiente de proximidade = melhor
          alternativa.
        </p>

        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm uppercase tracking-wider text-amber-800">
            Vencedor
          </p>
          <p className="mt-1 text-3xl font-bold text-amber-900">
            🏆 {data.ranking[0].name}
          </p>
          <p className="mt-2 text-sm text-amber-800">
            CCi = {data.ranking[0].closeness.toFixed(4)}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Coeficiente de proximidade
            </h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cc" name="CCi">
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Distâncias às soluções ideais
            </h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.ranking.map((r) => ({
                    name: r.name,
                    "d* (à PIS)": Number(r.distance_to_pis.toFixed(4)),
                    "d⁻ (à NIS)": Number(r.distance_to_nis.toFixed(4)),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="d* (à PIS)" fill="#dc2626" />
                  <Bar dataKey="d⁻ (à NIS)" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Ranking completo
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Alternativa</th>
                  <th className="px-3 py-2 font-medium">CCi</th>
                  <th className="px-3 py-2 font-medium">d*</th>
                  <th className="px-3 py-2 font-medium">d⁻</th>
                </tr>
              </thead>
              <tbody>
                {data.ranking.map((r) => (
                  <tr key={r.name} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-semibold">{r.rank}</td>
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2">{r.closeness.toFixed(4)}</td>
                    <td className="px-3 py-2">
                      {r.distance_to_pis.toFixed(4)}
                    </td>
                    <td className="px-3 py-2">
                      {r.distance_to_nis.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <details className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">
            Ver matrizes intermediárias (PIS, NIS, normalizada, ponderada)
          </summary>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="font-medium text-slate-800">
                Solução Ideal Positiva (PIS)
              </h3>
              <pre className="mt-2 overflow-x-auto rounded bg-slate-50 p-3 text-xs">
                {data.criteria_names
                  .map((c, i) => `${c}: ${data.pis[i].toFixed(4)}`)
                  .join("\n")}
              </pre>
            </div>
            <div>
              <h3 className="font-medium text-slate-800">
                Solução Ideal Negativa (NIS)
              </h3>
              <pre className="mt-2 overflow-x-auto rounded bg-slate-50 p-3 text-xs">
                {data.criteria_names
                  .map((c, i) => `${c}: ${data.nis[i].toFixed(4)}`)
                  .join("\n")}
              </pre>
            </div>
          </div>
        </details>
      </section>
    </main>
  );
}
