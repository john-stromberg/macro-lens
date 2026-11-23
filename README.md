# Macro Desk

Macro hedge fund platform with **two separate modules**:

- **PM desk** (`/pm`) — fund book, research theses, catalysts, scenarios, market tools
- **Trade support** (`/trade-support`) — portfolio-analyst queue, pre-trade checks, risk budgets, book context

The home page (`/`) is the module picker.

## PM dashboard

- **Book** — positions, factor risk, DTD/MTD/YTD P&L, AUM / gross / net / VaR
- **Research** — theses with conviction, catalysts, risks, and linked expressions
- **Calendar** — upcoming releases /!CBs / events with book relevance
- **Scenarios** — shock packs with estimated fund P&L winners and losers
- **Markets** — Pulse, Curve, Policy, Regimes, Tape

## Trade support dashboard

- **Queue** — trade ideas with status, urgency, checks, hedges
- **Budgets** — factor used / limit / headroom plus queue risk
- **Book context** — read-only positions for sizing
- **Calendar** — event risk for tickets in flight

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
