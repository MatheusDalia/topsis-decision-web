# AGENTS.md

## Repo layout (no root task runner)
- `backend/` is a standalone FastAPI + `uv` project (Python 3.11).
- `frontend/` is a standalone Next.js 16 app (Node/NPM).
- Run commands from each subdirectory; there are no root `package.json` or Python tasks.

## Verified dev commands
- Backend setup: `cd backend && uv sync`
- Backend API dev server: `cd backend && uv run uvicorn app.main:app --reload`
- Backend tests: `cd backend && uv run pytest tests -v`
- Run one backend test: `cd backend && uv run pytest tests/test_topsis.py::test_chen_2000_example_ranking -v`
- Frontend setup: `cd frontend && npm install`
- Frontend dev server: `cd frontend && npm run dev`
- Frontend checks: `cd frontend && npm run lint` and `cd frontend && npm run build` (build is the practical TS/type safety check here).

## API + frontend contract that must stay aligned
- Frontend client is in `frontend/src/lib/api.ts`.
- Backend base URL comes from `NEXT_PUBLIC_API_URL` and defaults to `http://localhost:8000`.
- Frontend relies on `POST /api/v1/topsis` and `POST /api/v1/topsis/export.csv`.
- Keep response fields used by UI stable: `ranking`, `pis`, `nis`, `normalized_matrix`, `weighted_matrix`, `criteria_names`, `alternative_names`.

## Behavior constraints already enforced in code
- Criteria weights are validated server-side to sum to ~1.0 (`0.99..1.01`) in `backend/app/schemas.py`.
- Alternative values are validated as non-negative in `backend/app/schemas.py`.
- Decision UI mirrors the weight-sum rule and blocks submission when invalid (`frontend/src/app/decision/page.tsx`).

## Easy-to-miss gotchas
- `frontend/src/app/page.tsx`, `frontend/src/app/decision/page.tsx`, and `frontend/src/app/result/page.tsx` contain large commented legacy versions above the active code; edit the active implementation, not the commented block.
- Backend CORS is currently hardcoded to `http://localhost:3000` in `backend/app/main.py`; cross-origin deploy issues usually come from this.
- `frontend/AGENTS.md` contains a local rule: treat Next.js 16 as potentially breaking and check local Next docs before framework-level changes.
