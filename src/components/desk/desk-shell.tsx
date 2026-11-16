"use client";

import { useState } from "react";
import { CrossAssetTape } from "@/components/desk/cross-asset-tape";
import { PolicyTracker } from "@/components/desk/policy-tracker";
import { PulseBoard } from "@/components/desk/pulse-board";
import { RegimeMap } from "@/components/desk/regime-map";
import { SampleBanner } from "@/components/desk/sample-banner";
import { YieldCurveLab } from "@/components/desk/yield-curve-lab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DeskSnapshot } from "@/lib/data/types";
import { cn } from "@/lib/utils";

const tools = [
  { id: "pulse", label: "Pulse", blurb: "Release surprises" },
  { id: "curve", label: "Curve", blurb: "Yield lab" },
  { id: "policy", label: "Policy", blurb: "Central banks" },
  { id: "regimes", label: "Regimes", blurb: "Growth / inflation" },
  { id: "tape", label: "Tape", blurb: "Cross-asset" },
] as const;

type ToolId = (typeof tools)[number]["id"];

export function DeskShell({ snapshot }: { snapshot: DeskSnapshot }) {
  const [tool, setTool] = useState<ToolId>("pulse");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 desk-atmosphere" aria-hidden />
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[var(--data)]/10 blur-3xl animate-drift" aria-hidden />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-[var(--signal)]/10 blur-3xl animate-drift-slow" aria-hidden />

      <div className="relative z-10">
        <SampleBanner snapshot={snapshot} />

        <header className="border-b border-[var(--ink-line)] px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal-ink)]">
                Research desk
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[0.92] tracking-tight text-[var(--ink)] md:text-6xl">
                Macro Desk
              </h1>
              <p className="max-w-xl text-base text-[var(--ink-muted)] md:text-lg">
                Tools for reading the cycle: surprises, curves, policy paths, regimes, and
                the cross-asset tape.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-xs text-[var(--ink-faint)] sm:grid-cols-3">
              <Stat label="Releases" value={String(snapshot.releases.length)} />
              <Stat label="Curves" value={String(snapshot.curves.length)} />
              <Stat label="Banks" value={String(snapshot.banks.length)} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
          <Tabs
            value={tool}
            onValueChange={(value) => setTool((value as ToolId) ?? "pulse")}
            className="gap-6"
          >
            <TabsList
              variant="line"
              className="h-auto w-full flex-wrap justify-start gap-1 rounded-none border-b border-[var(--ink-line)] bg-transparent p-0"
            >
              {tools.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className={cn(
                    "rounded-none border-b-2 border-transparent px-3 py-3 text-left data-active:border-[var(--data)] data-active:shadow-none"
                  )}
                >
                  <span className="block font-medium text-[var(--ink)]">{item.label}</span>
                  <span className="hidden text-[11px] text-[var(--ink-faint)] sm:block">
                    {item.blurb}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="pulse" className="mt-2 outline-none">
              <PulseBoard releases={snapshot.releases} />
            </TabsContent>
            <TabsContent value="curve" className="mt-2 outline-none">
              <YieldCurveLab curves={snapshot.curves} />
            </TabsContent>
            <TabsContent value="policy" className="mt-2 outline-none">
              <PolicyTracker banks={snapshot.banks} />
            </TabsContent>
            <TabsContent value="regimes" className="mt-2 outline-none">
              <RegimeMap regimes={snapshot.regimes} />
            </TabsContent>
            <TabsContent value="tape" className="mt-2 outline-none">
              <CrossAssetTape assets={snapshot.assets} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="uppercase tracking-[0.14em]">{label}</p>
      <p className="mt-0.5 text-lg tabular-nums text-[var(--ink)]">{value}</p>
    </div>
  );
}
