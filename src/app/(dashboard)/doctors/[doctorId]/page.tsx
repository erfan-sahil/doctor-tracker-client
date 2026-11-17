import type { Metadata } from "next";
import { Suspense } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
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
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
        </Card>
      }
    >
      {params.then(({ doctorId }) => (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Doctor</CardTitle>
            <CardDescription>
              Doctor {doctorId} will load from the doctors feature.
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </Suspense>
  );
}
