# Macro Desk

PM and research system for a discretionary macro hedge fund: fund book, theses, catalyst calendar, scenario P&L, plus market tools (surprises, curves, policy, regimes, tape).

## Workspaces

- **Book** — positions, factor risk, DTD/MTD/YTD P&L, AUM / gross / net / VaR
- **Research** — theses with conviction, catalysts, risks, and linked expressions
- **Calendar** — upcoming releases / CBs / events with book relevance
- **Scenarios** — shock packs with estimated fund P&L winners and losers
- **Markets** — Pulse, Curve, Policy, Regimes, Tape

Ships with labeled **sample data**. Wire OMS / risk / FRED / Haver / Bloomberg in `src/lib/data/provider.ts` when ready.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3847](http://127.0.0.1:3847).

```bash
npm run build
npm start
```

### Static portfolio demo

```bash
STATIC_EXPORT=1 npm run build
```

Writes a static site to `out/` with `basePath` `/macro-desk` for hosting under
[john-stromberg.github.io/macro-desk](https://john-stromberg.github.io/macro-desk/).

## Stack

Next.js, TypeScript, Tailwind CSS, shadcn/ui, Recharts.
