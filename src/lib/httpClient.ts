import axios from "axios";

import type { ApiErrorBody } from "@/types/apiResponse";

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60_000,
});

/** 에러 응답 body 의 message 를 꺼낸다. 형식이 다르면 fallback */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}
