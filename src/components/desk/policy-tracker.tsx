"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CentralBank } from "@/lib/data/types";
import { formatDateUTC, formatNumber, formatSigned } from "@/lib/format";
import { cn } from "@/lib/utils";

const stanceLabel = {
  easing: "Easing",
  tightening: "Tightening",
  hold: "On hold",
} as const;

export function PolicyTracker({ banks }: { banks: CentralBank[] }) {
  const [activeId, setActiveId] = useState(banks[0]?.id ?? "");
  const active = useMemo(
    () => banks.find((bank) => bank.id === activeId) ?? banks[0],
    [activeId, banks]
  );

  if (!active) {
    return (
      <div className="border border-dashed border-[var(--ink-line)] px-4 py-10 text-center text-[var(--ink-muted)]">
        No policy path loaded.
      </div>
    );
  }

  return (
    <section className="space-y-5 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] md:text-4xl">
          Policy tracker
        </h2>
        <p className="max-w-2xl text-[var(--ink-muted)]">
          Policy rates, last move, and the path that markets are pricing against.
          Select a central bank to inspect the trail.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {banks.map((bank) => {
          const delta = bank.policyRate - bank.priorRate;
          const selected = bank.id === active.id;
          return (
            <button
              key={bank.id}
              type="button"
              onClick={() => setActiveId(bank.id)}
              className={cn(
                "border px-4 py-3 text-left transition-all",
                selected
                  ? "border-[var(--data)] bg-[var(--data-soft)] shadow-[inset_3px_0_0_var(--data)]"
                  : "border-[var(--ink-line)] bg-[var(--paper)]/70 hover:border-[var(--ink-muted)]"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-[var(--ink)]">{bank.name}</p>
                  <p className="font-mono text-xs text-[var(--ink-faint)]">
                    {bank.region}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-sm",
                    bank.stance === "easing" &&
                      "border-[var(--up)]/30 bg-[var(--up-soft)] text-[var(--up)]",
                    bank.stance === "tightening" &&
                      "border-[var(--down)]/30 bg-[var(--down-soft)] text-[var(--down)]",
                    bank.stance === "hold" && "text-[var(--ink-muted)]"
                  )}
                >
                  {stanceLabel[bank.stance]}
                </Badge>
              </div>
              <p className="mt-3 font-mono text-3xl tabular-nums text-[var(--ink)]">
                {formatNumber(bank.policyRate, 2)}%
              </p>
              <p className="mt-1 font-mono text-xs text-[var(--ink-muted)]">
                Last move {formatSigned(delta, 2, " pp")} · next{" "}
                {formatDateUTC(bank.nextMeeting, { year: undefined })}
              </p>
            </button>
          );
        })}
      </div>

      <div className="border border-[var(--ink-line)] bg-[var(--paper)]/80 p-3 md:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              Policy path
            </p>
            <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {active.name}
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-sm"
            onClick={() => {
              const idx = banks.findIndex((b) => b.id === active.id);
              const next = banks[(idx + 1) % banks.length];
              if (next) setActiveId(next.id);
            }}
          >
            Next bank
          </Button>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={active.path} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--ink-line)" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--ink-faint)", fontSize: 12 }}
                axisLine={{ stroke: "var(--ink-line)" }}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "var(--ink-faint)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                width={42}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--paper)",
                  border: "1px solid var(--ink-line)",
                  borderRadius: 2,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
                formatter={(value) => [`${formatNumber(Number(value), 2)}%`, "Rate"]}
              />
              <Line
                type="stepAfter"
                dataKey="rate"
                stroke="var(--signal)"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "var(--signal)" }}
                animationDuration={650}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
