import type { Metadata } from "next";

import { DoctorsDirectory } from "@/features/doctors/ui/doctors-directory";
import { DashboardPage } from "@/shared/ui/dashboard-page";

export const metadata: Metadata = {
  title: "Doctors",
};

export default function DoctorsPage() {
  return (
    <DashboardPage>
      <DoctorsDirectory />
    </DashboardPage>
  );
}