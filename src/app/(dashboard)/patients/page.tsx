import type { Metadata } from "next";

import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export const metadata: Metadata = {
  title: "Patients",
};

export default function PatientsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Patients</CardTitle>
        <CardDescription>
          The patient list will load from the patients feature.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
