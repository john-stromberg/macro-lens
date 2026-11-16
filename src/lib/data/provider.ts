import { sampleSnapshot } from "./sample";
import type { DeskSnapshot } from "./types";

/**
 * Returns the research desk snapshot.
 * Live vendor wiring can replace the sample branch without changing UI tools.
 */
export async function getDeskSnapshot(): Promise<DeskSnapshot> {
  // Placeholder for FRED / vendor clients. Until a key is bound, sample data ships.
  const liveConfigured = Boolean(process.env.MACRO_DATA_API_KEY);

  if (!liveConfigured) {
    return sampleSnapshot;
  }

  try {
    // Intentionally not calling a live endpoint yet — keep mock fallback safe.
    return {
      ...sampleSnapshot,
      source: "sample",
      note: "API key present, but no live adapter is configured yet. Showing sample tape.",
    };
  } catch {
    return {
      ...sampleSnapshot,
      note: "Live fetch failed. Showing sample tape.",
    };
  }
}
