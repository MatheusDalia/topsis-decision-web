"use client";

import { useState } from "react";
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

export default function DecisionPage() {
  const router = useRouter();
  const [criteria, setCriteria] = useState<Criterion[]>(SEED_CRITERIA);
  const [alternatives, setAlternatives] = useState<Alternative[]>(SEED_ALTS);
  const [normalization, setNormalization] =
    useState<Normalization>("vector");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCriterion = () => {
    setCriteria([
      ...criteria,
      { name: `Critério ${criteria.length + 1}`, weight: 0.1, type: "benefit" },
    ]);
    setAlternatives(
      alternatives.map((a) => ({ ...a, values: [...a.values, 0] })),
    );
  };

  const removeCriterion = (idx: number) => {
    if (criteria.length <= 1) return;
    setCriteria(criteria.filter((_, i) => i !== idx));
    setAlternatives(
      alternatives.map((a) => ({
        ...a,
        values: a.values.filter((_, i) => i !== idx),
      })),
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
          ? {
              ...a,
              values: a.values.map((v, j) => (j === critIdx ? value : v)),
            }
          : a,
      ),
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
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Link href="/" className="text-sm text-sky-700 hover:underline">
          ← Voltar
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Configurar decisão
        </h1>
        <p className="mt-2 text-slate-600">
          Defina os critérios, suas alternativas e os valores. O sistema
          calcula o ranking via TOPSIS.
        </p>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Critérios</h2>
            <button
              onClick={addCriterion}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              + adicionar critério
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            {criteria.map((c, i) => (
              <div
                key={i}
                className="grid grid-cols-12 items-center gap-3 rounded border border-slate-100 p-3"
              >
                <input
                  className="col-span-5 rounded border border-slate-300 px-3 py-2 text-sm"
                  value={c.name}
                  onChange={(e) => updateCriterion(i, { name: e.target.value })}
                  placeholder="Nome do critério"
                />
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  className="col-span-3 rounded border border-slate-300 px-3 py-2 text-sm"
                  value={c.weight}
                  onChange={(e) =>
                    updateCriterion(i, { weight: Number(e.target.value) })
                  }
                  placeholder="peso"
                />
                <select
                  className="col-span-3 rounded border border-slate-300 px-3 py-2 text-sm"
                  value={c.type}
                  onChange={(e) =>
                    updateCriterion(i, {
                      type: e.target.value as "benefit" | "cost",
                    })
                  }
                >
                  <option value="benefit">benefício</option>
                  <option value="cost">custo</option>
                </select>
                <button
                  onClick={() => removeCriterion(i)}
                  className="col-span-1 text-slate-400 hover:text-red-600"
                  title="remover"
                  aria-label="remover critério"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Alternativas
            </h2>
            <button
              onClick={addAlternative}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              + adicionar alternativa
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-3 py-2 font-medium">Nome</th>
                  {criteria.map((c, j) => (
                    <th key={j} className="px-3 py-2 font-medium">
                      {c.name}
                    </th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {alternatives.map((a, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-3 py-2">
                      <input
                        className="w-full rounded border border-slate-300 px-2 py-1.5"
                        value={a.name}
                        onChange={(e) =>
                          setAlternatives(
                            alternatives.map((alt, idx) =>
                              idx === i ? { ...alt, name: e.target.value } : alt,
                            ),
                          )
                        }
                      />
                    </td>
                    {a.values.map((v, j) => (
                      <td key={j} className="px-3 py-2">
                        <input
                          type="number"
                          step="0.1"
                          className="w-24 rounded border border-slate-300 px-2 py-1.5"
                          value={v}
                          onChange={(e) =>
                            updateValue(i, j, Number(e.target.value))
                          }
                        />
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <button
                        onClick={() => removeAlternative(i)}
                        className="text-slate-400 hover:text-red-600"
                        title="remover"
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

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Configuração avançada
          </h2>
          <div className="mt-3">
            <label className="text-sm text-slate-700">
              Método de normalização
            </label>
            <select
              className="ml-3 rounded border border-slate-300 px-3 py-1.5 text-sm"
              value={normalization}
              onChange={(e) =>
                setNormalization(e.target.value as Normalization)
              }
            >
              <option value="vector">vetorial (TOPSIS clássico)</option>
              <option value="linear">linear (Chen 2000)</option>
              <option value="minmax">min-max</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            disabled={loading}
            onClick={handleRun}
            className="rounded-md bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-sky-800 disabled:opacity-50"
          >
            {loading ? "Calculando..." : "Calcular ranking"}
          </button>
        </div>
      </section>
    </main>
  );
}
