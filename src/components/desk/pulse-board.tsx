"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IndicatorRelease } from "@/lib/data/types";
import {
  formatNumber,
  formatSigned,
  surpriseDelta,
  surpriseOf,
} from "@/lib/format";
import { cn } from "@/lib/utils";

const regions = ["All", "US", "EA", "UK", "CN", "JP"] as const;

function surpriseTone(sign: ReturnType<typeof surpriseOf>) {
  if (sign === "beat") return "text-[var(--up)]";
  if (sign === "miss") return "text-[var(--down)]";
  if (sign === "inline") return "text-[var(--ink-muted)]";
  return "text-[var(--ink-faint)]";
}

export function PulseBoard({ releases }: { releases: IndicatorRelease[] }) {
  const [region, setRegion] = useState<(typeof regions)[number]>("All");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    return releases.filter((r) => {
      const regionOk = region === "All" || r.region === region;
      const q = query.trim().toLowerCase();
      const queryOk =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q);
      return regionOk && queryOk;
    });
  }, [releases, region, query]);

  return (
    <section className="space-y-5 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] md:text-4xl">
          Release pulse
        </h2>
        <p className="max-w-2xl text-[var(--ink-muted)]">
          Actual versus consensus for the prints that move rates and risk. Filter by
          region or search a series.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          value={region}
          onValueChange={(value) =>
            setRegion((value as (typeof regions)[number]) ?? "All")
          }
        >
          <SelectTrigger className="w-full rounded-sm sm:w-40">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search CPI, payrolls, PMI…"
          className="rounded-sm"
        />
      </div>

      {rows.length === 0 ? (
        <div className="border border-dashed border-[var(--ink-line)] bg-[var(--paper)]/60 px-4 py-10 text-center text-[var(--ink-muted)]">
          No releases match that filter. Clear search or switch region.
        </div>
      ) : (
        <div className="overflow-x-auto border border-[var(--ink-line)] bg-[var(--paper)]/80">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="bg-[var(--ink-wash)] text-left text-[11px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
              <tr>
                <th className="px-4 py-3 font-medium">Release</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium text-right">Actual</th>
                <th className="px-4 py-3 font-medium text-right">Cons.</th>
                <th className="px-4 py-3 font-medium text-right">Prior</th>
                <th className="px-4 py-3 font-medium text-right">Surprise</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((release) => {
                const sign = surpriseOf(release);
                const delta = surpriseDelta(release);
                return (
                  <tr
                    key={release.id}
                    className="border-t border-[var(--ink-line)] transition-colors hover:bg-[var(--ink-wash)]/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--ink)]">
                          {release.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="rounded-sm px-1.5 py-0 font-mono text-[10px]"
                        >
                          {release.region}
                        </Badge>
                        {release.importance === "high" ? (
                          <span className="size-1.5 rounded-full bg-[var(--signal)]" />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--ink-muted)]">
                      {release.period}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-[var(--ink)]">
                      {release.actual === null
                        ? "—"
                        : `${formatNumber(release.actual, release.unit === "k" ? 0 : 1)}${release.unit === "k" ? "k" : ""}`}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-[var(--ink-muted)]">
                      {formatNumber(release.consensus, release.unit === "k" ? 0 : 1)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-[var(--ink-muted)]">
                      {formatNumber(release.previous, release.unit === "k" ? 0 : 1)}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3 text-right font-mono tabular-nums font-medium",
                        surpriseTone(sign)
                      )}
                    >
                      {delta === null
                        ? "Pending"
                        : formatSigned(delta, release.unit === "k" ? 0 : 1)}
                    </td>
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
