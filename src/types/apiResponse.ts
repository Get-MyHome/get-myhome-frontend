/**
 * 모든 API 응답의 공통 봉투. Swagger 문서는 successCode 로 나오지만
 * 실제 응답은 success_code 다 — 실측값 기준. 성공 시 "SUCCESS" 확인됨,
 * 그 외 값 체계는 아직 미정이다.
 */
export interface ApiResponse<T> {
  success_code: string;
  message: string;
  data: T;
}
