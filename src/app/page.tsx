import { DeskShell } from "@/components/desk/desk-shell";
import { getDeskSnapshot } from "@/lib/data/provider";

export default async function HomePage() {
  const snapshot = await getDeskSnapshot();
  return <DeskShell snapshot={snapshot} />;
}
