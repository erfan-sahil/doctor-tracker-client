import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctors",
};

export default function DoctorsPage() {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">Doctors</h1>
      <p className="text-muted-foreground text-sm">
        The doctor directory will load from the doctors feature.
      </p>
    </section>
  );
}
