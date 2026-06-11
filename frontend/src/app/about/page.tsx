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
import AboutViewer3DLazy from "../../components/AboutViewer3DLazy";

const fundamentals = [
  {
    term: "Alternativas",
    description: "Opções que serão comparadas (fornecedores, projetos, equipamentos, etc.).",
  },
  {
    term: "Critérios",
    description: "Dimensões de avaliação como custo, prazo, qualidade, risco e desempenho.",
  },
  {
    term: "Pesos",
    description: "Importância relativa de cada critério. Pesos maiores influenciam mais o ranking.",
  },
  {
    term: "PIS e NIS",
    description:
      "PIS representa o melhor cenário critério a critério; NIS representa o pior cenário.",
  },
];

const methodSteps = [
  {
    n: "1",
    title: "Montagem da matriz de decisão (X)",
    why: "Organiza o problema em formato comparável.",
    desc: "Cada linha representa uma alternativa e cada coluna representa um critério avaliado.",
    formulas: [],
    impact: "Sem uma matriz bem definida, o ranking não reflete o problema real.",
  },
  {
    n: "2",
    title: "Normalização",
    why: "Evita que escalas diferentes distorçam o resultado.",
    desc: "Converte os valores para escala comparável. No método vetorial clássico:",
    formulas: ["rᵢⱼ = xᵢⱼ / √(Σ x²ₖⱼ)"],
    impact: "Um critério em reais não domina outro medido em dias ou porcentagem.",
  },
  {
    n: "3",
    title: "Aplicação dos pesos",
    why: "Incorpora prioridades de negócio na conta.",
    desc: "Multiplica a matriz normalizada pelos pesos definidos para cada critério.",
    formulas: ["vᵢⱼ = wⱼ · rᵢⱼ"],
    impact: "Critérios estratégicos ganham mais influência no ranking final.",
  },
  {
    n: "4",
    title: "Determinação de PIS e NIS",
    why: "Define os dois pontos de referência do método.",
    desc: "Para cada critério, identifica o melhor valor (PIS) e o pior valor (NIS), respeitando tipo benefício/custo.",
    formulas: [],
    impact: "Cria o alvo ideal e o anti-ideal para medir cada alternativa.",
  },
  {
    n: "5",
    title: "Distâncias para PIS e NIS",
    why: "Mede quão perto cada alternativa está do ideal.",
    desc: "Calcula distância euclidiana para os dois referenciais.",
    formulas: ["dᵢ⁺ = √(Σ (vᵢⱼ − vⱼ⁺)²)", "dᵢ⁻ = √(Σ (vᵢⱼ − vⱼ⁻)²)"],
    impact: "Boas alternativas combinam d⁺ pequeno com d⁻ grande.",
  },
  {
    n: "6",
    title: "Coeficiente de proximidade e ranking",
    why: "Transforma as distâncias em um índice único e ordenável.",
    desc: "Calcula o coeficiente de proximidade (0 a 1) para ordenar as alternativas.",
    formulas: ["CCᵢ = dᵢ⁻ / (dᵢ⁺ + dᵢ⁻)"],
    impact: "Quanto maior o CCᵢ, mais próxima da solução ideal e melhor no ranking.",
  },
];

const processFlow = ["Matriz", "Normalização", "Pesos", "PIS/NIS", "Distâncias", "Ranking"];

const interpretationTips = [
  "CC próximo de 1 indica forte aderência ao cenário ideal.",
  "CCs muito próximos entre si indicam alternativas competitivas e empate técnico.",
  "Resultados dependem de pesos e tipo dos critérios; teste cenários para validar robustez.",
  "Análise de sensibilidade: varie os pesos para verificar se o ranking se mantém. Rankings estáveis indicam decisão robusta.",
  "TOPSIS apoia a decisão, mas não substitui restrições reais (orçamento, compliance, risco).",
];

const strengths = [
  "Transparente: cada etapa pode ser auditada.",
  "Intuitivo: combina proximidade ao ideal e distância do pior caso.",
  "Prático: gera ranking objetivo para decisão multicritério.",
];

const limitations = [
  "Reversão de ranking: adicionar ou remover uma alternativa pode alterar a ordem das demais (Hwang, Lai & Liu, 1993).",
  "Sensível a pesos e ao método de normalização.",
  "Qualidade do ranking depende da qualidade dos dados de entrada.",
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
      <nav className="bg-[#231F20] px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
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
      <section className="bg-[#231F20] px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#DB1E2F] via-[#DB1E2F]/30 to-transparent" />
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Sobre o <span className="text-[#DB1E2F]">TOPSIS</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
            Entenda o método por trás do sistema, os fundamentos matemáticos
            e como ele é aplicado nesta plataforma.
          </p>
        </div>
      </section>

      {/* ── CONTEÚDO ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">

        {/* Definição */}
        <div className="bg-red-50 border-l-4 border-[#DB1E2F] rounded-r-xl px-8 py-7 mb-14">
          <p className="text-[10px] font-black text-[#DB1E2F] tracking-[2px] uppercase mb-3">
            Visão geral
          </p>
          <p className="text-[#231F20] text-sm leading-relaxed">
            <strong>TOPSIS</strong>{" "}
            <em className="text-gray-500">
              (Technique for Order Preference by Similarity to Ideal Solution)
            </em>{" "}
            é um método de apoio à decisão multicritério. Ele resolve um
            problema comum: comparar opções quando os critérios são
            conflitantes (por exemplo, menor custo versus maior qualidade).
            <br /><br />
            O princípio central é geométrico: a melhor alternativa é aquela
            <strong> mais próxima da Solução Ideal Positiva (PIS)</strong> e,
            ao mesmo tempo,
            <strong> mais distante da Solução Ideal Negativa (NIS)</strong>.
            Assim, o ranking final representa quão perto cada opção está do
            melhor cenário possível.
          </p>
        </div>

        {/* Conceitos fundamentais */}
        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-[#231F20] mb-1">
            Conceitos fundamentais
          </h2>
          <p className="text-gray-500 text-sm mb-7">
            Estes elementos definem a modelagem da decisão e explicam por que o ranking funciona.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-7">
            {fundamentals.map((item) => (
              <div key={item.term} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                <p className="text-xs font-black text-[#DB1E2F] tracking-[1.5px] uppercase mb-2">{item.term}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
              <p className="text-sm font-bold text-[#231F20]">Regras para critério de benefício e custo</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold">Tipo de critério</th>
                    <th className="text-left px-5 py-3 font-semibold">PIS (ideal)</th>
                    <th className="text-left px-5 py-3 font-semibold">NIS (anti-ideal)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="px-5 py-3 text-[#231F20] font-medium">Beneficio</td>
                    <td className="px-5 py-3 text-gray-600">Maior valor do critério</td>
                    <td className="px-5 py-3 text-gray-600">Menor valor do critério</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-5 py-3 text-[#231F20] font-medium">Custo</td>
                    <td className="px-5 py-3 text-gray-600">Menor valor do critério</td>
                    <td className="px-5 py-3 text-gray-600">Maior valor do critério</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fluxo do processo */}
        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-[#231F20] mb-1">
            Fluxo do método
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Linha do tempo da transformação dos dados até o ranking final.
          </p>
          <div className="flex flex-wrap gap-2">
            {processFlow.map((step, idx) => (
              <div key={step} className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-lg bg-[#231F20] text-white text-xs font-semibold tracking-wide">
                  {idx + 1}. {step}
                </div>
                {idx < processFlow.length - 1 && <span className="text-gray-400 text-xs">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Por que dois pontos de referência */}
        <div className="mb-14 bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-8">
          <h2 className="text-2xl font-extrabold text-[#231F20] mb-1">
            Por que dois pontos de referência?
          </h2>
          <div className="mt-5 space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              Métodos com um único ponto (Goal Programming, Global Criterion) podem ranquear bem uma alternativa
              mediana porque ela fica &quot;no meio&quot; - perto da meta, mas também perto do pior cenário.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              O TOPSIS exige equilíbrio entre d⁺ e d⁻ simultaneamente, tornando o ranking mais robusto.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              PIS e NIS são pontos fictícios construídos coluna a coluna - raramente correspondem a uma
              alternativa real.
            </p>
            <p className="text-xs text-gray-500 pt-1">
              Fonte: Hwang, Lai & Liu (1993).
            </p>
          </div>
        </div>

        {/* Passo a passo */}
        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-[#231F20] mb-1">
            Passo a passo do algoritmo
          </h2>
          <p className="text-gray-500 text-sm mb-9">
            Cada etapa tem um papel técnico claro e impacto direto no resultado.
          </p>

          <div className="flex flex-col gap-5">
            {methodSteps.map((s) => (
              <div
                key={s.n}
                className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="min-w-[44px] h-11 bg-[#DB1E2F] text-white rounded-lg flex items-center justify-center font-black text-base">
                  {s.n}
                </div>
                <div>
                  <h4 className="font-bold text-[#231F20] text-sm mb-1">{s.title}</h4>
                  <p className="text-xs uppercase tracking-wide text-[#DB1E2F] font-bold mb-2">Por que existe</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{s.why}</p>
                  <p className="text-xs uppercase tracking-wide text-[#DB1E2F] font-bold mb-2">O que acontece</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{s.desc}</p>
                  {s.formulas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {s.formulas.map((formula) => (
                        <span
                          key={formula}
                          className="inline-block bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-serif text-sm text-gray-700"
                        >
                          {formula}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs uppercase tracking-wide text-[#DB1E2F] font-bold mt-4 mb-2">Efeito no ranking</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.impact}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-600 leading-relaxed">
              Quando as avaliações são qualitativas (ex.: &quot;bom&quot;, &quot;muito bom&quot;), o TOPSIS clássico exige
              conversão manual para números. O Fuzzy TOPSIS (Chen, 2000) resolve isso nativamente com
              variáveis linguísticas e números fuzzy triangulares.
            </p>
          </div>
        </div>

        {/* Exemplo prático */}
        <div className="mb-14 bg-gray-50 rounded-xl px-8 py-8">
          <h2 className="text-2xl font-extrabold text-[#231F20] mb-1">
            Exemplo prático (resumido)
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            Suponha a escolha de um fornecedor com 3 critérios: custo (40%), qualidade (35%) e prazo de entrega (25%).
            Custo e prazo são critérios de custo; qualidade é critério de benefício.
          </p>

          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Alternativa</th>
                  <th className="text-left px-4 py-3 font-semibold">Custo (R$)</th>
                  <th className="text-left px-4 py-3 font-semibold">Qualidade (0-10)</th>
                  <th className="text-left px-4 py-3 font-semibold">Prazo (dias)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-[#231F20]">A</td>
                  <td className="px-4 py-3 text-gray-600">12.000</td>
                  <td className="px-4 py-3 text-gray-600">8,0</td>
                  <td className="px-4 py-3 text-gray-600">20</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-[#231F20]">B</td>
                  <td className="px-4 py-3 text-gray-600">10.500</td>
                  <td className="px-4 py-3 text-gray-600">7,2</td>
                  <td className="px-4 py-3 text-gray-600">17</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-[#231F20]">C</td>
                  <td className="px-4 py-3 text-gray-600">11.300</td>
                  <td className="px-4 py-3 text-gray-600">9,1</td>
                  <td className="px-4 py-3 text-gray-600">23</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mt-5">
            Depois da normalização e ponderação, o TOPSIS calcula PIS/NIS, gera d⁺ e d⁻ para cada alternativa e converte em CC.
            A alternativa vencedora tende a equilibrar melhor os trade-offs, não necessariamente dominar todos os critérios individualmente.
          </p>
        </div>

        {/* Interpretacao */}
        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-[#231F20] mb-1">
            Como interpretar o ranking
          </h2>
          <p className="text-gray-500 text-sm mb-7">
            O resultado é um apoio quantitativo para decisão profissional, não um substituto de julgamento especialista.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {interpretationTips.map((tip) => (
              <div key={tip} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vantagens e limitações */}
        <div className="mb-14 grid sm:grid-cols-2 gap-5">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-black text-[#231F20] uppercase tracking-[2px] mb-4">Vantagens</h3>
            <ul className="space-y-3">
              {strengths.map((item) => (
                <li key={item} className="text-sm text-gray-600 leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-black text-[#231F20] uppercase tracking-[2px] mb-4">Limitacoes</h3>
            <ul className="space-y-3">
              {limitations.map((item) => (
                <li key={item} className="text-sm text-gray-600 leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-[#231F20] mb-1">
            Visualização geométrica do espaço de decisão
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Cada eixo representa um critério ponderado. A melhor alternativa equilibra proximidade à PIS e distância da NIS.
          </p>

          <AboutViewer3DLazy />

          <p className="text-gray-500 text-sm mt-4 leading-relaxed">
            Como este exemplo tem 3 critérios, os pontos são plotados diretamente no espaço tridimensional real —
            sem redução de dimensionalidade.
          </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stack.map((s) => (
              <div
                key={s.label}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center"
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
