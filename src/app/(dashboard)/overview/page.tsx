import type { Metadata } from "next";

import { OverviewPage } from "@/features/overview/ui/overview-page";

export const metadata: Metadata = {
  title: "Overview",
};

export default function OverviewRoutePage() {
  return <OverviewPage />;
}