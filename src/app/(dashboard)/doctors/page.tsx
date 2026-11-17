import type { Metadata } from "next";

import { Card, CardDescription, CardHeader } from "@/shared/ui/card";
import { DashboardPage } from "@/shared/ui/dashboard-page";
import { PageHeader } from "@/shared/ui/page-header";

export const metadata: Metadata = {
  title: "Doctors",
};

export default function DoctorsPage() {
  return (
    <DashboardPage>
      <PageHeader
        title="Doctors"
        description="Browse and manage doctors on the clinic roster."
      />
      <Card>
        <CardHeader>
          <CardDescription>
            The doctor directory will load from the doctors feature.
          </CardDescription>
        </CardHeader>
      </Card>
    </DashboardPage>
  );
}
