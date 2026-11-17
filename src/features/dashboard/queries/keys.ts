import type { DashboardParams } from "../model/types";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  detail: (params: DashboardParams) => [...dashboardKeys.all, params] as const,
};
