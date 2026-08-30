import axios from "axios";

import type { ApiErrorBody } from "@/types/apiResponse";

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60_000,
});

/** 에러의 HTTP 상태 코드. axios 에러가 아니면 undefined (네트워크 오류 등) */
export function getHttpStatus(error: unknown): number | undefined {
  return axios.isAxiosError<ApiErrorBody>(error)
    ? error.response?.status
    : undefined;
}
