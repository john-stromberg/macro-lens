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

export type PositionSide = "long" | "short";

export type RiskFactor =
  | "rates"
  | "fx"
  | "equity"
  | "credit"
  | "commodity"
  | "vol";

export type Position = {
  id: string;
  name: string;
  ticker: string;
  sleeve: AssetMove["sleeve"];
  side: PositionSide;
  region: string;
  factor: RiskFactor;
  /** Signed USD notional (long +, short −). */
  notionalUsd: number;
  /** Approximate USD P&L for a 1% adverse move / DV01-style risk unit. */
  riskUsd: number;
  mtdPnlUsd: number;
  dtdPnlUsd: number;
  ytdPnlUsd: number;
  thesisId: string | null;
  entry: string;
  notes: string;
};

export type ThesisStatus = "active" | "watching" | "closed" | "killed";

export type Thesis = {
  id: string;
  title: string;
  status: ThesisStatus;
  conviction: 1 | 2 | 3 | 4 | 5;
  horizon: string;
  owner: string;
  region: string;
  summary: string;
  catalysts: string[];
  risks: string[];
  updatedAt: string;
};

export type Catalyst = {
  id: string;
  title: string;
  when: string;
  kind: "release" | "cb" | "event";
  region: string;
  importance: "high" | "medium";
  thesisIds: string[];
  bookRelevance: string;
};

export type ScenarioShock = {
  label: string;
  move: string;
};

export type Scenario = {
  id: string;
  name: string;
  description: string;
  shocks: ScenarioShock[];
  estimatedPnlUsd: number;
  winners: string[];
  losers: string[];
};

export type FundBook = {
  name: string;
  aumUsd: number;
  nav: number;
  mtdReturnPct: number;
  ytdReturnPct: number;
  grossExposurePct: number;
  netExposurePct: number;
  var95Usd: number;
  positions: Position[];
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
  book: FundBook;
  theses: Thesis[];
  catalysts: Catalyst[];
  scenarios: Scenario[];
};
