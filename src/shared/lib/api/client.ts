import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/shared/config/env";
import type { ApiSuccess } from "@/shared/types/api";

import { toApiRequestError } from "./errors";
import { clearAccessToken, getAccessToken, setAccessToken } from "./token";

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const refreshClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

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

async function refreshAccessToken(): Promise<string | null> {
  const response =
    await refreshClient.post<ApiSuccess<{ accessToken: string }>>("/auth/refresh");
  const token = response.data.data.accessToken;
  setAccessToken(token);
  return token;
}

function refreshOnce(): Promise<string | null> {
  refreshPromise ??= refreshAccessToken().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

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
      const token = await refreshOnce();

      if (!token) {
        clearAccessToken();
        return Promise.reject(toApiRequestError(error));
      }

      original.headers.set("Authorization", `Bearer ${token}`);
      return apiClient(original);
    } catch (refreshError) {
      clearAccessToken();
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
