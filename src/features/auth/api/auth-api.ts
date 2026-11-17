import { apiClient, apiData } from "@/shared/lib/api/client";
import type { ApiSuccess } from "@/shared/types/api";

import type { LoginInput, LoginResult, PublicUser, RefreshResult } from "../model/types";

export function login(input: LoginInput): Promise<LoginResult> {
  return apiData(apiClient.post<ApiSuccess<LoginResult>>("/auth/login", input));
}

export function refreshSession(): Promise<RefreshResult> {
  return apiData(apiClient.post<ApiSuccess<RefreshResult>>("/auth/refresh"));
}

export function getCurrentUser(): Promise<PublicUser> {
  return apiData(apiClient.get<ApiSuccess<PublicUser>>("/auth/me"));
}

export function logout(): Promise<null> {
  return apiData(apiClient.post<ApiSuccess<null>>("/auth/logout"));
}
