"use client";

import { useState } from "react";
import { AnalystDesk } from "@/components/desk/analyst-desk";
import { BookPanel } from "@/components/desk/book-panel";
import { BudgetBoard } from "@/components/desk/budget-board";
import { CatalystCalendar } from "@/components/desk/catalyst-calendar";
import { DeskFrame } from "@/components/desk/desk-frame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DeskSnapshot } from "@/lib/data/types";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const workspaces = [
  { id: "queue", label: "Queue", blurb: "Trade ideas" },
  { id: "budgets", label: "Budgets", blurb: "Factor limits" },
  { id: "book", label: "Book context", blurb: "Live positions" },
  { id: "calendar", label: "Calendar", blurb: "Event risk" },
] as const;

type WorkspaceId = (typeof workspaces)[number]["id"];

export function TradeSupportDashboard({
  snapshot,
}: {
  snapshot: DeskSnapshot;
}) {
  const [workspace, setWorkspace] = useState<WorkspaceId>("queue");
  const ready = snapshot.tradeIdeas.filter((i) => i.status === "ready").length;
  const working = snapshot.tradeIdeas.filter((i) => i.status === "working").length;
  const flagged = snapshot.tradeIdeas.filter((i) =>
    i.checks.some((c) => c.status === "warn" || c.status === "fail")
  ).length;

  return (
    <DeskFrame
      snapshot={snapshot}
      module="trade-support"
      eyebrow="Portfolio analyst dashboard"
      title="Trade support"
      lede="Propose, check, and stage tickets for the PM. Risk budgets and book context stay in view so sizing stays honest."
      stats={[
        { label: "Queue", value: String(snapshot.tradeIdeas.length) },
        { label: "Ready", value: String(ready) },
        { label: "Working", value: String(working) },
        { label: "Flagged", value: String(flagged) },
      ]}
    >
      <Tabs
        value={workspace}
        onValueChange={(value) =>
          setWorkspace((value as WorkspaceId) ?? "queue")
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
              <span className="block font-medium text-[var(--ink)]">{item.label}</span>
              <span className="hidden text-[11px] text-[var(--ink-faint)] sm:block">
                {item.blurb}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="queue" className="mt-2 outline-none">
          <AnalystDesk
            ideas={snapshot.tradeIdeas}
            budgets={snapshot.riskBudgets}
            theses={snapshot.theses}
          />
        </TabsContent>
        <TabsContent value="budgets" className="mt-2 outline-none">
          <BudgetBoard
            budgets={snapshot.riskBudgets}
            ideas={snapshot.tradeIdeas}
          />
        </TabsContent>
        <TabsContent value="book" className="mt-2 outline-none">
          <div className="space-y-3">
            <p className="text-sm text-[var(--ink-muted)]">
              Read-only book context for sizing and hedge construction. AUM{" "}
              {formatUsd(snapshot.book.aumUsd, true)}.
            </p>
            <BookPanel book={snapshot.book} theses={snapshot.theses} />
          </div>
        </TabsContent>
        <TabsContent value="calendar" className="mt-2 outline-none">
          <CatalystCalendar
            catalysts={snapshot.catalysts}
            theses={snapshot.theses}
          />
        </TabsContent>
      </Tabs>
    </DeskFrame>
  );
}
