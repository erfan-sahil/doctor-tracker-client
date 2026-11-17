import { queryOptions } from "@tanstack/react-query";

import { getCurrentUser } from "../api/auth-api";

export const currentUserQuery = queryOptions({
  queryKey: ["auth", "me"] as const,
  queryFn: getCurrentUser,
});
