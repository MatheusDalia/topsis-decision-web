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
import { TopsisRequest, TopsisResponse, exportCsv } from "@/lib/api";

const PALETTE = [
  "#DB1E2F", "#AF0421", "#374151", "#6b7280", "#9ca3af",
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

  const chartCc = data.ranking.map((r) => ({
    name: r.name,
    cc: Number(r.closeness.toFixed(4)),
  }));

  const chartDist = data.ranking.map((r) => ({
    name: r.name,
    "d⁺ (à PIS)": Number(r.distance_to_pis.toFixed(4)),
    "d⁻ (à NIS)": Number(r.distance_to_nis.toFixed(4)),
  }));

  const winner = data.ranking[0];

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
                🏆 {winner.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-red-200 text-xs font-bold uppercase tracking-[2px] mb-1">
                Coeficiente
              </p>
              <p className="text-white text-3xl font-black">
                {winner.closeness.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        {/* ── GRÁFICOS ── */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
            <h2 className="text-sm font-extrabold text-[#231F20] mb-1">
              Coeficiente de proximidade
            </h2>
            <p className="text-xs text-gray-400 mb-5">CCi por alternativa</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartCc} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="cc" name="CCi" radius={[6, 6, 0, 0]}>
                    {chartCc.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
            <h2 className="text-sm font-extrabold text-[#231F20] mb-1">
              Distâncias às soluções ideais
            </h2>
            <p className="text-xs text-gray-400 mb-5">d⁺ (PIS) e d⁻ (NIS) por alternativa</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDist} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="d⁺ (à PIS)" fill="#DB1E2F" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="d⁻ (à NIS)" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
                {data.ranking.map((r) => (
                  <tr
                    key={r.name}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition ${
                      r.rank === 1 ? "bg-red-50/50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                          r.rank === 1
                            ? "bg-[#DB1E2F] text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {r.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#231F20]">{r.name}</td>
                    <td className="px-4 py-3 font-mono text-[#231F20]">
                      {r.closeness.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500">
                      {r.distance_to_pis.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500">
                      {r.distance_to_nis.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="px-7 pb-7 pt-2 grid lg:grid-cols-2 gap-6 border-t border-gray-100">
            <div>
              <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px] mb-3">
                Solução Ideal Positiva (PIS)
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                {data.criteria_names.map((c, i) => (
                  <div key={c} className="flex justify-between text-xs">
                    <span className="text-gray-500">{c}</span>
                    <span className="font-mono text-[#231F20] font-semibold">
                      {data.pis[i].toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#DB1E2F] uppercase tracking-[2px] mb-3">
                Solução Ideal Negativa (NIS)
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                {data.criteria_names.map((c, i) => (
                  <div key={c} className="flex justify-between text-xs">
                    <span className="text-gray-500">{c}</span>
                    <span className="font-mono text-[#231F20] font-semibold">
                      {data.nis[i].toFixed(4)}
                    </span>
                  </div>
                ))}
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