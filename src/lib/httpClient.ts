import axios from "axios";

import type { ApiErrorBody } from "@/types/apiResponse";

// 항상 same-origin 프록시로 호출한다. Next 서버가 백엔드(HTTP)로 넘긴다
// (next.config 의 rewrite) — HTTPS 배포의 Mixed Content 우회.
// 백엔드 주소는 서버 환경변수 BACKEND_API_ORIGIN 로만 바꾼다.
export const httpClient = axios.create({
  baseURL: "/api/proxy",
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
