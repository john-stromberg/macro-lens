"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Catalyst, Thesis } from "@/lib/data/types";
import { formatDateTimePT } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CatalystCalendar({
  catalysts,
  theses,
}: {
  catalysts: Catalyst[];
  theses: Thesis[];
}) {
  const [kind, setKind] = useState<"all" | Catalyst["kind"]>("all");
  const thesisById = useMemo(
    () => Object.fromEntries(theses.map((t) => [t.id, t])),
    [theses]
  );

  const rows = useMemo(() => {
    return catalysts
      .filter((c) => kind === "all" || c.kind === kind)
      .slice()
      .sort((a, b) => +new Date(a.when) - +new Date(b.when));
  }, [catalysts, kind]);

  return (
    <section className="space-y-5 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] md:text-4xl">
          Catalyst calendar
        </h2>
        <p className="max-w-2xl text-[var(--ink-muted)]">
          Upcoming releases, central banks, and events mapped to active theses and
          book relevance — the PM briefing view.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["all", "release", "cb", "event"] as const).map((item) => (
          <Button
            key={item}
            size="sm"
            variant={kind === item ? "default" : "outline"}
            className="rounded-sm capitalize"
            onClick={() => setKind(item)}
          >
            {item === "cb" ? "Central banks" : item}
          </Button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="border border-dashed border-[var(--ink-line)] px-4 py-10 text-center text-[var(--ink-muted)]">
          No catalysts in this filter.
        </div>
      ) : (
        <ol className="border border-[var(--ink-line)] bg-[var(--paper)]/80">
          {rows.map((catalyst, index) => (
            <li
              key={catalyst.id}
              className={cn(
                "grid gap-3 px-4 py-4 md:grid-cols-[140px_1fr]",
                index > 0 && "border-t border-[var(--ink-line)]"
              )}
            >
              <div>
                <p className="font-mono text-xs tabular-nums text-[var(--ink)]">
                  {formatDateTimePT(catalyst.when)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge
                    variant="outline"
                    className="rounded-sm px-1.5 py-0 font-mono text-[10px] uppercase"
                  >
                    {catalyst.kind}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-sm px-1.5 py-0 font-mono text-[10px]"
                  >
                    {catalyst.region}
                  </Badge>
                  {catalyst.importance === "high" ? (
                    <span className="mt-1 size-1.5 rounded-full bg-[var(--signal)]" />
                  ) : null}
                </div>
              </div>
              <div>
                <p className="font-medium text-[var(--ink)]">{catalyst.title}</p>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  {catalyst.bookRelevance}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {catalyst.thesisIds.map((id) => (
                    <Badge
                      key={id}
                      variant="outline"
                      className="rounded-sm border-[var(--data)]/30 bg-[var(--data-soft)] text-[10px] text-[var(--data-ink)]"
                    >
                      {thesisById[id]?.title ?? id}
                    </Badge>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
