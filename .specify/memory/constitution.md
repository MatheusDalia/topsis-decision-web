# TOPSIS Web Constitution

## Core Principles

### I. Algoritmo correto antes de UI bonita
A correção matemática do método TOPSIS é **inegociável**. Toda mudança no
módulo `backend/app/topsis.py` deve ser acompanhada de testes que
validem contra exemplos publicados (especialmente Chen 2000). Apenas
após o algoritmo passar nos testes pode-se evoluir a interface.

### II. Frontend e backend independentes
O backend é uma API REST stateless. O frontend consome esta API e não
contém lógica de negócio do método.

### III. Test-first nos cálculos
Toda função em `topsis.py` precisa de teste correspondente em `tests/`.
Cobertura mínima: caso clássico (Hwang & Yoon), caso Chen 2000,
validação de inputs inválidos, normalização de pesos.

### IV. Contrato API documentado
Endpoints REST precisam de Pydantic schemas que geram OpenAPI
automaticamente. Mudanças no contrato são breaking changes e exigem
versionamento (`/api/v1`).

### V. Reproducibilidade científica
O sistema deve permitir reproduzir, célula por célula, os exemplos do
artigo base.

## Stack Constraints

- **Frontend:** Next.js 16 + React 19 + TailwindCSS + Recharts
- **Backend:** FastAPI + Pydantic + NumPy + uv
- **Node:** 20.9+ (`.nvmrc`); **Python:** 3.11+
- **Deploy:** Vercel (frontend) + Railway/Render (backend)

## Development Workflow

1. Feature começa por spec descrevendo entrada/saída.
2. Tests primeiro no backend; depois implementação; depois UI.
3. PR exige: testes verdes, build do frontend OK, README atualizado.
4. Commits prefixados (`backend:`, `frontend:`, `docs:`, `infra:`).

**Versão:** 1.0.0 · **Adotada em:** 2026-04-29
