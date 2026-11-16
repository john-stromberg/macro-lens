"use client";

import { useState } from "react";
import { BookPanel } from "@/components/desk/book-panel";
import { CatalystCalendar } from "@/components/desk/catalyst-calendar";
import { CrossAssetTape } from "@/components/desk/cross-asset-tape";
import { PolicyTracker } from "@/components/desk/policy-tracker";
import { PulseBoard } from "@/components/desk/pulse-board";
import { RegimeMap } from "@/components/desk/regime-map";
import { SampleBanner } from "@/components/desk/sample-banner";
import { ScenarioLab } from "@/components/desk/scenario-lab";
import { ThesisBoard } from "@/components/desk/thesis-board";
import { YieldCurveLab } from "@/components/desk/yield-curve-lab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DeskSnapshot } from "@/lib/data/types";
import { formatSigned, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const workspaces = [
  { id: "book", label: "Book", blurb: "Positions & risk" },
  { id: "research", label: "Research", blurb: "Theses" },
  { id: "calendar", label: "Calendar", blurb: "Catalysts" },
  { id: "scenarios", label: "Scenarios", blurb: "Shock P&L" },
  { id: "markets", label: "Markets", blurb: "Macro tools" },
] as const;

const marketTools = [
  { id: "pulse", label: "Pulse", blurb: "Surprises" },
  { id: "curve", label: "Curve", blurb: "Yields" },
  { id: "policy", label: "Policy", blurb: "CBs" },
  { id: "regimes", label: "Regimes", blurb: "G / π" },
  { id: "tape", label: "Tape", blurb: "Assets" },
] as const;

type WorkspaceId = (typeof workspaces)[number]["id"];
type MarketToolId = (typeof marketTools)[number]["id"];

export function DeskShell({ snapshot }: { snapshot: DeskSnapshot }) {
  const [workspace, setWorkspace] = useState<WorkspaceId>("book");
  const [marketTool, setMarketTool] = useState<MarketToolId>("pulse");
  const { book } = snapshot;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 desk-atmosphere" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[var(--data)]/10 blur-3xl animate-drift"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-[var(--signal)]/10 blur-3xl animate-drift-slow"
        aria-hidden
      />

      <div className="relative z-10">
        <SampleBanner snapshot={snapshot} />

        <header className="border-b border-[var(--ink-line)] px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal-ink)]">
                Macro hedge fund desk
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[0.92] tracking-tight text-[var(--ink)] md:text-6xl">
                Macro Desk
              </h1>
              <p className="max-w-xl text-base text-[var(--ink-muted)] md:text-lg">
                PM book, research theses, catalysts, and scenario risk — with the
                market tools underneath.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-xs text-[var(--ink-faint)] sm:grid-cols-4">
              <Stat label="AUM" value={formatUsd(book.aumUsd, true)} />
              <Stat
                label="MTD"
                value={formatSigned(book.mtdReturnPct, 2, "%")}
              />
              <Stat label="Theses" value={String(snapshot.theses.length)} />
              <Stat
                label="Gross"
                value={`${Math.round(book.grossExposurePct)}%`}
              />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
          <Tabs
            value={workspace}
            onValueChange={(value) =>
              setWorkspace((value as WorkspaceId) ?? "book")
            }
            className="gap-6"
          >
            <TabsList
              variant="line"
              className="h-auto w-full flex-wrap justify-start gap-1 rounded-none border-b border-[var(--ink-line)] bg-transparent p-0"
            >
              {workspaces.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className={cn(
                    "rounded-none border-b-2 border-transparent px-3 py-3 text-left data-active:border-[var(--data)] data-active:shadow-none"
                  )}
                >
                  <span className="block font-medium text-[var(--ink)]">
                    {item.label}
                  </span>
                  <span className="hidden text-[11px] text-[var(--ink-faint)] sm:block">
                    {item.blurb}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="book" className="mt-2 outline-none">
              <BookPanel book={snapshot.book} theses={snapshot.theses} />
            </TabsContent>
            <TabsContent value="research" className="mt-2 outline-none">
              <ThesisBoard
                theses={snapshot.theses}
                positions={snapshot.book.positions}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-2 outline-none">
              <CatalystCalendar
                catalysts={snapshot.catalysts}
                theses={snapshot.theses}
              />
            </TabsContent>
            <TabsContent value="scenarios" className="mt-2 outline-none">
              <ScenarioLab scenarios={snapshot.scenarios} />
            </TabsContent>
            <TabsContent value="markets" className="mt-2 outline-none">
              <div className="space-y-5">
                <Tabs
                  value={marketTool}
                  onValueChange={(value) =>
                    setMarketTool((value as MarketToolId) ?? "pulse")
                  }
                  className="gap-4"
                >
                  <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-sm bg-[var(--ink-wash)] p-1">
                    {marketTools.map((item) => (
                      <TabsTrigger
                        key={item.id}
                        value={item.id}
                        className="rounded-sm px-3 py-2 data-active:bg-[var(--paper)]"
                      >
                        <span className="font-medium">{item.label}</span>
                        <span className="ml-1.5 hidden text-[11px] text-[var(--ink-faint)] sm:inline">
                          {item.blurb}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="pulse" className="outline-none">
                    <PulseBoard releases={snapshot.releases} />
                  </TabsContent>
                  <TabsContent value="curve" className="outline-none">
                    <YieldCurveLab curves={snapshot.curves} />
                  </TabsContent>
                  <TabsContent value="policy" className="outline-none">
                    <PolicyTracker banks={snapshot.banks} />
                  </TabsContent>
                  <TabsContent value="regimes" className="outline-none">
                    <RegimeMap regimes={snapshot.regimes} />
                  </TabsContent>
                  <TabsContent value="tape" className="outline-none">
                    <CrossAssetTape assets={snapshot.assets} />
                  </TabsContent>
                </Tabs>
              </div>
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
