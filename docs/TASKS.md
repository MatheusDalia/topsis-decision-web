# TOPSIS Web — Roadmap de Tarefas

Status: ✅ feito · 🟡 em andamento · ⬜ pendente

## Semana 11 — Protótipo (28/05)
- [x] ✅ Algoritmo TOPSIS no backend (`app/topsis.py`)
- [x] ✅ Endpoints REST (`/api/v1/topsis`, `/health`, `/export.csv`)
- [x] ✅ Pydantic schemas + validação
- [x] ✅ 10 testes unitários e de integração (todos passando)
- [x] ✅ Layout do frontend (Next.js + Tailwind)
- [x] ✅ Páginas: home, about, decision, result
- [x] ✅ Cliente HTTP do frontend (`lib/api.ts`)
- [x] ✅ Visualização: gráficos de CCi e distâncias (Recharts)
- [x] ✅ Exportação CSV
- [x] ✅ Spec-kit constitution + docs

## Semana 12 — Integração (02–04/06)
- [x] ✅ Integração frontend ↔ backend (já feita no protótipo)
- [ ] ⬜ Testar fluxo completo manualmente em navegador real
- [ ] ⬜ Adicionar tratamento de erros mais detalhado
- [ ] ⬜ Loading skeletons / estados intermediários
- [ ] ⬜ Validação client-side (pesos somando, valores numéricos)
- [ ] ⬜ Adicionar exemplo "Chen 2000" pré-carregado para demo

## Semanas 13–14 — Deploy e refinamento (09–11/06)
- [ ] ⬜ Criar repositório no GitHub (público)
- [ ] ⬜ Push inicial
- [ ] ⬜ Deploy do backend no Railway/Render
- [ ] ⬜ Deploy do frontend na Vercel
- [ ] ⬜ Configurar `NEXT_PUBLIC_API_URL` apontando para backend produção
- [ ] ⬜ Atualizar README com URLs públicas
- [ ] ⬜ Print do Swagger em produção
- [ ] ⬜ Slides da apresentação final (10 min)
- [ ] ⬜ Ensaio cronometrado

## Semana 15 — Apresentação (16/06 e 18/06)
- [ ] ⬜ Apresentação para a turma

## Backlog (extensões possíveis se sobrar tempo)
- [ ] Implementar Fuzzy TOPSIS de Chen 2000 com FNs triangulares
- [ ] Suporte a múltiplos decisores (group decision)
- [ ] Persistência de decisões (SQLite/Postgres)
- [ ] Análise de sensibilidade (variar pesos e ver impacto)
- [ ] Exportação para PDF além de CSV
- [ ] Modo dark
