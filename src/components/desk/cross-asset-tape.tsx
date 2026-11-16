"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AssetMove } from "@/lib/data/types";
import { formatNumber, formatSigned } from "@/lib/format";
import { cn } from "@/lib/utils";

const sleeves = ["all", "rates", "credit", "equity", "fx", "commodity"] as const;
type SleeveFilter = (typeof sleeves)[number];
type Horizon = "weekPct" | "monthPct" | "ytdPct";

const horizonLabel: Record<Horizon, string> = {
  weekPct: "1W",
  monthPct: "1M",
  ytdPct: "YTD",
};

export function CrossAssetTape({ assets }: { assets: AssetMove[] }) {
  const [sleeve, setSleeve] = useState<SleeveFilter>("all");
  const [horizon, setHorizon] = useState<Horizon>("weekPct");

  const rows = useMemo(() => {
    return assets
      .filter((asset) => sleeve === "all" || asset.sleeve === sleeve)
      .slice()
      .sort((a, b) => Math.abs(b[horizon]) - Math.abs(a[horizon]));
  }, [assets, sleeve, horizon]);

  return (
    <section className="space-y-5 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] md:text-4xl">
          Cross-asset tape
        </h2>
        <p className="max-w-2xl text-[var(--ink-muted)]">
          Ranked moves across rates, credit, equities, FX, and commodities. Toggle the
          horizon to see what is driving the week versus the year.
        </p>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {sleeves.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={sleeve === item ? "default" : "outline"}
              className="rounded-sm capitalize"
              onClick={() => setSleeve(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(horizonLabel) as Horizon[]).map((item) => (
            <Button
              key={item}
              size="sm"
              variant={horizon === item ? "secondary" : "ghost"}
              className="rounded-sm"
              onClick={() => setHorizon(item)}
            >
              {horizonLabel[item]}
            </Button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="border border-dashed border-[var(--ink-line)] px-4 py-10 text-center text-[var(--ink-muted)]">
          No assets in this sleeve.
        </div>
      ) : (
        <ul className="divide-y divide-[var(--ink-line)] border border-[var(--ink-line)] bg-[var(--paper)]/80">
          {rows.map((asset) => {
            const move = asset[horizon];
            const width = Math.min(100, Math.abs(move) * (horizon === "ytdPct" ? 2.2 : 12));
            return (
              <li
                key={asset.id}
                className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3 md:grid-cols-[180px_1fr_120px_100px] md:items-center"
              >
                <div>
                  <p className="font-medium text-[var(--ink)]">{asset.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-sm px-1.5 py-0 font-mono text-[10px] uppercase"
                    >
                      {asset.sleeve}
                    </Badge>
                    <span className="font-mono text-xs text-[var(--ink-faint)]">
                      {asset.ticker}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="relative h-2 overflow-hidden bg-[var(--ink-wash)]">
                    <div
                      className={cn(
                        "absolute top-0 h-full transition-all duration-500",
                        move >= 0 ? "bg-[var(--up)] left-1/2" : "bg-[var(--down)] right-1/2"
                      )}
                      style={{ width: `${width / 2}%` }}
                    />
                    <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--ink)]/30" />
                  </div>
                </div>
                <p className="text-right font-mono text-sm tabular-nums text-[var(--ink-muted)] md:text-left">
                  {asset.unit === "$" ? "$" : ""}
                  {formatNumber(asset.level, asset.level >= 100 ? 0 : 2)}
                  {asset.unit === "%" ? "%" : asset.unit === "pts" || asset.unit === "idx" ? ` ${asset.unit}` : ""}
                </p>
                <p
                  className={cn(
                    "text-right font-mono text-base tabular-nums font-medium",
                    move >= 0 ? "text-[var(--up)]" : "text-[var(--down)]"
                  )}
                >
                  {formatSigned(move, 1, "%")}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
