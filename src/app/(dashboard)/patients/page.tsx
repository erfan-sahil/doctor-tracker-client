import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patients",
};

export default function PatientsPage() {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
      <p className="text-muted-foreground text-sm">
        The patient list will load from the patients feature.
      </p>
    </section>
  );
}
