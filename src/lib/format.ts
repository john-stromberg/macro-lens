import type { IndicatorRelease, SurpriseSign } from "./data/types";

export function formatNumber(value: number, digits = 1): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatSigned(value: number, digits = 1, suffix = ""): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, digits)}${suffix}`;
}

export function surpriseOf(release: IndicatorRelease): SurpriseSign | null {
  if (release.actual === null) return null;
  const delta = release.actual - release.consensus;
  if (Math.abs(delta) < 1e-9) return "inline";
  return delta > 0 ? "beat" : "miss";
}

export function surpriseDelta(release: IndicatorRelease): number | null {
  if (release.actual === null) return null;
  return release.actual - release.consensus;
}

export function formatDateUTC(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    year: "numeric",
    ...opts,
  }).format(new Date(iso));
}

export function formatDateTimePT(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}

export function formatUsd(value: number, compact = false): string {
  if (compact) {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    if (abs >= 1_000_000_000) return `${sign}$${formatNumber(abs / 1_000_000_000, 2)}B`;
    if (abs >= 1_000_000) return `${sign}$${formatNumber(abs / 1_000_000, 1)}M`;
    if (abs >= 1_000) return `${sign}$${formatNumber(abs / 1_000, 0)}K`;
    return `${sign}$${formatNumber(abs, 0)}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatSignedUsd(value: number, compact = true): string {
  const body = formatUsd(Math.abs(value), compact);
  if (value > 0) return `+${body}`;
  if (value < 0) return `-${body}`;
  return body;
}
