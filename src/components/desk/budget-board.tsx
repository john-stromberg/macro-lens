"use client";

import type { RiskBudget, TradeIdea } from "@/lib/data/types";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function BudgetBoard({
  budgets,
  ideas,
}: {
  budgets: RiskBudget[];
  ideas: TradeIdea[];
}) {
  const pipelineByFactor = ideas
    .filter((i) => i.status === "ready" || i.status === "working" || i.status === "draft")
    .reduce<Record<string, number>>((acc, idea) => {
      acc[idea.factor] = (acc[idea.factor] ?? 0) + Math.abs(idea.proposedRiskUsd);
      return acc;
    }, {});

  return (
    <section className="space-y-5 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] md:text-4xl">
          Risk budgets
        </h2>
        <p className="max-w-2xl text-[var(--ink-muted)]">
          Live factor usage versus desk limits, plus proposed risk still sitting in
          the trade-support queue.
        </p>
      </header>

      <div className="overflow-x-auto border border-[var(--ink-line)] bg-[var(--paper)]/80">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead className="bg-[var(--ink-wash)] text-left text-[11px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
            <tr>
              <th className="px-4 py-3 font-medium">Factor</th>
              <th className="px-4 py-3 font-medium text-right">Used</th>
              <th className="px-4 py-3 font-medium text-right">Limit</th>
              <th className="px-4 py-3 font-medium text-right">Headroom</th>
              <th className="px-4 py-3 font-medium text-right">Queue risk</th>
              <th className="px-4 py-3 font-medium">Utilization</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => {
              const headroom = budget.limitUsd - budget.usedUsd;
              const pct = Math.min(100, (budget.usedUsd / budget.limitUsd) * 100);
              const queue = pipelineByFactor[budget.factor] ?? 0;
              const tight = pct >= 80;
              return (
                <tr
                  key={budget.factor}
                  className="border-t border-[var(--ink-line)] hover:bg-[var(--ink-wash)]/60"
                >
                  <td className="px-4 py-3 font-mono text-xs uppercase text-[var(--ink)]">
                    {budget.factor}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">
                    {formatUsd(budget.usedUsd, true)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-[var(--ink-muted)]">
                    {formatUsd(budget.limitUsd, true)}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right font-mono tabular-nums",
                      headroom < budget.limitUsd * 0.2
                        ? "text-[var(--signal-ink)]"
                        : "text-[var(--up)]"
                    )}
                  >
                    {formatUsd(headroom, true)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-[var(--ink-muted)]">
                    {formatUsd(queue, true)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 bg-[var(--ink-wash)]">
                        <div
                          className={cn(
                            "h-full",
                            tight ? "bg-[var(--signal)]" : "bg-[var(--data)]"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs tabular-nums text-[var(--ink-faint)]">
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
