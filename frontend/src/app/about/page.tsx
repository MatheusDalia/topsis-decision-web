import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-sky-700 hover:underline">
          ← Voltar
        </Link>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          Sobre o TOPSIS Web
        </h1>

        <div className="prose prose-slate mt-8 max-w-none">
          <h2>O que é TOPSIS?</h2>
          <p>
            <strong>TOPSIS</strong> (<em>Technique for Order Preference by
            Similarity to Ideal Solution</em>) é um dos métodos de decisão
            multicritério mais aplicados no mundo. Foi proposto por
            Hwang & Yoon em 1981, e desde então ganhou diversas extensões.
          </p>
          <p>
            O princípio é geometricamente intuitivo: a alternativa escolhida
            deve estar simultaneamente <strong>mais próxima da Solução Ideal
            Positiva (PIS)</strong> — formada pelos melhores valores de cada
            critério — e <strong>mais distante da Solução Ideal Negativa
            (NIS)</strong>, formada pelos piores valores.
          </p>

          <h2>Como o sistema funciona</h2>
          <ol>
            <li>O usuário cadastra alternativas e critérios.</li>
            <li>
              Para cada critério, define peso e tipo (benefício ou custo).
            </li>
            <li>
              O backend (FastAPI) executa o algoritmo TOPSIS: normalização,
              ponderação, cálculo das soluções ideais, distâncias Euclidianas
              e coeficiente de proximidade.
            </li>
            <li>
              O ranking final é exibido com gráficos e pode ser exportado
              para CSV.
            </li>
          </ol>

          <h2>Artigos de referência</h2>
          <ul>
            <li>
              Hwang, C.L. &amp; Yoon, K. (1981).{" "}
              <em>Multiple Attribute Decision Making</em>. Springer.
            </li>
            <li>
              Hwang, C.L., Lai, Y.J. &amp; Liu, T.Y. (1993). A new approach
              for multiple objective decision making.{" "}
              <em>Computers &amp; Operations Research</em>, 20(8), 889–899.
            </li>
            <li>
              Chen, C.T. (2000). Extensions of the TOPSIS for group
              decision-making under fuzzy environment.{" "}
              <em>Fuzzy Sets and Systems</em>, 114(1), 1–9.
            </li>
            <li>
              Nădăban, S., Dzitac, S. &amp; Dzitac, I. (2016). Fuzzy TOPSIS:
              A general view. <em>Procedia Computer Science</em>, 91, 823–831.
            </li>
          </ul>

          <h2>Stack técnico</h2>
          <ul>
            <li>Frontend: Next.js 16 + React 19 + TailwindCSS</li>
            <li>Backend: FastAPI (Python) + NumPy</li>
            <li>API: REST com OpenAPI/Swagger em <code>/docs</code></li>
          </ul>
        </div>
      </section>
    </main>
  );
}
