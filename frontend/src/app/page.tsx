// import Link from "next/link";

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
//       <section className="mx-auto max-w-5xl px-6 py-20">
//         <div className="text-center">
//           <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-700">
//             Sistemas de Apoio à Decisão
//           </p>
//           <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
//             TOPSIS Web
//           </h1>
//           <p className="mt-6 text-lg leading-8 text-slate-600">
//             Tome decisões multicritério rápidas, transparentes e auditáveis.
//             Defina alternativas, atribua pesos e descubra o ranking ideal —
//             sem precisar entender a matemática por trás.
//           </p>
//           <div className="mt-10 flex items-center justify-center gap-4">
//             <Link
//               href="/decision"
//               className="rounded-md bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-sky-800 transition"
//             >
//               Iniciar uma decisão
//             </Link>
//             <Link
//               href="/about"
//               className="text-sm font-semibold leading-6 text-slate-700 hover:text-slate-900"
//             >
//               Saiba mais →
//             </Link>
//           </div>
//         </div>

//         <div className="mt-24 grid gap-8 sm:grid-cols-3">
//           {[
//             {
//               t: "1. Cadastre alternativas",
//               d: "Liste as opções que você está avaliando — fornecedores, candidatos, locais.",
//             },
//             {
//               t: "2. Defina os critérios",
//               d: "Escolha o que importa: custo, qualidade, prazo. Atribua pesos e indique se é benefício ou custo.",
//             },
//             {
//               t: "3. Veja o ranking",
//               d: "O sistema calcula o ranking via TOPSIS e mostra gráficos. Exporte em CSV.",
//             },
//           ].map((c) => (
//             <div
//               key={c.t}
//               className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
//             >
//               <h3 className="text-lg font-semibold text-slate-900">{c.t}</h3>
//               <p className="mt-2 text-sm text-slate-600">{c.d}</p>
//             </div>
//           ))}
//         </div>

//         <div className="mt-24 rounded-lg bg-slate-900 p-8 text-white">
//           <h2 className="text-2xl font-bold">Baseado em ciência</h2>
//           <p className="mt-3 text-slate-300">
//             O método TOPSIS foi proposto por{" "}
//             <em>Hwang & Yoon (1981)</em> e estendido por{" "}
//             <em>Chen (2000)</em> para ambientes fuzzy. Esta aplicação
//             implementa o algoritmo clássico (Euclidiano, p=2) com 3
//             opções de normalização.
//           </p>
//         </div>
//       </section>
//     </main>
//   );
// }
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">

      {/* ── NAV ── */}
      <nav className="bg-[#231F20] px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#DB1E2F] rounded-md flex items-center justify-center text-white font-black text-sm">
            T
          </div>
          <div>
            <span className="text-white font-bold text-sm tracking-wide">TOPSIS Web</span>
            <span className="text-gray-500 text-xs block leading-none mt-0.5">Sistemas de Informação · CIn-UFPE</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/decision"
            className="bg-[#DB1E2F] hover:bg-[#AF0421] text-white text-sm font-semibold px-5 py-2 rounded-md transition"
          >
            Iniciar decisão →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-[#231F20] px-10 pt-20 pb-24 relative overflow-hidden">
        {/* glow decorativo */}
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-[#DB1E2F] opacity-[0.07] pointer-events-none" />
        {/* linha inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#DB1E2F] via-[#DB1E2F]/30 to-transparent" />

        <div className="max-w-5xl mx-auto">
          {/* badge */}
          <div className="inline-flex items-center gap-2 bg-[#DB1E2F]/10 border border-[#DB1E2F]/25 text-[#fb9fa7] text-xs font-bold px-3 py-1.5 rounded-full mb-7 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-[#DB1E2F] rounded-full" />
            Sistemas de Apoio à Decisão - Grupo 1
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.08] mb-5">
            Decisões <span className="text-[#DB1E2F]">multicritério</span>
            <br />com ciência por trás
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-11">
            Defina alternativas, atribua pesos e descubra o ranking ideal com
            o método TOPSIS. Transparente, auditável e sem precisar entender
            a matemática.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/decision"
              className="bg-[#DB1E2F] hover:bg-[#AF0421] text-white font-bold text-sm px-8 py-4 rounded-lg transition"
            >
              Iniciar uma decisão →
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-white text-sm font-medium px-5 py-4 border border-gray-700 hover:border-gray-500 rounded-lg transition"
            >
              Saiba mais sobre o método
            </Link>
          </div>

          {/* stats */}
          <div className="mt-16 pt-10 border-t border-white/10 flex gap-12">
            {[
              { n: "3+", label: "Métodos de normalização" },
              { n: "∞",  label: "Critérios e alternativas" },
              { n: "CSV", label: "Exportação de resultados" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black text-white">{s.n}</div>
                <div className="text-gray-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="bg-gray-50 px-10 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#DB1E2F] text-xs font-bold uppercase tracking-[3px] mb-3">
            Como funciona
          </p>
          <h2 className="text-3xl font-extrabold text-[#231F20] mb-12">
            Três passos para a decisão ideal
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                n: "1",
                emoji: "📋",
                title: "Cadastre alternativas",
                desc: "Liste as opções que você está avaliando — fornecedores, candidatos, locais ou qualquer conjunto de escolhas.",
              },
              {
                n: "2",
                emoji: "⭐",
                title: "Defina os critérios",
                desc: "Escolha o que importa: custo, qualidade, prazo. Atribua pesos e indique se cada critério é benefício ou custo.",
              },
              {
                n: "3",
                emoji: "📊",
                title: "Veja o ranking",
                desc: "O sistema calcula via TOPSIS e exibe gráficos, coeficientes de proximidade e matrizes. Exporte em CSV.",
              },
            ].map((c) => (
              <div
                key={c.n}
                className="bg-white rounded-xl border border-gray-200 p-8 relative overflow-hidden hover:shadow-md transition"
              >
                {/* número decorativo */}
                <span className="absolute -top-3 right-4 text-[96px] font-black text-[#DB1E2F]/5 leading-none select-none">
                  {c.n}
                </span>
                <div className="w-12 h-12 bg-[#DB1E2F] rounded-xl flex items-center justify-center text-2xl mb-5">
                  {c.emoji}
                </div>
                <h3 className="text-base font-bold text-[#231F20] mb-2">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BASEADO EM CIÊNCIA ── */}
      <section className="bg-[#231F20] px-10 py-20">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#DB1E2F] text-xs font-bold uppercase tracking-[3px] mb-3">
              Fundamentação
            </p>
            <h2 className="text-3xl font-extrabold text-white mb-5">
              Baseado em ciência consolidada
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              O método TOPSIS foi proposto por Hwang & Yoon (1981) e é um dos
              métodos de decisão multicritério mais aplicados no mundo. Esta
              aplicação implementa o algoritmo clássico com distância Euclidiana
              (p=2) e oferece 3 opções de normalização.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Vetorial (TOPSIS clássico)", "Linear (Chen 2000)", "Min-Max"].map((t) => (
                <span
                  key={t}
                  className="bg-[#DB1E2F]/10 border border-[#DB1E2F]/20 text-[#fb9fa7] text-xs font-semibold px-3 py-1.5 rounded-md"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* fórmula */}
          <div className="bg-black/30 border border-white/10 border-l-[3px] border-l-[#DB1E2F] rounded-xl p-7">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] mb-5">
              Coeficiente de Proximidade
            </p>
            <div className="text-white text-2xl font-serif text-center py-4 border-b border-white/10 mb-5">
              CCᵢ = dᵢ⁻ / (dᵢ⁺ + dᵢ⁻)
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-xs font-serif">
                d<sup className="text-[#DB1E2F]">+</sup> = distância à Solução Ideal Positiva (PIS)
              </p>
              <p className="text-gray-400 text-xs font-serif">
                d<sup className="text-[#DB1E2F]">−</sup> = distância à Solução Ideal Negativa (NIS)
              </p>
              <p className="text-gray-600 text-xs italic mt-3">
                Quanto maior CCᵢ, melhor a alternativa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#111] px-10 py-8 border-t border-white/5">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600 text-xs">© 2026 TOPSIS Web | Projeto SAD</p>
          <div className="flex items-center gap-2 text-gray-600 text-xs">
            <span className="w-2 h-2 bg-[#DB1E2F] rounded-full" />
            Centro de Informática · UFPE
          </div>
        </div>
        <div className="border-t border-white/5 pt-4">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-2">Grupo</p>
          <p className="text-gray-500 text-xs">
            José Luiz Silva · Júlia Nunes · Matheus Dalia · Mayara Gomes
          </p>
        </div>
      </footer>

    </main>
  );
}

