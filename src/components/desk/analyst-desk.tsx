"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  RiskBudget,
  Thesis,
  TradeCheckStatus,
  TradeIdea,
  TradeIdeaStatus,
} from "@/lib/data/types";
import { formatDateTimePT, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const statuses: Array<TradeIdeaStatus | "all"> = [
  "all",
  "ready",
  "working",
  "draft",
  "filled",
  "killed",
];

export function AnalystDesk({
  ideas,
  budgets,
  theses,
}: {
  ideas: TradeIdea[];
  budgets: RiskBudget[];
  theses: Thesis[];
}) {
  const [status, setStatus] = useState<(typeof statuses)[number]>("all");
  const [activeId, setActiveId] = useState(ideas[0]?.id ?? "");

  const thesisById = useMemo(
    () => Object.fromEntries(theses.map((t) => [t.id, t])),
    [theses]
  );

  const filtered = useMemo(
    () => ideas.filter((idea) => status === "all" || idea.status === status),
    [ideas, status]
  );

  const active =
    filtered.find((idea) => idea.id === activeId) ?? filtered[0] ?? ideas[0];

  const readyCount = ideas.filter((i) => i.status === "ready").length;
  const warnCount = ideas.filter((i) =>
    i.checks.some((c) => c.status === "warn" || c.status === "fail")
  ).length;

  if (!active) {
    return (
      <div className="border border-dashed border-[var(--ink-line)] px-4 py-10 text-center text-[var(--ink-muted)]">
        No trade ideas in the queue.
      </div>
    );
  }

  return (
    <section className="space-y-5 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] md:text-4xl">
          Trade support
        </h2>
        <p className="max-w-2xl text-[var(--ink-muted)]">
          Portfolio-analyst queue: proposed tickets, pre-trade checks, risk-budget
          headroom, and hedge notes for the PM.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="In queue" value={String(ideas.length)} hint="All statuses" />
        <Metric
          label="Ready for PM"
          value={String(readyCount)}
          hint="Passed or warned — actionable"
        />
        <Metric
          label="Needs attention"
          value={String(warnCount)}
          hint="Ideas with warn or fail checks"
        />
      </div>

      <div className="border border-[var(--ink-line)] bg-[var(--paper)]/80 p-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          Risk budgets (used / limit)
        </p>
        <ul className="mt-3 space-y-2">
          {budgets.map((budget) => {
            const pct = Math.min(100, (budget.usedUsd / budget.limitUsd) * 100);
            const tight = pct >= 80;
            return (
              <li
                key={budget.factor}
                className="grid grid-cols-[88px_1fr_110px] items-center gap-3"
              >
                <span className="font-mono text-xs uppercase text-[var(--ink-muted)]">
                  {budget.factor}
                </span>
                <div className="h-2 bg-[var(--ink-wash)]">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      tight ? "bg-[var(--signal)]" : "bg-[var(--data)]"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-right font-mono text-xs tabular-nums text-[var(--ink)]">
                  {formatUsd(budget.usedUsd, true)} / {formatUsd(budget.limitUsd, true)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={status === item ? "default" : "outline"}
            className="rounded-sm capitalize"
            onClick={() => setStatus(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-[var(--ink-line)] px-4 py-10 text-center text-[var(--ink-muted)]">
          No ideas in this status. Switch filter to see the queue.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          <ul className="divide-y divide-[var(--ink-line)] border border-[var(--ink-line)] bg-[var(--paper)]/80">
            {filtered.map((idea) => {
              const selected = idea.id === active.id;
              const worst = worstCheck(idea);
              return (
                <li key={idea.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(idea.id)}
                    className={cn(
                      "w-full px-4 py-3 text-left transition-colors",
                      selected
                        ? "bg-[var(--data-soft)] shadow-[inset_3px_0_0_var(--data)]"
                        : "hover:bg-[var(--ink-wash)]/70"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-[var(--ink)]">{idea.name}</p>
                      <StatusBadge status={idea.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-sm px-1.5 py-0 font-mono text-[10px] uppercase",
                          idea.side === "long"
                            ? "border-[var(--up)]/30 text-[var(--up)]"
                            : "border-[var(--down)]/30 text-[var(--down)]"
                        )}
                      >
                        {idea.side}
                      </Badge>
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                        {idea.urgency} · {idea.factor}
                      </span>
                      <CheckDot status={worst} />
                    </div>
                    <p className="mt-2 font-mono text-xs tabular-nums text-[var(--ink-muted)]">
                      {formatUsd(idea.proposedNotionalUsd, true)} notional ·{" "}
                      {formatUsd(idea.proposedRiskUsd, true)} risk
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>

          <article className="border border-[var(--ink-line)] bg-[var(--paper)]/80 p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                  {active.analyst} · {formatDateTimePT(active.createdAt)}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                  {active.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-[var(--ink-muted)]">
                  {active.ticker} · {active.region} · {active.sleeve}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={active.status} />
                <Badge variant="outline" className="rounded-sm capitalize">
                  {active.urgency}
                </Badge>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniStat
                label="Proposed notional"
                value={formatUsd(active.proposedNotionalUsd, true)}
              />
              <MiniStat
                label="Proposed risk $"
                value={formatUsd(active.proposedRiskUsd, true)}
              />
            </div>

            <p className="mt-4 text-[var(--ink-muted)] leading-relaxed">
              {active.rationale}
            </p>

            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                Linked thesis
              </p>
              <p className="mt-1 text-sm text-[var(--ink)]">
                {active.thesisId && thesisById[active.thesisId]
                  ? thesisById[active.thesisId].title
                  : "Unassigned"}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                Pre-trade checks
              </p>
              <ul className="mt-2 space-y-2">
                {active.checks.map((check) => (
                  <li
                    key={check.id}
                    className="border-t border-[var(--ink-line)] pt-2 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-center gap-2">
                      <CheckDot status={check.status} />
                      <span className="text-sm font-medium text-[var(--ink)]">
                        {check.label}
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-[0.12em]",
                          checkTone(check.status)
                        )}
                      >
                        {check.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--ink-muted)]">
                      {check.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                Hedge / funding notes
              </p>
              <ul className="mt-2 space-y-1.5">
                {active.hedges.map((note) => (
                  <li key={note} className="text-sm text-[var(--ink-muted)]">
                    · {note}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

function worstCheck(idea: TradeIdea): TradeCheckStatus {
  if (idea.checks.some((c) => c.status === "fail")) return "fail";
  if (idea.checks.some((c) => c.status === "warn")) return "warn";
  return "pass";
}

function checkTone(status: TradeCheckStatus) {
  if (status === "pass") return "text-[var(--up)]";
  if (status === "warn") return "text-[var(--signal-ink)]";
  return "text-[var(--down)]";
}

function CheckDot({ status }: { status: TradeCheckStatus }) {
  return (
    <span
      className={cn(
        "inline-block size-1.5 rounded-full",
        status === "pass" && "bg-[var(--up)]",
        status === "warn" && "bg-[var(--signal)]",
        status === "fail" && "bg-[var(--down)]"
      )}
      aria-label={status}
    />
  );
}

function StatusBadge({ status }: { status: TradeIdeaStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "shrink-0 rounded-sm capitalize",
        status === "ready" &&
          "border-[var(--up)]/30 bg-[var(--up-soft)] text-[var(--up)]",
        status === "working" &&
          "border-[var(--data)]/30 bg-[var(--data-soft)] text-[var(--data-ink)]",
        status === "draft" &&
          "border-[var(--signal)]/30 bg-[var(--signal-soft)] text-[var(--signal-ink)]",
        (status === "filled" || status === "killed") && "text-[var(--ink-muted)]"
      )}
    >
      {status}
    </Badge>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="border border-[var(--ink-line)] bg-[var(--paper)]/70 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl tabular-nums text-[var(--ink)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--ink-muted)]">{hint}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--ink-line)] px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-lg tabular-nums text-[var(--ink)]">{value}</p>
    </div>
  );
}
