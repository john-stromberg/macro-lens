import { HomeLanding } from "@/components/desk/home-landing";
import { getDeskSnapshot } from "@/lib/data/provider";

export default async function HomePage() {
  const snapshot = await getDeskSnapshot();
  return <HomeLanding snapshot={snapshot} />;
}
