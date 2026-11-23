import { PmDashboard } from "@/components/desk/pm-dashboard";
import { getDeskSnapshot } from "@/lib/data/provider";

export default async function PmPage() {
  const snapshot = await getDeskSnapshot();
  return <PmDashboard snapshot={snapshot} />;
}
