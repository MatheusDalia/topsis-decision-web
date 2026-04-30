# TOPSIS Web — Especificação do Projeto

## 1. Objetivo
Implementar uma aplicação Web completa que replica e estende os
resultados do artigo de **Chen (2000)** sobre TOPSIS em ambiente fuzzy,
permitindo a usuários comuns resolverem problemas de decisão
multicritério sem conhecer a matemática do método.

## 2. Escopo

### 2.1 Dentro do escopo
- TOPSIS clássico (Hwang & Yoon, 1981) com distância Euclidiana (p=2)
- Múltiplos métodos de normalização (vetorial, linear, min-max)
- Critérios de benefício e custo
- Pesos arbitrários (auto-normalizados pelo backend)
- Interface web responsiva
- Visualização gráfica (CCi, distâncias)
- Exportação CSV

### 2.2 Extensão (em relação ao artigo)
O artigo de Chen (2000) usa números fuzzy triangulares e múltiplos
decisores. Nossa extensão:
- **Normaliza a interação** — usuário comum não cadastra fuzzy numbers,
  e sim valores crisp em escala arbitrária.
- **Generaliza a normalização** — três métodos selecionáveis em vez do
  método único do paper.
- **Adiciona auditabilidade** — todas as matrizes intermediárias
  (normalizada, ponderada, PIS, NIS) são retornadas pela API.

### 2.3 Fora do escopo
- Fuzzy TOPSIS completo (números triangulares/trapezoidais como input)
- Múltiplos decisores e agregação de opiniões
- Persistência (decisões são por sessão)
- Autenticação

## 3. Requisitos Funcionais

| ID | Descrição |
|----|-----------|
| RF1 | Usuário pode cadastrar N alternativas (N ≥ 2) |
| RF2 | Usuário pode cadastrar M critérios (M ≥ 1) |
| RF3 | Cada critério tem nome, peso ≥ 0, e tipo (benefício/custo) |
| RF4 | Sistema valida que cada alternativa tem M valores |
| RF5 | Sistema calcula ranking via TOPSIS |
| RF6 | Sistema exibe ranking ordenado, CCi, d* e d⁻ |
| RF7 | Sistema exibe gráfico de barras de CCi |
| RF8 | Sistema exibe gráfico comparativo de d* e d⁻ |
| RF9 | Sistema permite exportar resultado em CSV |
| RF10 | API REST documentada via Swagger em `/docs` |

## 4. Requisitos Não-Funcionais

| ID | Descrição |
|----|-----------|
| RNF1 | Tempo de resposta da API < 500 ms para até 100 alts × 50 crit |
| RNF2 | Frontend deve renderizar em < 2 s na primeira visita |
| RNF3 | Aplicação deve estar acessível em ambiente público |
| RNF4 | Código fonte deve estar em repositório Git público |

## 5. Modelo de dados (API contract)

```jsonc
// POST /api/v1/topsis
{
  "criteria": [
    { "name": "Custo",     "weight": 0.4, "type": "cost" },
    { "name": "Qualidade", "weight": 0.6, "type": "benefit" }
  ],
  "alternatives": [
    { "name": "A", "values": [100, 8] },
    { "name": "B", "values": [80,  6] }
  ],
  "normalization": "vector"  // | "linear" | "minmax"
}
```

```jsonc
// 200 OK
{
  "ranking": [
    { "rank": 1, "name": "B", "closeness": 0.78, "distance_to_pis": 0.12, "distance_to_nis": 0.43 },
    { "rank": 2, "name": "A", "closeness": 0.34, "distance_to_pis": 0.31, "distance_to_nis": 0.16 }
  ],
  "pis": [...], "nis": [...],
  "normalized_matrix": [[...], [...]],
  "weighted_matrix":   [[...], [...]],
  "criteria_names":    ["Custo", "Qualidade"],
  "alternative_names": ["A", "B"]
}
```

## 6. Critérios de Aceite

- [ ] `pytest` passa todos os testes (10 testes mínimos)
- [ ] Exemplo Chen (2000) reproduzido fielmente: A2 > A3 > A1
- [ ] `npm run build` no frontend sem erros
- [ ] `/health` retorna 200
- [ ] Aplicação deployada em URL pública
- [ ] README com link para artigo base

## 7. Cronograma

| Semana | Entrega |
|---|---|
| 11 (28/05) | ✅ Algoritmo + arquitetura + protótipo de UI |
| 12 (02–04/06) | Integração frontend ↔ backend (já feito no protótipo) |
| 13–14 (09–11/06) | Refinamentos + deploy + slides |
| 15 (16–18/06) | Apresentação final |
