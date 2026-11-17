import type { Metadata } from "next";

import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export const metadata: Metadata = {
  title: "Doctors",
};

export default function DoctorsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Doctors</CardTitle>
        <CardDescription>
          The doctor directory will load from the doctors feature.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
