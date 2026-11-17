import type { DashboardParams } from "../model/types";

export const overviewKeys = {
  all: ["overview"] as const,
  detail: (params: DashboardParams) => [...overviewKeys.all, params] as const,
};
