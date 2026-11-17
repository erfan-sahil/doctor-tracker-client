import { z } from "zod";

const apiUrlSchema = z.string().url();

const defaultApiUrl = "http://localhost:5000/api/v1";

function readApiUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_URL;

  if (!value) {
    return defaultApiUrl;
  }

  return apiUrlSchema.parse(value).replace(/\/$/, "");
}

export const env = {
  apiUrl: readApiUrl(),
};
