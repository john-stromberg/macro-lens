export type SurpriseSign = "beat" | "miss" | "inline";

export type IndicatorRelease = {
  id: string;
  name: string;
  region: string;
  period: string;
  unit: string;
  actual: number | null;
  consensus: number;
  previous: number;
  releasedAt: string | null;
  importance: "high" | "medium";
};

export type YieldPoint = {
  tenor: string;
  months: number;
  yield: number;
};

export type YieldCurveSnapshot = {
  id: string;
  label: string;
  asOf: string;
  points: YieldPoint[];
};

export type CentralBank = {
  id: string;
  name: string;
  region: string;
  policyRate: number;
  priorRate: number;
  lastDecision: string;
  nextMeeting: string;
  stance: "easing" | "tightening" | "hold";
  path: { date: string; rate: number }[];
};

export type RegimePoint = {
  id: string;
  economy: string;
  growth: number;
  inflation: number;
  growthMom: number;
  inflationMom: number;
};

export type AssetMove = {
  id: string;
  name: string;
  ticker: string;
  sleeve: "rates" | "credit" | "equity" | "fx" | "commodity";
  weekPct: number;
  monthPct: number;
  ytdPct: number;
  level: number;
  unit: string;
};

export type DeskSnapshot = {
  asOf: string;
  source: "sample" | "live";
  note: string;
  releases: IndicatorRelease[];
  curves: YieldCurveSnapshot[];
  banks: CentralBank[];
  regimes: RegimePoint[];
  assets: AssetMove[];
};
