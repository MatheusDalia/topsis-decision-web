// import Link from "next/link";

// export default function About() {
//   return (
//     <main className="min-h-screen bg-white">
//       <section className="mx-auto max-w-3xl px-6 py-16">
//         <Link href="/" className="text-sm text-sky-700 hover:underline">
//           ← Voltar
//         </Link>
//         <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
//           Sobre o TOPSIS Web
//         </h1>

//         <div className="prose prose-slate mt-8 max-w-none">
//           <h2>O que é TOPSIS?</h2>
//           <p>
//             <strong>TOPSIS</strong> (<em>Technique for Order Preference by
//             Similarity to Ideal Solution</em>) é um dos métodos de decisão
//             multicritério mais aplicados no mundo. Foi proposto por
//             Hwang & Yoon em 1981, e desde então ganhou diversas extensões.
//           </p>
//           <p>
//             O princípio é geometricamente intuitivo: a alternativa escolhida
//             deve estar simultaneamente <strong>mais próxima da Solução Ideal
//             Positiva (PIS)</strong> — formada pelos melhores valores de cada
//             critério — e <strong>mais distante da Solução Ideal Negativa
//             (NIS)</strong>, formada pelos piores valores.
//           </p>

//           <h2>Como o sistema funciona</h2>
//           <ol>
//             <li>O usuário cadastra alternativas e critérios.</li>
//             <li>
//               Para cada critério, define peso e tipo (benefício ou custo).
//             </li>
//             <li>
//               O backend (FastAPI) executa o algoritmo TOPSIS: normalização,
//               ponderação, cálculo das soluções ideais, distâncias Euclidianas
//               e coeficiente de proximidade.
//             </li>
//             <li>
//               O ranking final é exibido com gráficos e pode ser exportado
//               para CSV.
//             </li>
//           </ol>

//           <h2>Artigos de referência</h2>
//           <ul>
//             <li>
//               Hwang, C.L. &amp; Yoon, K. (1981).{" "}
//               <em>Multiple Attribute Decision Making</em>. Springer.
//             </li>
//             <li>
//               Hwang, C.L., Lai, Y.J. &amp; Liu, T.Y. (1993). A new approach
//               for multiple objective decision making.{" "}
//               <em>Computers &amp; Operations Research</em>, 20(8), 889–899.
//             </li>
//             <li>
//               Chen, C.T. (2000). Extensions of the TOPSIS for group
//               decision-making under fuzzy environment.{" "}
//               <em>Fuzzy Sets and Systems</em>, 114(1), 1–9.
//             </li>
//             <li>
//               Nădăban, S., Dzitac, S. &amp; Dzitac, I. (2016). Fuzzy TOPSIS:
//               A general view. <em>Procedia Computer Science</em>, 91, 823–831.
//             </li>
//           </ul>

//           <h2>Stack técnico</h2>
//           <ul>
//             <li>Frontend: Next.js 16 + React 19 + TailwindCSS</li>
//             <li>Backend: FastAPI (Python) + NumPy</li>
//             <li>API: REST com OpenAPI/Swagger em <code>/docs</code></li>
//           </ul>
//         </div>
//       </section>
//     </main>
//   );
// }

import Link from "next/link";

const methodSteps = [
  {
    n: "1",
    title: "Construção da matriz de decisão",
    desc: "O usuário define as alternativas (linhas) e os critérios com seus pesos e tipos — benefício ou custo (colunas), formando a matriz X.",
    formula: null,
  },
  {
    n: "2",
    title: "Normalização da matriz",
    desc: "Os valores são normalizados para remover diferenças de escala entre critérios. No método vetorial clássico:",
    formula: "rᵢⱼ = xᵢⱼ / √(Σ x²ₖⱼ)",
  },
  {
    n: "3",
    title: "Ponderação dos critérios",
    desc: "Cada coluna normalizada é multiplicada pelo peso do critério correspondente, refletindo sua importância relativa.",
    formula: "vᵢⱼ = wⱼ · rᵢⱼ",
  },
  {
    n: "4",
    title: "Determinação das soluções ideais",
    desc: "Calcula-se a Solução Ideal Positiva (PIS) com os melhores valores de cada critério, e a Solução Ideal Negativa (NIS) com os piores.",
    formula: null,
  },
  {
    n: "5",
    title: "Cálculo das distâncias euclidianas",
    desc: "Para cada alternativa, calcula-se a distância à PIS (d⁺) e à NIS (d⁻) usando a norma Euclidiana.",
    formula: "dᵢ⁺ = √(Σ (vᵢⱼ − vⱼ⁺)²)",
  },
  {
    n: "6",
    title: "Coeficiente de proximidade e ranking",
    desc: "O CCᵢ varia entre 0 e 1. Quanto maior, mais próxima da solução ideal — portanto, melhor a alternativa.",
    formula: "CCᵢ = dᵢ⁻ / (dᵢ⁺ + dᵢ⁻)",
  },
];

const references = [
  {
    text: "Hwang, C.L. & Yoon, K. (1981).",
    italic: "Multiple Attribute Decision Making.",
    rest: " Springer.",
  },
  {
    text: "Hwang, C.L., Lai, Y.J. & Liu, T.Y. (1993). A new approach for multiple objective decision making.",
    italic: "Computers & Operations Research,",
    rest: " 20(8), 889–899.",
  },
  {
    text: "Chen, C.T. (2000). Extensions of the TOPSIS for group decision-making under fuzzy environment.",
    italic: "Fuzzy Sets and Systems,",
    rest: " 114(1), 1–9.",
  },
  {
    text: "Nădăban, S., Dzitac, S. & Dzitac, I. (2016). Fuzzy TOPSIS: A general view.",
    italic: "Procedia Computer Science,",
    rest: " 91, 823–831.",
  },
];

const stack = [
  { label: "Frontend", val: "Next.js 16 + React 19 + TailwindCSS" },
  { label: "Backend",  val: "FastAPI (Python) + NumPy" },
  { label: "API",      val: "REST com OpenAPI / Swagger em /docs" },
];

export default function About() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── NAV ── */}
      <nav className="bg-[#231F20] px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#DB1E2F] rounded-md flex items-center justify-center text-white font-black text-sm">
            T
          </div>
          <div>
            <span className="text-white font-bold text-sm tracking-wide">TOPSIS Web</span>
            <span className="text-gray-500 text-xs block leading-none mt-0.5">Sistemas de Informação · CIn-UFPE</span>
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
      <section className="bg-[#231F20] px-10 pt-16 pb-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#DB1E2F] via-[#DB1E2F]/30 to-transparent" />
        <div className="max-w-4xl">
          <h1 className="text-5xl font-black text-white mb-4">
            Sobre o <span className="text-[#DB1E2F]">TOPSIS</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
            Entenda o método por trás do sistema, os fundamentos matemáticos
            e como ele é aplicado nesta plataforma.
          </p>
        </div>
      </section>

      {/* ── CONTEÚDO ── */}
      <div className="px-10 py-16 max-w-4xl">

        {/* Definição */}
        <div className="bg-red-50 border-l-4 border-[#DB1E2F] rounded-r-xl px-8 py-7 mb-14">
          <p className="text-[10px] font-black text-[#DB1E2F] tracking-[2px] uppercase mb-3">
            Definição
          </p>
          <p className="text-[#231F20] text-sm leading-relaxed">
            <strong>TOPSIS</strong>{" "}
            <em className="text-gray-500">
              (Technique for Order Preference by Similarity to Ideal Solution)
            </em>{" "}
            é um dos métodos de decisão multicritério mais aplicados no mundo.
            Foi proposto por Hwang & Yoon em 1981 e desde então ganhou diversas
            extensões.
            <br /><br />
            O princípio é geometricamente intuitivo: a alternativa ideal deve
            estar simultaneamente{" "}
            <strong>mais próxima da Solução Ideal Positiva (PIS)</strong> —
            formada pelos melhores valores de cada critério — e{" "}
            <strong>mais distante da Solução Ideal Negativa (NIS)</strong>.
          </p>
        </div>

        {/* Passo a passo */}
        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-[#231F20] mb-1">
            Passo a passo do algoritmo
          </h2>
          <p className="text-gray-400 text-sm mb-9">
            O método segue 6 etapas bem definidas a partir da matriz de decisão
          </p>

          <div className="flex flex-col gap-5">
            {methodSteps.map((s) => (
              <div
                key={s.n}
                className="flex gap-5 items-start bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
              >
                <div className="min-w-[44px] h-11 bg-[#DB1E2F] text-white rounded-lg flex items-center justify-center font-black text-base">
                  {s.n}
                </div>
                <div>
                  <h4 className="font-bold text-[#231F20] text-sm mb-1">{s.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  {s.formula && (
                    <span className="inline-block mt-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-serif text-sm text-gray-700">
                      {s.formula}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referências */}
        <div className="bg-gray-50 rounded-xl px-9 py-8 mb-14">
          <h2 className="text-lg font-extrabold text-[#231F20] mb-6">
            Referências bibliográficas
          </h2>
          <div className="flex flex-col">
            {references.map((r, i) => (
              <div
                key={i}
                className={`py-4 text-sm text-gray-700 leading-relaxed ${
                  i < references.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                {r.text} <em className="text-gray-500">{r.italic}</em>{r.rest}
              </div>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div className="mb-14">
          <p className="text-[#DB1E2F] text-xs font-bold uppercase tracking-[3px] mb-6">
            Stack Técnico deste Projeto
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {stack.map((s) => (
              <div
                key={s.label}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center"
              >
                <p className="text-[10px] font-black text-[#DB1E2F] tracking-[2px] uppercase mb-2">
                  {s.label}
                </p>
                <p className="text-sm font-semibold text-[#231F20] leading-snug">
                  {s.val}
                </p>
              </div>
            ))}
          </div>
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
