"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { RegimePoint } from "@/lib/data/types";
import { formatSigned } from "@/lib/format";

function toPct(value: number, min: number, max: number) {
  const clamped = Math.min(max, Math.max(min, value));
  return ((clamped - min) / (max - min)) * 100;
}

function shortCode(economy: string) {
  if (economy === "Euro area") return "EA";
  if (economy === "United States" || economy === "US") return "US";
  return economy.slice(0, 2).toUpperCase();
}

export function RegimeMap({ regimes }: { regimes: RegimePoint[] }) {
  const growthMin = -1.5;
  const growthMax = 2.5;
  const inflationMin = -1.5;
  const inflationMax = 1.5;

  return (
    <section className="space-y-5 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] md:text-4xl">
          Growth–inflation map
        </h2>
        <p className="max-w-2xl text-[var(--ink-muted)]">
          Z-scored growth and inflation versus each economy&apos;s recent history.
          Top-right is expansion with rising prices; bottom-left is soft and disinflationary.
        </p>
      </header>

      <div className="border border-[var(--ink-line)] bg-[var(--paper)]/80 p-4 md:p-6">
        <div className="relative mx-auto aspect-square w-full max-w-2xl overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            <Quad
              title="Stagflation risk"
              className="border-r border-b border-[var(--ink-line)] bg-[var(--down-soft)]/35"
            />
            <Quad
              title="Overheating"
              className="border-b border-[var(--ink-line)] bg-[var(--signal-soft)]/50"
            />
            <Quad
              title="Soft / disinflation"
              className="border-r border-[var(--ink-line)] bg-[var(--data-soft)]/40"
            />
            <Quad title="Goldilocks" className="bg-[var(--up-soft)]/35" />
          </div>

          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-[var(--ink)]/25" />
          <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-[var(--ink)]/25" />

          <p className="absolute left-3 top-3 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Higher inflation
          </p>
          <p className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Stronger growth →
          </p>

          <TooltipProvider>
            {regimes.map((point) => {
              const left = toPct(point.growth, growthMin, growthMax);
              const bottom = toPct(point.inflation, inflationMin, inflationMax);
              return (
                <Tooltip key={point.id}>
                  <TooltipTrigger
                    className="absolute z-10 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-[var(--paper)] bg-[var(--ink)] px-2 py-1 font-mono text-[11px] text-[var(--paper)] shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--data)]"
                    style={{ left: `${left}%`, bottom: `${bottom}%` }}
                  >
                    {shortCode(point.economy)}
                  </TooltipTrigger>
                  <TooltipContent className="rounded-sm border border-[var(--ink-line)] bg-[var(--paper)] text-[var(--ink)]">
                    <div className="space-y-1">
                      <p className="font-medium">{point.economy}</p>
                      <p className="font-mono text-xs">
                        Growth {formatSigned(point.growth, 1)} · Inflation{" "}
                        {formatSigned(point.inflation, 1)}
                      </p>
                      <p className="font-mono text-xs opacity-70">
                        MoM Δ g {formatSigned(point.growthMom, 1)} / π{" "}
                        {formatSigned(point.inflationMom, 1)}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
    </section>
  );
}

function Quad({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="p-3 text-[11px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
        {title}
      </p>
    </div>
  );
}
