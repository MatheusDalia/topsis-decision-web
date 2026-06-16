# TOPSIS Web — Sistema de Apoio à Decisão Multicritério

Aplicação web que implementa o método **TOPSIS** (*Technique for Order
Preference by Similarity to Ideal Solution*) para tomada de decisão
multicritério, permitindo que usuários comuns resolvam problemas de
decisão sem conhecimento técnico do método.

> Projeto da disciplina **Sistemas de Apoio à Decisão** — Fase 2
> (Semanas 11–15). Implementação e extensão de artigo científico de
> MCDM/MCDA.

## Artigo base

**Chen, C.T. (2000).** Extensions of the TOPSIS for group
decision-making under fuzzy environment. *Fuzzy Sets and Systems*,
114(1), 1–9.
[https://doi.org/10.1016/S0165-0114(97)00377-1](https://doi.org/10.1016/S0165-0114(97)00377-1)

Artigos complementares:
- Hwang, C.L. & Yoon, K. (1981). *Multiple Attribute Decision Making*. Springer.
- Hwang, C.L., Lai, Y.J. & Liu, T.Y. (1993). A new approach for multiple
  objective decision making. *Computers & OR*, 20(8), 889–899.
- Nădăban, S., Dzitac, S. & Dzitac, I. (2016). Fuzzy TOPSIS: A general view.
  *Procedia Computer Science*, 91, 823–831.

---

## 🌐 Demo

| Recurso | URL |
|---|---|
| Repositório | https://github.com/MatheusDalia/topsis-decision-web |
| Aplicação (Vercel) | https://topsis-decision-web.vercel.app |

---

## 🎯 Como o projeto estende o artigo base

O artigo de **Chen (2000)** propõe o **Fuzzy TOPSIS** com variáveis
linguísticas para decisões em grupo. Para este sistema didático,
adotamos o **exemplo de seleção de analista de sistemas (Seção 4)**
como base de validação, aplicando o TOPSIS clássico sobre os valores
**crisp** (centros dos números fuzzy triangulares) — abordagem comum
em ensino quando não há especialistas linguísticos disponíveis.

A partir desse núcleo, o projeto **estende** o trabalho original em:

- **Interface Web acessível**: usuários sem formação em MCDM
  configuram critérios, alternativas e pesos via formulário interativo,
  sem precisar montar a matriz manualmente.
- **Três métodos de normalização** lado a lado (vetorial, linear e
  min-max), permitindo ao usuário comparar o impacto da escolha no
  ranking — o artigo original usa apenas normalização linear.
- **Visualizações analíticas** dos resultados com Plotly: gráficos de
  barras, distâncias d⁺/d⁻, ranking comparativo e heatmap da matriz
  ponderada.
- **Visualização geométrica 3D** (Three.js) do espaço de decisão com
  PIS, NIS e alternativas plotados, incluindo redução por PCA para
  problemas com 4+ critérios — algo ausente em apresentações textuais
  do método.
- **Validação automatizada** (10/10 testes) reproduzindo o ranking
  esperado do artigo (A2 ≻ A3 ≻ A1).
- **API REST documentada** com Swagger/OpenAPI, expondo o algoritmo
  como serviço reutilizável.

---

## ✨ Funcionalidades

- ✅ Cadastro dinâmico de **alternativas** e **critérios**
- ✅ Suporte a critérios de **benefício** e **custo**
- ✅ Três métodos de **normalização** (vetorial, linear, min-max)
- ✅ Cálculo do **ranking** com coeficiente de proximidade `CCi`
- ✅ Visualizações analíticas com **gráficos interativos** (Plotly)
- ✅ Visualização **3D** com PIS/NIS e distâncias no `/about` (Three.js)
- ✅ Visualização espacial adaptativa no `/result`:
  - 2 critérios → plano 2D
  - 3 critérios → scatter 3D
  - 4–6 critérios → PCA 3D
  - 7+ critérios → coordenadas paralelas
- ✅ **Exportação CSV** dos resultados
- ✅ API REST documentada com **OpenAPI/Swagger**

---

## 🏗️ Arquitetura

```
topsis-decision-web/
├── backend/          # FastAPI + uv (Python 3.11)
│   ├── app/
│   │   ├── topsis.py    # algoritmo TOPSIS (numpy)
│   │   ├── services/    # serviços auxiliares (ex.: projeções)
│   │   ├── schemas.py   # Pydantic
│   │   └── main.py      # endpoints REST
│   └── tests/
└── frontend/         # Next.js 16 + React 19 + TailwindCSS
    └── src/
        ├── app/
        │   ├── page.tsx       # landing
        │   ├── about/         # explicação do método + viewer 3D
        │   ├── decision/      # formulário interativo
        │   └── result/        # ranking + dashboards analíticos
        └── components/        # viewers 3D e componentes reutilizáveis
```

### Stack técnico

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16, React 19, TailwindCSS, Plotly.js, Three.js |
| Backend | FastAPI, Pydantic, NumPy |
| Build | uv (Python), npm (Node 20+) |
| Deploy frontend | Vercel |
| Deploy backend | Railway / Render |

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Python 3.11+ com [uv](https://docs.astral.sh/uv/) instalado
- Node.js 20.9+ (recomendado: nvm com Node 20)

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

API disponível em `http://localhost:8000`. Documentação Swagger em
`http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
nvm use 20            # se usar nvm
cp .env.local.example .env.local
npm install
npm run dev
```

App disponível em `http://localhost:3000`.

Para validação de tipo/build:

```bash
cd frontend
npm run build
```

### Testes

```bash
cd backend
uv run pytest tests/ -v
```

---

## 📦 Dependências Python

Este projeto **não precisa** de `requirements.txt` para funcionamento local,
pois o backend usa `uv` com dependências declaradas em
`backend/pyproject.toml` e resolvidas em `backend/uv.lock`.

Use sempre:

```bash
cd backend
uv sync
```

---

## 📋 Como usar

1. Acesse a página inicial e clique em **"Iniciar uma decisão"**.
2. Cadastre os **critérios** (nome, peso, benefício/custo).
3. Cadastre as **alternativas** com seus valores.
4. (Opcional) Escolha o método de normalização.
5. Clique em **"Calcular ranking"** para ver os resultados.
6. Exporte o ranking em **CSV** para uso externo.

---

## 🧪 Validação científica

A implementação foi validada contra o exemplo da Seção 4 do artigo de
**Chen (2000)** — seleção de candidato para vaga de Analista de Sistemas
com 5 critérios e 3 candidatos. Resultado esperado: **A2 ≻ A3 ≻ A1**,
reproduzido com sucesso pelo backend (ver `tests/test_topsis.py`).

---

## 📦 Deploy

### Frontend (Vercel)
```bash
cd frontend
npx vercel
```
Configurar variável: `NEXT_PUBLIC_API_URL = <URL pública do backend>`.

### Backend (Railway) — host escolhido
1. Push para GitHub (já feito).
2. railway.com → **New Project** → **Deploy from GitHub repo** →
   selecionar `MatheusDalia/topsis-decision-web`.
3. Em **Settings** do serviço:
   - **Root Directory:** `backend`
   - **Watch Paths:** `backend/**`
4. `railway.json` já configura: build via Nixpacks, start command,
   healthcheck em `/health`.
5. **Generate Domain** em Settings → Networking → copiar URL.
6. (Opcional) Adicionar variável `PYTHON_VERSION=3.11.9` se Nixpacks
   não detectar automaticamente.

### Backend (alternativa: Render)
Configuração de fallback em `render.yaml` — basta apontar para o repo.

---

## ✅ Conformidade com requisitos da disciplina

| Requisito (Fase 2) | Status |
|---|---|
| Aplicação Web completa | ✅ Next.js 16 + FastAPI |
| Implementação completa do algoritmo MCDM | ✅ TOPSIS clássico, 3 normalizações, validado em testes |
| Interface intuitiva para alternativas e critérios | ✅ Formulário dinâmico em `/decision` |
| Visualização de resultados (gráficos + ranking) | ✅ Plotly + Three.js em `/result` e `/about` |
| Exportação dos resultados (PDF ou CSV) | ✅ CSV via `POST /api/v1/topsis/export.csv` |
| API REST documentada (opcional) | ✅ OpenAPI/Swagger em `/docs` |
| Replicação + extensão de artigo científico real | ✅ Ver seção *Como o projeto estende o artigo base* |
| Repositório Git público | ✅ [github.com/MatheusDalia/topsis-decision-web](https://github.com/MatheusDalia/topsis-decision-web) |
| Deploy em produção | ✅ [https://topsis-decision-web.vercel.app](https://topsis-decision-web.vercel.app) |
| Slides da apresentação final | ✅ [https://canva.link/bth9sakrgzyygk8](https://canva.link/bth9sakrgzyygk8) |

---

## 👥 Equipe

- Matheus Dalia
- José Luiz da Silva Neto
- Júlia Nunes
- Mayara Gomes

## 📄 Licença

Uso acadêmico — disciplina de Sistemas de Apoio à Decisão.
