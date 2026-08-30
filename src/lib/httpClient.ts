import axios from "axios";

import type { ApiErrorBody } from "@/types/apiResponse";

// 기본값은 next.config 의 rewrite 프록시(/api/proxy/*). 브라우저가 같은 오리진으로
// 호출하고 Next 서버가 백엔드(HTTP)로 넘긴다 — HTTPS 배포의 Mixed Content 우회.
export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api/proxy",
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
