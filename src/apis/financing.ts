import { httpClient } from "@/lib/httpClient";
import type { ApiResponse } from "@/types/apiResponse";
import type {
  FinancingRouteResult,
  UserConditionRequest,
} from "@/types/financing";

/** POST /financing-routes — 6개 대출 상품 자격 조회. condition_token 발급 */
export async function fetchFinancingRoutes(
  user: UserConditionRequest
): Promise<FinancingRouteResult> {
  const { data } = await httpClient.post<ApiResponse<FinancingRouteResult>>(
    "/financing-routes",
    user
  );
  return data.data;
}
