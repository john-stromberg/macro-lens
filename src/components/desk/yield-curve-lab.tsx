"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { YieldCurveSnapshot } from "@/lib/data/types";
import { formatNumber, formatSigned } from "@/lib/format";

export function YieldCurveLab({ curves }: { curves: YieldCurveSnapshot[] }) {
  const primary = curves[0];
  const [compareId, setCompareId] = useState(curves[1]?.id ?? curves[0]?.id);

  const compare = useMemo(
    () => curves.find((curve) => curve.id === compareId) ?? curves[1] ?? curves[0],
    [compareId, curves]
  );

  const chartData = useMemo(() => {
    if (!primary || !compare) return [];
    return primary.points.map((point) => {
      const match = compare.points.find((p) => p.tenor === point.tenor);
      return {
        tenor: point.tenor,
        months: point.months,
        primary: point.yield,
        compare: match?.yield ?? null,
        spread:
          match === undefined ? null : Number((point.yield - match.yield).toFixed(2)),
      };
    });
  }, [primary, compare]);

  const twoTen = primary?.points.find((p) => p.tenor === "2Y")?.yield;
  const tenTen = primary?.points.find((p) => p.tenor === "10Y")?.yield;
  const slope =
    twoTen !== undefined && tenTen !== undefined
      ? Number((tenTen - twoTen).toFixed(2))
      : null;

  if (!primary) {
    return (
      <div className="border border-dashed border-[var(--ink-line)] px-4 py-10 text-center text-[var(--ink-muted)]">
        No curve data loaded.
      </div>
    );
  }

  return (
    <section className="space-y-5 animate-in fade-in duration-500">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] md:text-4xl">
            Yield curve lab
          </h2>
          <p className="max-w-xl text-[var(--ink-muted)]">
            Spot UST against a prior session or Bunds. Watch the front end for policy
            pricing and the belly for duration.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--ink-faint)]">
            Compare
          </span>
          <Select value={compareId} onValueChange={(value) => setCompareId(value ?? compareId)}>
            <SelectTrigger className="w-44 rounded-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {curves
                .filter((curve) => curve.id !== primary.id)
                .map((curve) => (
                  <SelectItem key={curve.id} value={curve.id}>
                    {curve.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric
          label="2s10s slope"
          value={slope === null ? "—" : formatSigned(slope, 2, " pp")}
          hint={slope !== null && slope < 0 ? "Inverted" : "Upward"}
        />
        <Metric
          label={`${primary.label} 10Y`}
          value={`${formatNumber(tenTen ?? 0, 2)}%`}
          hint={`As of ${primary.asOf}`}
        />
        <Metric
          label="10Y vs compare"
          value={
            chartData.find((d) => d.tenor === "10Y")?.spread === null ||
            chartData.find((d) => d.tenor === "10Y")?.spread === undefined
              ? "—"
              : formatSigned(chartData.find((d) => d.tenor === "10Y")!.spread!, 2, " pp")
          }
          hint={compare.label}
        />
      </div>

      <div className="border border-[var(--ink-line)] bg-[var(--paper)]/80 p-3 md:p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="rounded-sm border-[var(--data)]/40 bg-[var(--data-soft)] text-[var(--data-ink)]"
          >
            {primary.label}
          </Badge>
          <Badge variant="outline" className="rounded-sm text-[var(--ink-muted)]">
            {compare.label}
          </Badge>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--ink-line)" strokeDasharray="3 3" />
              <XAxis
                dataKey="tenor"
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
                formatter={(value, name) => [
                  `${formatNumber(Number(value), 2)}%`,
                  name === "primary" ? primary.label : compare.label,
                ]}
              />
              <Legend
                formatter={(value) =>
                  value === "primary" ? primary.label : compare.label
                }
              />
              <Line
                type="monotone"
                dataKey="primary"
                stroke="var(--data)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--data)" }}
                animationDuration={700}
              />
              <Line
                type="monotone"
                dataKey="compare"
                stroke="var(--ink-muted)"
                strokeWidth={1.75}
                strokeDasharray="5 4"
                dot={false}
                animationDuration={700}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
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
      <p className="mt-1 font-mono text-2xl tabular-nums text-[var(--ink)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--ink-muted)]">{hint}</p>
    </div>
  );
}
