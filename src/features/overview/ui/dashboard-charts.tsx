"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import { formatChartAxisDate, formatChartTooltipDate } from "@/features/overview/lib/format-chart-date";
import type {
  DashboardConditionStat,
  DashboardDateStat,
  DashboardDoctorStat,
  DashboardGroupBy,
} from "@/features/overview/model/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";

const patientsByDateConfig = {
  count: {
    label: "Patients",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const patientsPerDoctorConfig = {
  patients: {
    label: "Patients",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const CONDITION_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="text-muted-foreground flex h-[min(320px,50vh)] items-center justify-center px-6 text-center text-sm">
      {message}
    </div>
  );
}

type PatientsByDateChartProps = {
  data: DashboardDateStat[];
  groupBy: DashboardGroupBy;
};

export function PatientsByDateChart({ data, groupBy }: PatientsByDateChartProps) {
  const chartData = useMemo(
    () =>
      data.map((row) => ({
        date: row.date,
        count: row.count,
        label: formatChartAxisDate(row.date, groupBy),
      })),
    [data, groupBy],
  );

  if (chartData.length === 0) {
    return <ChartEmptyState message="No visit dates in this range yet." />;
  }

  return (
    <ChartContainer config={patientsByDateConfig} className="aspect-auto h-[min(360px,55vh)] w-full">
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          tickFormatter={(value) => formatChartAxisDate(String(value), groupBy)}
        />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={36} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                const date = payload?.[0]?.payload?.date as string | undefined;
                return date ? formatChartTooltipDate(date, groupBy) : null;
              }}
            />
          }
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ChartContainer>
  );
}

type PatientsPerDoctorChartProps = {
  data: DashboardDoctorStat[];
};

export function PatientsPerDoctorChart({ data }: PatientsPerDoctorChartProps) {
  const chartData = useMemo(
    () =>
      data.map((doctor) => ({
        doctorId: doctor.doctorId,
        name: doctor.name,
        patients: doctor.patientCount,
        meta: [doctor.specialization, doctor.hospital].filter(Boolean).join(" · "),
      })),
    [data],
  );

  if (chartData.length === 0) {
    return <ChartEmptyState message="No doctors on the roster yet." />;
  }

  const chartHeight = Math.min(420, Math.max(220, chartData.length * 44));

  return (
    <ChartContainer
      config={patientsPerDoctorConfig}
      className="aspect-auto w-full"
      style={{ height: chartHeight }}
    >
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={112}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => (value.length > 16 ? `${value.slice(0, 15)}…` : value)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                const meta = payload?.[0]?.payload?.meta as string | undefined;
                return meta || payload?.[0]?.payload?.name;
              }}
            />
          }
        />
        <Bar dataKey="patients" fill="var(--color-patients)" radius={[0, 4, 4, 0]} maxBarSize={28} />
      </BarChart>
    </ChartContainer>
  );
}

type ConditionsChartProps = {
  data: DashboardConditionStat[];
};

function conditionLabel(condition: string | null): string {
  return condition?.trim() ? condition : "Unspecified";
}

export function ConditionsChart({ data }: ConditionsChartProps) {
  const chartData = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.count - a.count);
    const top = sorted.slice(0, 8);
    const rest = sorted.slice(8);
    const otherCount = rest.reduce((sum, row) => sum + row.count, 0);

    const rows: Array<{
      key: string;
      condition: string;
      count: number;
      fill: string;
    }> = top.map((row, index) => ({
      key: row.condition ?? "__none__",
      condition: conditionLabel(row.condition),
      count: row.count,
      fill: CONDITION_COLORS[index % CONDITION_COLORS.length],
    }));

    if (otherCount > 0) {
      rows.push({
        key: "__other__",
        condition: `Other (${rest.length})`,
        count: otherCount,
        fill: "var(--muted-foreground)",
      });
    }

    return rows;
  }, [data]);

  const conditionConfig = useMemo(() => {
    const config: ChartConfig = {};
    for (const row of chartData) {
      config[row.condition] = {
        label: row.condition,
        color: row.fill,
      };
    }
    return config;
  }, [chartData]);

  if (chartData.length === 0) {
    return <ChartEmptyState message="No condition data for this range." />;
  }

  const total = chartData.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
      <ChartContainer config={conditionConfig} className="mx-auto aspect-square max-h-[300px] w-full max-w-[300px]">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="condition"
            innerRadius={58}
            outerRadius={96}
            paddingAngle={2}
          >
            {chartData.map((row) => (
              <Cell key={row.key} fill={row.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <ul className="grid gap-2 text-sm">
        {chartData.map((row) => {
          const percent = total > 0 ? Math.round((row.count / total) * 100) : 0;
          return (
            <li
              key={row.key}
              className="border-border/60 flex items-center justify-between gap-3 border-b pb-2 last:border-0"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: row.fill }}
                  aria-hidden="true"
                />
                <span className="truncate">{row.condition}</span>
              </div>
              <div className="text-muted-foreground shrink-0 tabular-nums">
                {row.count.toLocaleString()}
                <span className="text-foreground ml-2 font-medium">{percent}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}