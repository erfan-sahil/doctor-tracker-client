import axios from "axios";

import type { ApiFailure } from "@/shared/types/api";

export class ApiRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

function readMessage(data: unknown): string | null {
  if (typeof data !== "object" || data === null || !("message" in data)) {
    return null;
  }

  const message = (data as ApiFailure).message;
  return typeof message === "string" && message.length > 0 ? message : null;
}

export function isUnauthorizedError(error: unknown): boolean {
  return toApiRequestError(error).status === 401;
}

export function toApiRequestError(error: unknown): ApiRequestError {
  if (error instanceof ApiRequestError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return new ApiRequestError(
      readMessage(error.response?.data) ?? "Request failed",
      error.response?.status ?? 0,
    );
  }

  if (error instanceof Error && error.message) {
    return new ApiRequestError(error.message, 0);
  }

  return new ApiRequestError("Request failed", 0);
}
