import { TradeSupportDashboard } from "@/components/desk/trade-support-dashboard";
import { getDeskSnapshot } from "@/lib/data/provider";

export default async function TradeSupportPage() {
  const snapshot = await getDeskSnapshot();
  return <TradeSupportDashboard snapshot={snapshot} />;
}
