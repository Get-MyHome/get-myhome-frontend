import { httpClient } from "@/lib/httpClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { VerdictRequest, VerdictResult } from "@/types/verdict";

/**
 * POST /verdicts — 청약 자금 판정 실행. verdict_id 와 전체 판정 결과를 돌려준다.
 * 처음 보는 공고는 공고문 PDF 분석까지 수행해 오래 걸린다. 클라이언트에서
 * 끊지 않고 서버 응답을 그대로 기다린다.
 */
export async function createVerdict(
  request: VerdictRequest
): Promise<VerdictResult> {
  const { data } = await httpClient.post<ApiResponse<VerdictResult>>(
    "/verdicts",
    request
  );
  return data.data;
}

export interface VerdictEmailResult {
  status: string;
  email: string;
  /** ISO 8601 */
  sent_at: string;
}

/** POST /verdicts/{verdictId}/email — 판정 결과 PDF 를 이메일로 보낸다 */
export async function sendVerdictEmail(
  verdictId: string,
  email: string
): Promise<VerdictEmailResult> {
  const { data } = await httpClient.post<ApiResponse<VerdictEmailResult>>(
    `/verdicts/${verdictId}/email`,
    { email }
  );
  return data.data;
}
