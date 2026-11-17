import type { Metadata } from "next";

import { Card, CardDescription, CardHeader } from "@/shared/ui/card";
import { DashboardPage } from "@/shared/ui/dashboard-page";
import { PageHeader } from "@/shared/ui/page-header";

export const metadata: Metadata = {
  title: "Patients",
};

export default function PatientsPage() {
  return (
    <DashboardPage>
      <PageHeader title="Patients" description="View and manage patient records." />
      <Card>
        <CardHeader>
          <CardDescription>
            The patient list will load from the patients feature.
          </CardDescription>
        </CardHeader>
      </Card>
    </DashboardPage>
  );
}