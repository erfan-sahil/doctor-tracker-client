import { queryOptions } from "@tanstack/react-query";

import { getDashboard } from "../api/overview-api";
import type { DashboardParams } from "../model/types";
import { overviewKeys } from "./keys";

export function overviewQuery(params: DashboardParams = {}) {
  return queryOptions({
    queryKey: overviewKeys.detail(params),
    queryFn: () => getDashboard(params),
  });
}
