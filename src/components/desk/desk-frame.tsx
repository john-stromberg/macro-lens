import Link from "next/link";
import { SampleBanner } from "@/components/desk/sample-banner";
import type { DeskSnapshot } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export type DeskModule = "home" | "pm" | "trade-support";

export function DeskFrame({
  snapshot,
  module,
  eyebrow,
  title,
  lede,
  stats,
  children,
}: {
  snapshot: DeskSnapshot;
  module: DeskModule;
  eyebrow: string;
  title: string;
  lede: string;
  stats: { label: string; value: string }[];
  children: React.ReactNode;
}) {
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

        <div className="border-b border-[var(--ink-line)] bg-[var(--paper)]/50 px-4 py-2 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 text-sm">
            <Link
              href="/"
              className="font-[family-name:var(--font-display)] text-base text-[var(--ink)] hover:text-[var(--data-ink)]"
            >
              Macro Desk
            </Link>
            <span className="text-[var(--ink-faint)]">/</span>
            <ModuleLink href="/pm" active={module === "pm"}>
              PM
            </ModuleLink>
            <ModuleLink href="/trade-support" active={module === "trade-support"}>
              Trade support
            </ModuleLink>
          </div>
        </div>

        <header className="border-b border-[var(--ink-line)] px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal-ink)]">
                {eyebrow}
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[0.92] tracking-tight text-[var(--ink)] md:text-6xl">
                {title}
              </h1>
              <p className="max-w-xl text-base text-[var(--ink-muted)] md:text-lg">
                {lede}
              </p>
            </div>
            <div
              className={cn(
                "grid gap-x-6 gap-y-2 font-mono text-xs text-[var(--ink-faint)]",
                stats.length >= 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"
              )}
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="uppercase tracking-[0.14em]">{stat.label}</p>
                  <p className="mt-0.5 text-lg tabular-nums text-[var(--ink)]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

function ModuleLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-sm px-2 py-1 font-medium transition-colors",
        active
          ? "bg-[var(--data-soft)] text-[var(--data-ink)]"
          : "text-[var(--ink-muted)] hover:bg-[var(--ink-wash)] hover:text-[var(--ink)]"
      )}
    >
      {children}
    </Link>
  );
}
