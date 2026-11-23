"use client";

import { useState } from "react";
import { BookPanel } from "@/components/desk/book-panel";
import { CatalystCalendar } from "@/components/desk/catalyst-calendar";
import { CrossAssetTape } from "@/components/desk/cross-asset-tape";
import { DeskFrame } from "@/components/desk/desk-frame";
import { PolicyTracker } from "@/components/desk/policy-tracker";
import { PulseBoard } from "@/components/desk/pulse-board";
import { RegimeMap } from "@/components/desk/regime-map";
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

export function PmDashboard({ snapshot }: { snapshot: DeskSnapshot }) {
  const [workspace, setWorkspace] = useState<WorkspaceId>("book");
  const [marketTool, setMarketTool] = useState<MarketToolId>("pulse");
  const { book } = snapshot;
  const readyIdeas = snapshot.tradeIdeas.filter((i) => i.status === "ready").length;

  return (
    <DeskFrame
      snapshot={snapshot}
      module="pm"
      eyebrow="Portfolio manager dashboard"
      title="PM desk"
      lede="Own the book, the narrative, and the risk. Research theses, catalysts, and scenarios live here — trade tickets sit in Trade support."
      stats={[
        { label: "AUM", value: formatUsd(book.aumUsd, true) },
        { label: "MTD", value: formatSigned(book.mtdReturnPct, 2, "%") },
        { label: "Theses", value: String(snapshot.theses.length) },
        { label: "Ready tickets", value: String(readyIdeas) },
      ]}
    >
      <Tabs
        value={workspace}
        onValueChange={(value) => setWorkspace((value as WorkspaceId) ?? "book")}
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
              <span className="block font-medium text-[var(--ink)]">{item.label}</span>
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
        </TabsContent>
      </Tabs>
    </DeskFrame>
  );
}
