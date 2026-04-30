import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-700">
            Sistemas de Apoio à Decisão
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            TOPSIS Web
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Tome decisões multicritério rápidas, transparentes e auditáveis.
            Defina alternativas, atribua pesos e descubra o ranking ideal —
            sem precisar entender a matemática por trás.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/decision"
              className="rounded-md bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-sky-800 transition"
            >
              Iniciar uma decisão
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold leading-6 text-slate-700 hover:text-slate-900"
            >
              Saiba mais →
            </Link>
          </div>
        </div>

        <div className="mt-24 grid gap-8 sm:grid-cols-3">
          {[
            {
              t: "1. Cadastre alternativas",
              d: "Liste as opções que você está avaliando — fornecedores, candidatos, locais.",
            },
            {
              t: "2. Defina os critérios",
              d: "Escolha o que importa: custo, qualidade, prazo. Atribua pesos e indique se é benefício ou custo.",
            },
            {
              t: "3. Veja o ranking",
              d: "O sistema calcula o ranking via TOPSIS e mostra gráficos. Exporte em CSV.",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">{c.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{c.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 rounded-lg bg-slate-900 p-8 text-white">
          <h2 className="text-2xl font-bold">Baseado em ciência</h2>
          <p className="mt-3 text-slate-300">
            O método TOPSIS foi proposto por{" "}
            <em>Hwang & Yoon (1981)</em> e estendido por{" "}
            <em>Chen (2000)</em> para ambientes fuzzy. Esta aplicação
            implementa o algoritmo clássico (Euclidiano, p=2) com 3
            opções de normalização.
          </p>
        </div>
      </section>
    </main>
  );
}
