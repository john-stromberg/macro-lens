"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FundBook, Position, Thesis } from "@/lib/data/types";
import { formatNumber, formatSigned, formatSignedUsd, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

type SleeveFilter = "all" | Position["sleeve"];

export function BookPanel({
  book,
  theses,
}: {
  book: FundBook;
  theses: Thesis[];
}) {
  const [sleeve, setSleeve] = useState<SleeveFilter>("all");

  const thesisById = useMemo(
    () => Object.fromEntries(theses.map((t) => [t.id, t])),
    [theses]
  );

  const rows = useMemo(() => {
    return book.positions
      .filter((p) => sleeve === "all" || p.sleeve === sleeve)
      .slice()
      .sort((a, b) => Math.abs(b.riskUsd) - Math.abs(a.riskUsd));
  }, [book.positions, sleeve]);

  const mtdPnl = book.positions.reduce((sum, p) => sum + p.mtdPnlUsd, 0);
  const dtdPnl = book.positions.reduce((sum, p) => sum + p.dtdPnlUsd, 0);

  const byFactor = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of book.positions) {
      map.set(p.factor, (map.get(p.factor) ?? 0) + p.riskUsd);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [book.positions]);

  const maxFactor = Math.max(...byFactor.map(([, v]) => v), 1);

  return (
    <section className="space-y-5 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] md:text-4xl">
          Fund book
        </h2>
        <p className="max-w-2xl text-[var(--ink-muted)]">
          Live risk and P&amp;L for {book.name}. Notionals are signed; risk is an
          approximate 1% / DV01-style dollar unit for desk triage.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="AUM" value={formatUsd(book.aumUsd, true)} hint={`NAV ${formatNumber(book.nav, 2)}`} />
        <Metric
          label="MTD / YTD"
          value={`${formatSigned(book.mtdReturnPct, 2, "%")} / ${formatSigned(book.ytdReturnPct, 1, "%")}`}
          hint={`P&L MTD ${formatSignedUsd(mtdPnl)} · DTD ${formatSignedUsd(dtdPnl)}`}
        />
        <Metric
          label="Gross / Net"
          value={`${formatNumber(book.grossExposurePct, 0)}% / ${formatNumber(book.netExposurePct, 0)}%`}
          hint={`${book.positions.length} positions`}
        />
        <Metric
          label="95% VaR"
          value={formatUsd(book.var95Usd, true)}
          hint={`${formatNumber((book.var95Usd / book.aumUsd) * 100, 1)}% of AUM`}
        />
      </div>

      <div className="border border-[var(--ink-line)] bg-[var(--paper)]/80 p-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          Risk by factor
        </p>
        <ul className="mt-3 space-y-2">
          {byFactor.map(([factor, risk]) => (
            <li key={factor} className="grid grid-cols-[88px_1fr_72px] items-center gap-3">
              <span className="font-mono text-xs uppercase text-[var(--ink-muted)]">
                {factor}
              </span>
              <div className="h-2 bg-[var(--ink-wash)]">
                <div
                  className="h-full bg-[var(--data)] transition-all duration-500"
                  style={{ width: `${(risk / maxFactor) * 100}%` }}
                />
              </div>
              <span className="text-right font-mono text-xs tabular-nums text-[var(--ink)]">
                {formatUsd(risk, true)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "rates", "fx", "equity", "credit", "commodity"] as const).map(
          (item) => (
            <Button
              key={item}
              size="sm"
              variant={sleeve === item ? "default" : "outline"}
              className="rounded-sm capitalize"
              onClick={() => setSleeve(item)}
            >
              {item}
            </Button>
          )
        )}
      </div>

      {rows.length === 0 ? (
        <div className="border border-dashed border-[var(--ink-line)] px-4 py-10 text-center text-[var(--ink-muted)]">
          No positions in this sleeve.
        </div>
      ) : (
        <div className="overflow-x-auto border border-[var(--ink-line)] bg-[var(--paper)]/80">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead className="bg-[var(--ink-wash)] text-left text-[11px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
              <tr>
                <th className="px-4 py-3 font-medium">Position</th>
                <th className="px-4 py-3 font-medium">Thesis</th>
                <th className="px-4 py-3 font-medium text-right">Notional</th>
                <th className="px-4 py-3 font-medium text-right">Risk $</th>
                <th className="px-4 py-3 font-medium text-right">DTD</th>
                <th className="px-4 py-3 font-medium text-right">MTD</th>
                <th className="px-4 py-3 font-medium text-right">YTD</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((position) => {
                const thesis = position.thesisId
                  ? thesisById[position.thesisId]
                  : null;
                return (
                  <tr
                    key={position.id}
                    className="border-t border-[var(--ink-line)] align-top transition-colors hover:bg-[var(--ink-wash)]/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-[var(--ink)]">
                          {position.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-sm px-1.5 py-0 font-mono text-[10px] uppercase",
                            position.side === "long"
                              ? "border-[var(--up)]/30 text-[var(--up)]"
                              : "border-[var(--down)]/30 text-[var(--down)]"
                          )}
                        >
                          {position.side}
                        </Badge>
                      </div>
                      <p className="mt-1 font-mono text-xs text-[var(--ink-faint)]">
                        {position.ticker} · {position.region} · {position.factor}
                      </p>
                      <p className="mt-1 max-w-sm text-xs text-[var(--ink-muted)]">
                        {position.notes}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--ink-muted)]">
                      {thesis ? thesis.title : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {formatUsd(position.notionalUsd, true)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {formatUsd(position.riskUsd, true)}
                    </td>
                    <PnlCell value={position.dtdPnlUsd} />
                    <PnlCell value={position.mtdPnlUsd} />
                    <PnlCell value={position.ytdPnlUsd} />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
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
      <p className="mt-1 font-mono text-xl tabular-nums text-[var(--ink)] md:text-2xl">
        {value}
      </p>
      <p className="mt-1 text-xs text-[var(--ink-muted)]">{hint}</p>
    </div>
  );
}

function PnlCell({ value }: { value: number }) {
  return (
    <td
      className={cn(
        "px-4 py-3 text-right font-mono tabular-nums font-medium",
        value > 0 && "text-[var(--up)]",
        value < 0 && "text-[var(--down)]",
        value === 0 && "text-[var(--ink-muted)]"
      )}
    >
      {formatSignedUsd(value)}
    </td>
  );
}
