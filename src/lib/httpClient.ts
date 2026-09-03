import axios from "axios";

import type { ApiErrorBody } from "@/types/apiResponse";

// 항상 same-origin 프록시로 호출한다. Next 서버가 백엔드(HTTP)로 넘긴다
// (next.config 의 rewrite) — HTTPS 배포의 Mixed Content 우회.
// 백엔드 주소는 서버 환경변수 BACKEND_API_ORIGIN 로만 바꾼다.
// 타임아웃은 두지 않는다. 클라이언트에서 끊으면 프록시가 업스트림 연결을 닫아
// 백엔드 로그에 클라이언트 끊김으로 남고, 실제 서버 오류와 구분이 어려워진다.
export const httpClient = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

/** 에러의 HTTP 상태 코드. axios 에러가 아니면 undefined (네트워크 오류 등) */
export function getHttpStatus(error: unknown): number | undefined {
  return axios.isAxiosError<ApiErrorBody>(error)
    ? error.response?.status
    : undefined;
}
