import { useMutation, useQuery } from "@tanstack/react-query";

import { createVerdict, sendVerdictEmail } from "@/apis/verdicts";
import type { VerdictRequest } from "@/types/verdict";

export const verdictKeys = {
  detail: (request: VerdictRequest) => ["verdicts", request] as const,
};

/**
 * 판정 실행. 조건 토큰도 user 도 없으면 호출하지 않는다.
 * 같은 조건·단지·평형이면 캐시를 재사용해 중복 판정을 막는다.
 */
export function useVerdictQuery(
  request: VerdictRequest | null,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: verdictKeys.detail(request ?? {}),
    queryFn: () => createVerdict(request as VerdictRequest),
    enabled:
      (options.enabled ?? true) &&
      Boolean(request?.condition_token || request?.user),
    // 판정은 비싸고 결과가 고정이라 화면을 오갈 때 다시 부르지 않는다
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}

export function useVerdictEmailMutation(verdictId: string | null) {
  return useMutation({
    mutationFn: (email: string) => sendVerdictEmail(verdictId as string, email),
  });
}
