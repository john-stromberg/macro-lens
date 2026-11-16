"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Position, Thesis, ThesisStatus } from "@/lib/data/types";
import { formatDateTimePT } from "@/lib/format";
import { cn } from "@/lib/utils";

const statuses: Array<ThesisStatus | "all"> = [
  "all",
  "active",
  "watching",
  "closed",
  "killed",
];

export function ThesisBoard({
  theses,
  positions,
}: {
  theses: Thesis[];
  positions: Position[];
}) {
  const [status, setStatus] = useState<(typeof statuses)[number]>("all");
  const [activeId, setActiveId] = useState(theses[0]?.id ?? "");

  const filtered = useMemo(
    () => theses.filter((t) => status === "all" || t.status === status),
    [theses, status]
  );

  const active =
    filtered.find((t) => t.id === activeId) ?? filtered[0] ?? theses[0];

  const linked = useMemo(
    () =>
      positions.filter((p) => active && p.thesisId === active.id),
    [positions, active]
  );

  if (!active) {
    return (
      <div className="border border-dashed border-[var(--ink-line)] px-4 py-10 text-center text-[var(--ink-muted)]">
        No theses loaded.
      </div>
    );
  }

  return (
    <section className="space-y-5 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] md:text-4xl">
          Research theses
        </h2>
        <p className="max-w-2xl text-[var(--ink-muted)]">
          Living views that justify risk. Conviction, catalysts, and the positions
          that express each call.
        </p>
      </header>

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
          No theses in this status. Switch filter to see the pipeline.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <ul className="divide-y divide-[var(--ink-line)] border border-[var(--ink-line)] bg-[var(--paper)]/80">
            {filtered.map((thesis) => {
              const selected = thesis.id === active.id;
              return (
                <li key={thesis.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(thesis.id)}
                    className={cn(
                      "w-full px-4 py-3 text-left transition-colors",
                      selected
                        ? "bg-[var(--data-soft)] shadow-[inset_3px_0_0_var(--data)]"
                        : "hover:bg-[var(--ink-wash)]/70"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-[var(--ink)]">{thesis.title}</p>
                      <Conviction value={thesis.conviction} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={thesis.status} />
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                        {thesis.region} · {thesis.horizon}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <article className="border border-[var(--ink-line)] bg-[var(--paper)]/80 p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                  {active.owner} · updated {formatDateTimePT(active.updatedAt)}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                  {active.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={active.status} />
                <Conviction value={active.conviction} />
              </div>
            </div>

            <p className="mt-4 text-[var(--ink-muted)] leading-relaxed">
              {active.summary}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ListBlock title="Catalysts" items={active.catalysts} />
              <ListBlock title="Risks" items={active.risks} tone="risk" />
            </div>

            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                Linked positions
              </p>
              {linked.length === 0 ? (
                <p className="mt-2 text-sm text-[var(--ink-muted)]">
                  No live expressions in the book yet.
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {linked.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-3 border-t border-[var(--ink-line)] pt-2 text-sm"
                    >
                      <span className="text-[var(--ink)]">{p.name}</span>
                      <Badge
                        variant="outline"
                        className="rounded-sm font-mono text-[10px] uppercase"
                      >
                        {p.side} · {p.sleeve}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

function Conviction({ value }: { value: number }) {
  return (
    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--signal-ink)]">
      Conv {value}/5
    </span>
  );
}

function StatusBadge({ status }: { status: ThesisStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-sm capitalize",
        status === "active" &&
          "border-[var(--up)]/30 bg-[var(--up-soft)] text-[var(--up)]",
        status === "watching" &&
          "border-[var(--signal)]/30 bg-[var(--signal-soft)] text-[var(--signal-ink)]",
        (status === "closed" || status === "killed") && "text-[var(--ink-muted)]"
      )}
    >
      {status}
    </Badge>
  );
}

function ListBlock({
  title,
  items,
  tone = "default",
}: {
  title: string;
  items: string[];
  tone?: "default" | "risk";
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
              "text-sm leading-snug",
              tone === "risk" ? "text-[var(--down)]" : "text-[var(--ink-muted)]"
            )}
          >
            · {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
