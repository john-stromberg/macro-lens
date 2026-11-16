"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { Scenario } from "@/lib/data/types";
import { formatSignedUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ScenarioLab({ scenarios }: { scenarios: Scenario[] }) {
  const [activeId, setActiveId] = useState(scenarios[0]?.id ?? "");
  const active = useMemo(
    () => scenarios.find((s) => s.id === activeId) ?? scenarios[0],
    [activeId, scenarios]
  );

  if (!active) {
    return (
      <div className="border border-dashed border-[var(--ink-line)] px-4 py-10 text-center text-[var(--ink-muted)]">
        No scenarios loaded.
      </div>
    );
  }

  return (
    <section className="space-y-5 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] md:text-4xl">
          Scenario lab
        </h2>
        <p className="max-w-2xl text-[var(--ink-muted)]">
          Desk-level shock packs with estimated book P&amp;L. Use these in
          pre-mortems and risk committee — not as a full Monte Carlo engine.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {scenarios.map((scenario) => {
          const selected = scenario.id === active.id;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setActiveId(scenario.id)}
              className={cn(
                "border px-4 py-3 text-left transition-all",
                selected
                  ? "border-[var(--data)] bg-[var(--data-soft)] shadow-[inset_3px_0_0_var(--data)]"
                  : "border-[var(--ink-line)] bg-[var(--paper)]/70 hover:border-[var(--ink-muted)]"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-[var(--ink)]">{scenario.name}</p>
                <p
                  className={cn(
                    "shrink-0 font-mono text-sm tabular-nums font-medium",
                    scenario.estimatedPnlUsd >= 0
                      ? "text-[var(--up)]"
                      : "text-[var(--down)]"
                  )}
                >
                  {formatSignedUsd(scenario.estimatedPnlUsd)}
                </p>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-[var(--ink-muted)]">
                {scenario.description}
              </p>
            </button>
          );
        })}
      </div>

      <article className="border border-[var(--ink-line)] bg-[var(--paper)]/80 p-4 md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              Estimated book impact
            </p>
            <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {active.name}
            </h3>
          </div>
          <p
            className={cn(
              "font-mono text-3xl tabular-nums font-medium",
              active.estimatedPnlUsd >= 0 ? "text-[var(--up)]" : "text-[var(--down)]"
            )}
          >
            {formatSignedUsd(active.estimatedPnlUsd)}
          </p>
        </div>
        <p className="mt-3 max-w-3xl text-[var(--ink-muted)] leading-relaxed">
          {active.description}
        </p>

        <div className="mt-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Shocks
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {active.shocks.map((shock) => (
              <Badge
                key={`${shock.label}-${shock.move}`}
                variant="outline"
                className="rounded-sm font-mono text-xs"
              >
                {shock.label} {shock.move}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <OutcomeList title="Winners" items={active.winners} tone="up" />
          <OutcomeList title="Losers" items={active.losers} tone="down" />
        </div>
      </article>
    </section>
  );
}

function OutcomeList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "up" | "down";
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
        {title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              "text-sm",
              tone === "up" ? "text-[var(--up)]" : "text-[var(--down)]"
            )}
          >
            · {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
