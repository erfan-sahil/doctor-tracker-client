import { apiClient, apiData, definedParams } from "@/shared/lib/api/client";
import type { ApiSuccess } from "@/shared/types/api";

import type { Dashboard, DashboardParams } from "../model/types";

export function getDashboard(params: DashboardParams = {}): Promise<Dashboard> {
  return apiData(
    apiClient.get<ApiSuccess<Dashboard>>("/dashboard", {
      params: definedParams(params),
    }),
  );
}
