# Macro Desk

Research tools for reading the macro cycle: release surprises, yield curves, central-bank policy paths, growth–inflation regimes, and the cross-asset tape.

## Tools

- **Pulse** — actual vs consensus for key releases, filterable by region
- **Curve** — spot UST against a prior session or Bunds, with 2s10s slope
- **Policy** — policy rates and step paths for Fed, ECB, BoE, BoJ, RBA
- **Regimes** — growth/inflation quadrant map across major economies
- **Tape** — ranked cross-asset moves over 1W / 1M / YTD

The first cut ships with labeled **sample data**. Swap in a live adapter in `src/lib/data/provider.ts` when you have a vendor feed (FRED, Haver, Bloomberg, etc.).

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

## Stack

Next.js, TypeScript, Tailwind CSS, shadcn/ui, Recharts.
