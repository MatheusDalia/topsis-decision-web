// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   Alternative,
//   Criterion,
//   Normalization,
//   TopsisRequest,
//   runTopsis,
// } from "@/lib/api";

// const SEED_CRITERIA: Criterion[] = [
//   { name: "Custo", weight: 0.4, type: "cost" },
//   { name: "Qualidade", weight: 0.35, type: "benefit" },
//   { name: "Prazo", weight: 0.25, type: "cost" },
// ];

// const SEED_ALTS: Alternative[] = [
//   { name: "Fornecedor A", values: [1200, 8, 5] },
//   { name: "Fornecedor B", values: [950, 7, 7] },
//   { name: "Fornecedor C", values: [1100, 9, 4] },
// ];

// export default function DecisionPage() {
//   const router = useRouter();
//   const [criteria, setCriteria] = useState<Criterion[]>(SEED_CRITERIA);
//   const [alternatives, setAlternatives] = useState<Alternative[]>(SEED_ALTS);
//   const [normalization, setNormalization] =
//     useState<Normalization>("vector");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const addCriterion = () => {
//     setCriteria([
//       ...criteria,
//       { name: `Critério ${criteria.length + 1}`, weight: 0.1, type: "benefit" },
//     ]);
//     setAlternatives(
//       alternatives.map((a) => ({ ...a, values: [...a.values, 0] })),
//     );
//   };

//   const removeCriterion = (idx: number) => {
//     if (criteria.length <= 1) return;
//     setCriteria(criteria.filter((_, i) => i !== idx));
//     setAlternatives(
//       alternatives.map((a) => ({
//         ...a,
//         values: a.values.filter((_, i) => i !== idx),
//       })),
//     );
//   };

//   const addAlternative = () => {
//     setAlternatives([
//       ...alternatives,
//       {
//         name: `Alternativa ${alternatives.length + 1}`,
//         values: criteria.map(() => 0),
//       },
//     ]);
//   };

//   const removeAlternative = (idx: number) => {
//     if (alternatives.length <= 2) return;
//     setAlternatives(alternatives.filter((_, i) => i !== idx));
//   };

//   const updateCriterion = (idx: number, patch: Partial<Criterion>) => {
//     setCriteria(criteria.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
//   };

//   const updateValue = (altIdx: number, critIdx: number, value: number) => {
//     setAlternatives(
//       alternatives.map((a, i) =>
//         i === altIdx
//           ? {
//               ...a,
//               values: a.values.map((v, j) => (j === critIdx ? value : v)),
//             }
//           : a,
//       ),
//     );
//   };

//   const handleRun = async () => {
//     setError(null);
//     setLoading(true);
//     try {
//       const req: TopsisRequest = { criteria, alternatives, normalization };
//       const res = await runTopsis(req);
//       sessionStorage.setItem("topsis:request", JSON.stringify(req));
//       sessionStorage.setItem("topsis:result", JSON.stringify(res));
//       router.push("/result");
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Erro desconhecido");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <section className="mx-auto max-w-6xl px-6 py-12">
//         <Link href="/" className="text-sm text-sky-700 hover:underline">
//           ← Voltar
//         </Link>
//         <h1 className="mt-4 text-3xl font-bold text-slate-900">
//           Configurar decisão
//         </h1>
//         <p className="mt-2 text-slate-600">
//           Defina os critérios, suas alternativas e os valores. O sistema
//           calcula o ranking via TOPSIS.
//         </p>

//         <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-slate-900">Critérios</h2>
//             <button
//               onClick={addCriterion}
//               className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
//             >
//               + adicionar critério
//             </button>
//           </div>

//           <div className="mt-4 grid gap-3">
//             {criteria.map((c, i) => (
//               <div
//                 key={i}
//                 className="grid grid-cols-12 items-center gap-3 rounded border border-slate-100 p-3"
//               >
//                 <input
//                   className="col-span-5 rounded border border-slate-300 px-3 py-2 text-sm"
//                   value={c.name}
//                   onChange={(e) => updateCriterion(i, { name: e.target.value })}
//                   placeholder="Nome do critério"
//                 />
//                 <input
//                   type="number"
//                   step="0.05"
//                   min="0"
//                   className="col-span-3 rounded border border-slate-300 px-3 py-2 text-sm"
//                   value={c.weight}
//                   onChange={(e) =>
//                     updateCriterion(i, { weight: Number(e.target.value) })
//                   }
//                   placeholder="peso"
//                 />
//                 <select
//                   className="col-span-3 rounded border border-slate-300 px-3 py-2 text-sm"
//                   value={c.type}
//                   onChange={(e) =>
//                     updateCriterion(i, {
//                       type: e.target.value as "benefit" | "cost",
//                     })
//                   }
//                 >
//                   <option value="benefit">benefício</option>
//                   <option value="cost">custo</option>
//                 </select>
//                 <button
//                   onClick={() => removeCriterion(i)}
//                   className="col-span-1 text-slate-400 hover:text-red-600"
//                   title="remover"
//                   aria-label="remover critério"
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-slate-900">
//               Alternativas
//             </h2>
//             <button
//               onClick={addAlternative}
//               className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
//             >
//               + adicionar alternativa
//             </button>
//           </div>

//           <div className="mt-4 overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-slate-200 text-left text-slate-600">
//                   <th className="px-3 py-2 font-medium">Nome</th>
//                   {criteria.map((c, j) => (
//                     <th key={j} className="px-3 py-2 font-medium">
//                       {c.name}
//                     </th>
//                   ))}
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {alternatives.map((a, i) => (
//                   <tr key={i} className="border-b border-slate-100">
//                     <td className="px-3 py-2">
//                       <input
//                         className="w-full rounded border border-slate-300 px-2 py-1.5"
//                         value={a.name}
//                         onChange={(e) =>
//                           setAlternatives(
//                             alternatives.map((alt, idx) =>
//                               idx === i ? { ...alt, name: e.target.value } : alt,
//                             ),
//                           )
//                         }
//                       />
//                     </td>
//                     {a.values.map((v, j) => (
//                       <td key={j} className="px-3 py-2">
//                         <input
//                           type="number"
//                           step="0.1"
//                           className="w-24 rounded border border-slate-300 px-2 py-1.5"
//                           value={v}
//                           onChange={(e) =>
//                             updateValue(i, j, Number(e.target.value))
//                           }
//                         />
//                       </td>
//                     ))}
//                     <td className="px-3 py-2">
//                       <button
//                         onClick={() => removeAlternative(i)}
//                         className="text-slate-400 hover:text-red-600"
//                         title="remover"
//                         aria-label="remover alternativa"
//                       >
//                         ×
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//           <h2 className="text-lg font-semibold text-slate-900">
//             Configuração avançada
//           </h2>
//           <div className="mt-3">
//             <label className="text-sm text-slate-700">
//               Método de normalização
//             </label>
//             <select
//               className="ml-3 rounded border border-slate-300 px-3 py-1.5 text-sm"
//               value={normalization}
//               onChange={(e) =>
//                 setNormalization(e.target.value as Normalization)
//               }
//             >
//               <option value="vector">vetorial (TOPSIS clássico)</option>
//               <option value="linear">linear (Chen 2000)</option>
//               <option value="minmax">min-max</option>
//             </select>
//           </div>
//         </div>

//         {error && (
//           <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         <div className="mt-8 flex justify-end">
//           <button
//             disabled={loading}
//             onClick={handleRun}
//             className="rounded-md bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-sky-800 disabled:opacity-50"
//           >
//             {loading ? "Calculando..." : "Calcular ranking"}
//           </button>
//         </div>
//       </section>
//     </main>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Alternative,
  Criterion,
  Normalization,
  TopsisRequest,
  runTopsis,
} from "@/lib/api";

const SEED_CRITERIA: Criterion[] = [
  { name: "Custo", weight: 0.4, type: "cost" },
  { name: "Qualidade", weight: 0.35, type: "benefit" },
  { name: "Prazo", weight: 0.25, type: "cost" },
];

const SEED_ALTS: Alternative[] = [
  { name: "Fornecedor A", values: [1200, 8, 5] },
  { name: "Fornecedor B", values: [950, 7, 7] },
  { name: "Fornecedor C", values: [1100, 9, 4] },
];

const STORAGE_KEY = "topsis:decision-input";

type StoredInput = {
  criteria: Criterion[];
  alternatives: Alternative[];
  normalization: Normalization;
};

function isValidStoredInput(value: unknown): value is StoredInput {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<StoredInput>;
  if (!Array.isArray(v.criteria) || v.criteria.length === 0) return false;
  if (!Array.isArray(v.alternatives) || v.alternatives.length === 0) return false;
  const cols = v.criteria.length;
  return v.alternatives.every(
    (a) => a && typeof a.name === "string" && Array.isArray(a.values) && a.values.length === cols
  );
}

export default function DecisionPage() {
  const router = useRouter();
  const [criteria, setCriteria] = useState<Criterion[]>(SEED_CRITERIA);
  const [alternatives, setAlternatives] = useState<Alternative[]>(SEED_ALTS);
  const [normalization, setNormalization] = useState<Normalization>("vector");
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hidratação SSR-safe a partir do localStorage */
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidStoredInput(parsed)) {
          setCriteria(parsed.criteria);
          setAlternatives(parsed.alternatives);
          setNormalization(parsed.normalization);
        }
      }
    } catch {
      // ignora storage corrompido
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ criteria, alternatives, normalization })
      );
    } catch {
      // ignora quota cheia / modo privado
    }
  }, [criteria, alternatives, normalization, hydrated]);

const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
const weightOutOfRange = totalWeight < 0.99 || totalWeight > 1.01;

  const addCriterion = () => {
    setCriteria([
      ...criteria,
      { name: `Critério ${criteria.length + 1}`, weight: 0.1, type: "benefit" },
    ]);
    setAlternatives(
      alternatives.map((a) => ({ ...a, values: [...a.values, 0] }))
    );
  };

  const removeCriterion = (idx: number) => {
    if (criteria.length <= 1) return;
    setCriteria(criteria.filter((_, i) => i !== idx));
    setAlternatives(
      alternatives.map((a) => ({
        ...a,
        values: a.values.filter((_, i) => i !== idx),
      }))
    );
  };

  const addAlternative = () => {
    setAlternatives([
      ...alternatives,
      {
        name: `Alternativa ${alternatives.length + 1}`,
        values: criteria.map(() => 0),
      },
    ]);
  };

  const removeAlternative = (idx: number) => {
    if (alternatives.length <= 2) return;
    setAlternatives(alternatives.filter((_, i) => i !== idx));
  };

  const updateCriterion = (idx: number, patch: Partial<Criterion>) => {
    setCriteria(criteria.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  const updateValue = (altIdx: number, critIdx: number, value: number) => {
    setAlternatives(
      alternatives.map((a, i) =>
        i === altIdx
          ? { ...a, values: a.values.map((v, j) => (j === critIdx ? value : v)) }
          : a
      )
    );
  };

  const handleRun = async () => {
    setError(null);
    setLoading(true);
    try {
      const req: TopsisRequest = { criteria, alternatives, normalization };
      const res = await runTopsis(req);
      sessionStorage.setItem("topsis:request", JSON.stringify(req));
      sessionStorage.setItem("topsis:result", JSON.stringify(res));
      router.push("/result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

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
        <Link
          href="/"
          className="text-gray-400 hover:text-white text-sm px-4 py-2 rounded-md hover:bg-white/5 transition"
        >
          ← Voltar para o início
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-[#231F20] px-10 pt-12 pb-14 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#DB1E2F] via-[#DB1E2F]/30 to-transparent" />
        <div className="max-w-5xl">
          <p className="text-[#DB1E2F] text-xs font-bold uppercase tracking-[3px] mb-3">
            Nova decisão
          </p>
          <h1 className="text-4xl font-black text-white mb-2">
            Configurar decisão
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
            Defina os critérios, suas alternativas e os valores. O sistema
            calcula o ranking via TOPSIS.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-10 py-10 flex flex-col gap-6">

        {/* ── CRITÉRIOS ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-extrabold text-[#231F20]">Critérios</h2>
              <p className="text-xs text-gray-400 mt-0.5">Nome, peso e tipo de cada critério</p>
            </div>
            <button
              onClick={addCriterion}
              className="bg-[#DB1E2F] hover:bg-[#AF0421] text-white text-xs font-bold px-4 py-2 rounded-lg transition"
            >
              + adicionar critério
            </button>
          </div>

          {/* cabeçalho */}
          <div className="grid grid-cols-12 gap-3 px-3 mb-2">
            <span className="col-span-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nome</span>
            <span className="col-span-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Peso</span>
            <span className="col-span-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tipo</span>
          </div>

          <div className="flex flex-col gap-2">
            {criteria.map((c, i) => (
              <div
                key={i}
                className="grid grid-cols-12 items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5"
              >
                <input
                  className="col-span-5 bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#231F20] focus:outline-none focus:border-[#DB1E2F] transition"
                  value={c.name}
                  onChange={(e) => updateCriterion(i, { name: e.target.value })}
                  placeholder="Nome do critério"
                />
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  className="col-span-3 bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#231F20] focus:outline-none focus:border-[#DB1E2F] transition"
                  value={c.weight}
                  onChange={(e) => updateCriterion(i, { weight: Number(e.target.value) })}
                />
                <select
                  className="col-span-3 bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#231F20] focus:outline-none focus:border-[#DB1E2F] transition"
                  value={c.type}
                  onChange={(e) => updateCriterion(i, { type: e.target.value as "benefit" | "cost" })}
                >
                  <option value="benefit">benefício</option>
                  <option value="cost">custo</option>
                </select>
                <button
                  onClick={() => removeCriterion(i)}
                  className="col-span-1 text-gray-300 hover:text-[#DB1E2F] text-xl font-light transition flex items-center justify-center"
                  aria-label="remover critério"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {weightOutOfRange && (
            <p className="mt-3 text-xs text-gray-500 px-1">
              Os pesos serão normalizados automaticamente (soma atual: {totalWeight.toFixed(2)})
            </p>
          )}
        </div>

        {/* ── ALTERNATIVAS ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-extrabold text-[#231F20]">Alternativas</h2>
              <p className="text-xs text-gray-400 mt-0.5">Valores de cada alternativa por critério</p>
            </div>
            <button
              onClick={addAlternative}
              className="bg-[#DB1E2F] hover:bg-[#AF0421] text-white text-xs font-bold px-4 py-2 rounded-lg transition"
            >
              + adicionar alternativa
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Nome
                  </th>
                  {criteria.map((c, j) => (
                    <th key={j} className="px-3 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {c.name}
                    </th>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody>
                {alternatives.map((a, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-3 py-2.5">
                      <input
                        className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-[#231F20] focus:outline-none focus:border-[#DB1E2F] transition"
                        value={a.name}
                        onChange={(e) =>
                          setAlternatives(
                            alternatives.map((alt, idx) =>
                              idx === i ? { ...alt, name: e.target.value } : alt
                            )
                          )
                        }
                      />
                    </td>
                    {a.values.map((v, j) => (
                      <td key={j} className="px-3 py-2.5">
                        <input
                          type="number"
                          step="0.1"
                          className="w-24 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-[#231F20] focus:outline-none focus:border-[#DB1E2F] transition"
                          value={v}
                          onChange={(e) => updateValue(i, j, Number(e.target.value))}
                        />
                      </td>
                    ))}
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => removeAlternative(i)}
                        className="text-gray-300 hover:text-[#DB1E2F] text-xl font-light transition"
                        aria-label="remover alternativa"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CONFIGURAÇÃO AVANÇADA ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
          <h2 className="text-base font-extrabold text-[#231F20] mb-1">Configuração avançada</h2>
          <p className="text-xs text-gray-400 mb-5">Escolha o método de normalização da matriz</p>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600 font-medium">
              Método de normalização
            </label>
            <select
              className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-2 text-sm text-[#231F20] focus:outline-none focus:border-[#DB1E2F] transition"
              value={normalization}
              onChange={(e) => setNormalization(e.target.value as Normalization)}
            >
              <option value="vector">vetorial (TOPSIS clássico)</option>
              <option value="linear">linear (Chen 2000)</option>
              <option value="minmax">min-max</option>
            </select>
          </div>
        </div>

        {/* ── ERRO ── */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ── AÇÃO ── */}
        <div className="flex flex-col items-end gap-2 pb-4">
          <button
            disabled={loading}
            onClick={handleRun}
            className="bg-[#DB1E2F] hover:bg-[#AF0421] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm px-8 py-4 rounded-lg transition"
          >
            {loading ? "Calculando..." : "Calcular ranking →"}
          </button>
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
//////////////
