import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/shared/config/env";
import type { ApiSuccess } from "@/shared/types/api";

import { isUnauthorizedError, toApiRequestError } from "./errors";
import { notifyAuthSessionInvalidated } from "./session-invalidation";
import { getAccessToken, setAccessToken } from "./token";

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

/** Cookie-based auth (login, refresh, logout). No Bearer header or 401 refresh loop. */
export const credentialsClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

let refreshInFlight: Promise<string> | null = null;

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) {
    return false;
  }

  return (
    url.includes("/auth/login") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout")
  );
}

async function requestNewAccessToken(): Promise<string> {
  try {
    const response = await credentialsClient.post<ApiSuccess<{ accessToken: string }>>(
      "/auth/refresh",
    );
    const token = response.data.data.accessToken;
    setAccessToken(token);
    return token;
  } catch (error) {
    if (isUnauthorizedError(error)) {
      notifyAuthSessionInvalidated();
    }

    throw toApiRequestError(error);
  }
}

/**
 * Single in-flight refresh for the whole app (bootstrap + 401 interceptor).
 * Avoids parallel /auth/refresh calls, which would rotate/revoke refresh sessions.
 */
export function getRefreshedAccessToken(): Promise<string> {
  refreshInFlight ??= requestNewAccessToken().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

credentialsClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(toApiRequestError(error)),
);

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const shouldRefresh =
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthEndpoint(original.url);

    if (!shouldRefresh || !original) {
      return Promise.reject(toApiRequestError(error));
    }

    original._retry = true;

    try {
      const token = await getRefreshedAccessToken();
      original.headers.set("Authorization", `Bearer ${token}`);
      return apiClient(original);
    } catch (refreshError) {
      return Promise.reject(toApiRequestError(refreshError));
    }
  },
);

export async function apiData<T>(
  response: Promise<AxiosResponse<ApiSuccess<T>>>,
): Promise<T> {
  const { data } = await response;
  return data.data;
}

export function definedParams(
  params: Record<string, string | number | undefined>,
): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(params).filter(
      (entry): entry is [string, string | number] => entry[1] !== undefined,
    ),
  );
}