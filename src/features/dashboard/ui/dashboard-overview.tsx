import { Activity, Stethoscope, Users } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { DashboardPage } from "@/shared/ui/dashboard-page";
import { PageHeader } from "@/shared/ui/page-header";

const stats = [
  {
    label: "Doctors",
    value: "0",
    hint: "People on the clinic roster",
    icon: Stethoscope,
  },
  {
    label: "Patients",
    value: "0",
    hint: "Records in the clinic",
    icon: Users,
  },
  {
    label: "Visits",
    value: "0",
    hint: "Patients grouped by date",
    icon: Activity,
  },
] as const;

export function DashboardOverview() {
  return (
    <DashboardPage>
      <PageHeader
        title="Dashboard"
        description="Clinic totals, patients per doctor, and activity over time."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl font-semibold">{stat.value}</CardTitle>
                <CardAction>
                  <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </CardAction>
              </CardHeader>
              <CardFooter>
                <p className="text-muted-foreground text-xs">{stat.hint}</p>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="min-h-56">
          <CardHeader className="border-b">
            <CardTitle>Patients per doctor</CardTitle>
            <CardDescription>How the roster is split across doctors.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground max-w-xs text-center text-sm">
              Doctor totals will appear here once the clinic has records.
            </p>
          </CardContent>
        </Card>
        <Card className="min-h-56">
          <CardHeader className="border-b">
            <CardTitle>Conditions</CardTitle>
            <CardDescription>Patients grouped by condition.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground max-w-xs text-center text-sm">
              Condition counts will appear here once patients are added.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Patients by date</CardTitle>
          <CardDescription>New patients across the selected range.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex h-32 items-end gap-1.5 sm:h-40 sm:gap-2">
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className="bg-primary/20 min-w-0 flex-1 rounded-t-md"
                style={{ height: "12%" }}
              />
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            Bars stay flat until visit dates are available.
          </p>
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
