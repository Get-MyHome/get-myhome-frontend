import { httpClient } from "@/lib/httpClient";
import type { ApiResponse } from "@/types/apiResponse";

export interface VerdictEmailResult {
  status: string;
  email: string;
  /** ISO 8601 */
  sent_at: string;
}

/**
 * POST /verdicts/{verdictId}/email — 판정 결과 리포트를 이메일로 발송.
 * verdictId 는 POST /verdicts 응답에서 나온다 (그 API 는 아직 미연동).
 */
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
