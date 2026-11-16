import { Badge } from "@/components/ui/badge";
import type { DeskSnapshot } from "@/lib/data/types";
import { formatDateTimePT } from "@/lib/format";

export function SampleBanner({ snapshot }: { snapshot: DeskSnapshot }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-[var(--ink-line)] bg-[var(--ink-wash)]/70 px-4 py-2 text-sm text-[var(--ink-muted)] md:px-6">
      <Badge
        variant="outline"
        className="rounded-sm border-[var(--signal)]/40 bg-[var(--signal-soft)] font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--signal-ink)]"
      >
        {snapshot.source === "sample" ? "Sample data" : "Live feed"}
      </Badge>
      <p className="min-w-0 flex-1 leading-snug">{snapshot.note}</p>
      <p className="font-mono text-xs tabular-nums text-[var(--ink-faint)]">
        As of {formatDateTimePT(snapshot.asOf)}
      </p>
    </div>
  );
}
