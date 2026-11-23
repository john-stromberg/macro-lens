import Link from "next/link";
import { SampleBanner } from "@/components/desk/sample-banner";
import type { DeskSnapshot } from "@/lib/data/types";
import { formatSigned, formatUsd } from "@/lib/format";

export function HomeLanding({ snapshot }: { snapshot: DeskSnapshot }) {
  const readyIdeas = snapshot.tradeIdeas.filter((i) => i.status === "ready").length;
  const activeTheses = snapshot.theses.filter((t) => t.status === "active").length;

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

        <header className="px-4 pb-4 pt-10 md:px-8 md:pt-14">
          <div className="mx-auto max-w-6xl space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal-ink)]">
              Macro hedge fund platform
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[0.92] tracking-tight text-[var(--ink)] md:text-7xl">
              Macro Desk
            </h1>
            <p className="max-w-2xl text-lg text-[var(--ink-muted)]">
              Two modules, two dashboards — portfolio management for the PM, and
              trade support for the portfolio analyst desk.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-2 font-mono text-xs text-[var(--ink-faint)]">
              <span>
                AUM{" "}
                <span className="text-[var(--ink)]">
                  {formatUsd(snapshot.book.aumUsd, true)}
                </span>
              </span>
              <span>
                MTD{" "}
                <span className="text-[var(--ink)]">
                  {formatSigned(snapshot.book.mtdReturnPct, 2, "%")}
                </span>
              </span>
              <span>
                Active theses{" "}
                <span className="text-[var(--ink)]">{activeTheses}</span>
              </span>
              <span>
                Ideas ready{" "}
                <span className="text-[var(--ink)]">{readyIdeas}</span>
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto grid max-w-6xl gap-4 px-4 py-8 md:grid-cols-2 md:px-8 md:py-10">
          <ModuleCard
            href="/pm"
            kicker="Portfolio manager"
            title="PM desk"
            body="Fund book, research theses, catalyst calendar, scenario shock packs, and market tools for reading the cycle."
            points={[
              "Book risk, exposures, and P&L",
              "Theses and catalyst map",
              "Scenarios and Markets lab",
            ]}
            cta="Open PM dashboard"
          />
          <ModuleCard
            href="/trade-support"
            kicker="Portfolio analyst"
            title="Trade support"
            body="Trade-idea queue, pre-trade checks, factor risk budgets, and hedge notes — the PA workflow that feeds the PM."
            points={[
              "Ticket queue with status filters",
              "Pass / warn / fail pre-trade checks",
              "Budgets and book context for sizing",
            ]}
            cta="Open trade support"
          />
        </main>
      </div>
    </div>
  );
}

function ModuleCard({
  href,
  kicker,
  title,
  body,
  points,
  cta,
}: {
  href: string;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group border border-[var(--ink-line)] bg-[var(--paper)]/80 p-6 transition-all hover:border-[var(--data)] hover:bg-[var(--data-soft)]/40 md:p-8"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--signal-ink)]">
        {kicker}
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">{body}</p>
      <ul className="mt-5 space-y-1.5">
        {points.map((point) => (
          <li key={point} className="text-sm text-[var(--ink-muted)]">
            · {point}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm font-medium text-[var(--data-ink)] group-hover:underline">
        {cta} →
      </p>
    </Link>
  );
}
