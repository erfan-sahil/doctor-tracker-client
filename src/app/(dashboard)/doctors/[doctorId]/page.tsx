import type { Metadata } from "next";
import { Suspense } from "react";

type DoctorPageProps = PageProps<"/doctors/[doctorId]">;

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  const { doctorId } = await params;

  return {
    title: `Doctor ${doctorId}`,
  };
}

export default function DoctorPage({ params }: DoctorPageProps) {
  return (
    <Suspense fallback={<p className="text-muted-foreground text-sm">Loading doctor…</p>}>
      {params.then(({ doctorId }) => (
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Doctor</h1>
          <p className="text-muted-foreground text-sm">
            Doctor {doctorId} will load from the doctors feature.
          </p>
        </section>
      ))}
    </Suspense>
  );
}
