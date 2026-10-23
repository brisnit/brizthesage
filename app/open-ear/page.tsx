import type { Metadata } from "next";
import SanctumGate from "@/components/sanctum/SanctumGate";

// A hidden room: not linked from navigation, not listed anywhere, not indexed.
export const metadata: Metadata = {
  title: "The Open Ear",
  robots: { index: false, follow: false },
};

export default function OpenEarPage() {
  return <SanctumGate />;
}
