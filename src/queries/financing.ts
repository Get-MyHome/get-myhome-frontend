import { useQuery } from "@tanstack/react-query";

import { fetchFinancingRoutes } from "@/apis/financing";
import type { UserConditionRequest } from "@/types/financing";

export const financingKeys = {
  routes: (user: UserConditionRequest) => ["financing-routes", user] as const,
};

/** user 가 없으면 (조건 미완성 · 아직 안 읽음) 호출하지 않는다 */
export function useFinancingRoutesQuery(
  user: UserConditionRequest | null | undefined
) {
  return useQuery({
    queryKey: financingKeys.routes(user ?? ({} as UserConditionRequest)),
    queryFn: () => fetchFinancingRoutes(user as UserConditionRequest),
    enabled: user != null,
  });
}
