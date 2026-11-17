import type { Metadata } from "next";
import { Suspense } from "react";

import { Card, CardDescription, CardHeader } from "@/shared/ui/card";
import { DashboardPage } from "@/shared/ui/dashboard-page";
import { PageHeader } from "@/shared/ui/page-header";
import { Skeleton } from "@/shared/ui/skeleton";

type DoctorPageProps = PageProps<"/doctors/[doctorId]">;

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  const { doctorId } = await params;

  return {
    title: `Doctor ${doctorId}`,
  };
}

export default function DoctorPage({ params }: DoctorPageProps) {
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
      {params.then(({ doctorId }) => (
        <DashboardPage>
          <PageHeader title="Doctor" description={`Profile for doctor ${doctorId}.`} />
          <Card>
            <CardHeader>
              <CardDescription>
                Doctor {doctorId} will load from the doctors feature.
              </CardDescription>
            </CardHeader>
          </Card>
        </DashboardPage>
      ))}
    </Suspense>
  );
}
