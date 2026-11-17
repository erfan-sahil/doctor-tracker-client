"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, BarChart3, LineChart, PieChart, Stethoscope, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { useSessionStore } from "@/features/auth/model/session-store";
import type { DashboardParams } from "@/features/overview/model/types";
import { overviewQuery } from "@/features/overview/queries/overview";
import {
  ConditionsChart,
  PatientsByDateChart,
  PatientsPerDoctorChart,
} from "@/features/overview/ui/dashboard-charts";
import { DashboardFilterCard } from "@/features/overview/ui/dashboard-filter-card";
import { DashboardSectionCard } from "@/features/overview/ui/dashboard-section-card";
import {
  DashboardStatCard,
  type DashboardStatAccent,
} from "@/features/overview/ui/dashboard-stat-card";
import {
  DashboardToolbar,
  defaultDashboardFilters,
  type DashboardFilters,
} from "@/features/overview/ui/dashboard-toolbar";
import { toApiRequestError } from "@/shared/lib/api/errors";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { DashboardPage } from "@/shared/ui/dashboard-page";
import { PageHeader } from "@/shared/ui/page-header";
import { Skeleton } from "@/shared/ui/skeleton";

function filtersToParams(filters: DashboardFilters): DashboardParams {
  const params: DashboardParams = { groupBy: filters.groupBy };

  if (filters.from) {
    params.from = filters.from;
  }
  if (filters.to) {
    params.to = filters.to;
  }

  return params;
}

function formatStat(value: number | undefined): string {
  if (value === undefined) {
    return "—";
  }

  return value.toLocaleString();
}

type StatConfig = {
  key: DashboardStatAccent;
  label: string;
  value: string;
  hint: string;
  icon: typeof Users;
};

export function OverviewPage() {
  const user = useSessionStore((state) => state.user);
  const isAdmin = user?.role === "admin";
  const [filters, setFilters] = useState(defaultDashboardFilters);

  const queryParams = useMemo(() => filtersToParams(filters), [filters]);
  const { data, isPending, isError, error, isFetching } = useQuery(overviewQuery(queryParams));

  const visitSeriesTotal = useMemo(
    () => data?.patientsByDate.reduce((sum, row) => sum + row.count, 0) ?? 0,
    [data?.patientsByDate],
  );

  const stats = useMemo((): StatConfig[] => {
    const items: StatConfig[] = [
      {
        key: "patients",
        label: "Patients",
        value: formatStat(data?.totalPatients),
        hint:
          filters.from || filters.to
            ? "With a visit date in the selected range"
            : "All records in the clinic",
        icon: Users,
      },
      {
        key: "visits",
        label: "Dated visits",
        value: formatStat(visitSeriesTotal),
        hint: `Visit volume grouped by ${filters.groupBy === "month" ? "month" : "day"}`,
        icon: Activity,
      },
    ];

    if (isAdmin) {
      items.unshift({
        key: "doctors",
        label: "Doctors",
        value: formatStat(data?.totalDoctors),
        hint: "Providers on the active roster",
        icon: Stethoscope,
      });
    }

    return items;
  }, [
    data?.totalDoctors,
    data?.totalPatients,
    filters.from,
    filters.groupBy,
    filters.to,
    isAdmin,
    visitSeriesTotal,
  ]);

  return (
    <DashboardPage>
      <PageHeader
        title={isAdmin ? "Admin overview" : "Doctor overview"}
        description="Clinic totals, patients per doctor, and activity over time."
      />

      <DashboardFilterCard>
        <DashboardToolbar
          filters={filters}
          onFiltersChange={setFilters}
          disabled={isPending}
        />
      </DashboardFilterCard>

      {isError ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle>Could not load overview</CardTitle>
            <CardDescription>{toApiRequestError(error).message}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <section aria-labelledby="overview-metrics-heading" className="space-y-3">
        <h2 id="overview-metrics-heading" className="text-foreground/90 text-sm font-medium">
          Key metrics
        </h2>
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.key}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            icon={stat.icon}
            loading={isPending}
          />
        ))}
        </div>
      </section>

      <DashboardSectionCard
        title="Patients by date"
        icon={LineChart}
        description={
          <>
            Visit volume over time
            {isFetching && !isPending ? (
              <span className="text-muted-foreground ml-1.5">· Updating…</span>
            ) : null}
          </>
        }
      >
        {isPending ? (
          <Skeleton className="h-[min(360px,55vh)] w-full rounded-xl" />
        ) : (
          <PatientsByDateChart data={data?.patientsByDate ?? []} groupBy={filters.groupBy} />
        )}
      </DashboardSectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardSectionCard
          title="Patients per doctor"
          icon={BarChart3}
          description="Patient load across the roster for this range."
        >
          {isPending ? (
            <Skeleton className="h-56 w-full rounded-xl" />
          ) : (
            <PatientsPerDoctorChart data={data?.patientsPerDoctor ?? []} />
          )}
        </DashboardSectionCard>

        <DashboardSectionCard
          title="Conditions"
          icon={PieChart}
          description="Share of patients by reported condition."
        >
          {isPending ? (
            <Skeleton className="h-56 w-full rounded-xl" />
          ) : (
            <ConditionsChart data={data?.patientsByCondition ?? []} />
          )}
        </DashboardSectionCard>
      </div>
    </DashboardPage>
  );
}