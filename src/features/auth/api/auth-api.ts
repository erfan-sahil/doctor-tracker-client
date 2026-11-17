import {
  apiClient,
  apiData,
  credentialsClient,
  getRefreshedAccessToken,
} from "@/shared/lib/api/client";
import type { ApiSuccess } from "@/shared/types/api";

import type { LoginInput, LoginResult, PublicUser, RefreshResult } from "../model/types";

export function login(input: LoginInput): Promise<LoginResult> {
  return apiData(credentialsClient.post<ApiSuccess<LoginResult>>("/auth/login", input));
}

export function refreshSession(): Promise<RefreshResult> {
  return getRefreshedAccessToken().then((accessToken) => ({ accessToken }));
}

export function getCurrentUser(): Promise<PublicUser> {
  return apiData(apiClient.get<ApiSuccess<PublicUser>>("/auth/me"));
}

export function logout(): Promise<null> {
  return apiData(credentialsClient.post<ApiSuccess<null>>("/auth/logout"));
}
