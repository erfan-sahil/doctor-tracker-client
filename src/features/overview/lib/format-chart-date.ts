import { format, parseISO } from "date-fns";

import type { DashboardGroupBy } from "@/features/overview/model/types";

export function formatChartAxisDate(value: string, groupBy: DashboardGroupBy): string {
  if (groupBy === "month") {
    return format(parseISO(`${value}-01`), "MMM yy");
  }

  return format(parseISO(value), "MMM d");
}

export function formatChartTooltipDate(value: string, groupBy: DashboardGroupBy): string {
  if (groupBy === "month") {
    return format(parseISO(`${value}-01`), "MMMM yyyy");
  }

  return format(parseISO(value), "MMM d, yyyy");
}