import { queryOptions } from "@tanstack/react-query";

import { getDashboard } from "../api/dashboard-api";
import type { DashboardParams } from "../model/types";
import { dashboardKeys } from "./keys";

export function dashboardQuery(params: DashboardParams = {}) {
  return queryOptions({
    queryKey: dashboardKeys.detail(params),
    queryFn: () => getDashboard(params),
  });
}
