import type { Metadata } from "next";

import { PatientsDirectory } from "@/features/patients/ui/patients-directory";
import { DashboardPage } from "@/shared/ui/dashboard-page";

export const metadata: Metadata = {
  title: "Patients",
};

export default function PatientsPage() {
  return (
    <DashboardPage>
      <PatientsDirectory />
    </DashboardPage>
  );
}