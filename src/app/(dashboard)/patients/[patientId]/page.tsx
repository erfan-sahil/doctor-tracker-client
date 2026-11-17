import type { Metadata } from "next";
import { Suspense } from "react";

import { Card, CardDescription, CardHeader } from "@/shared/ui/card";
import { DashboardPage } from "@/shared/ui/dashboard-page";
import { PageHeader } from "@/shared/ui/page-header";
import { Skeleton } from "@/shared/ui/skeleton";

type PatientPageProps = PageProps<"/patients/[patientId]">;

export async function generateMetadata({ params }: PatientPageProps): Promise<Metadata> {
  const { patientId } = await params;

  return {
    title: `Patient ${patientId}`,
  };
}

export default function PatientPage({ params }: PatientPageProps) {
  return (
    <Suspense
      fallback={
        <DashboardPage>
          <Skeleton className="h-8 w-40" />
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-full max-w-md" />
            </CardHeader>
          </Card>
        </DashboardPage>
      }
    >
      {params.then(({ patientId }) => (
        <DashboardPage>
          <PageHeader title="Patient" description={`Record for patient ${patientId}.`} />
          <Card>
            <CardHeader>
              <CardDescription>
                Patient {patientId} will load from the patients feature.
              </CardDescription>
            </CardHeader>
          </Card>
        </DashboardPage>
      ))}
    </Suspense>
  );
}
