import type { Metadata } from "next";
import { Suspense } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
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
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
        </Card>
      }
    >
      {params.then(({ patientId }) => (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Patient</CardTitle>
            <CardDescription>
              Patient {patientId} will load from the patients feature.
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </Suspense>
  );
}
