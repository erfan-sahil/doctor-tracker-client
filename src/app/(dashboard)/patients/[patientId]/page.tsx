import type { Metadata } from "next";
import { Suspense } from "react";

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
      fallback={<p className="text-muted-foreground text-sm">Loading patient…</p>}
    >
      {params.then(({ patientId }) => (
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Patient</h1>
          <p className="text-muted-foreground text-sm">
            Patient {patientId} will load from the patients feature.
          </p>
        </section>
      ))}
    </Suspense>
  );
}
