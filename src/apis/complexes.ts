import { httpClient } from "@/lib/httpClient";
import type { ApiResponse } from "@/types/apiResponse";
import type {
  ComplexDetail,
  ComplexListResponse,
  ComplexRegion,
  HouseCategory,
} from "@/types/complex";

export interface FetchComplexesParams {
  /**
   * 스펙상 미입력 시 전국 조회지만, 실제로는 미입력 시 500 이 난다
   * (백엔드 확인 필요). 그 전까지는 항상 넘겨야 한다.
   */
  region?: ComplexRegion;
  /** 주택 구분 필터. 미입력 시 전체 */
  houseCategory?: HouseCategory;
  page?: number;
  size?: number;
}

export async function fetchComplexes(
  params: FetchComplexesParams = {}
): Promise<ComplexListResponse> {
  const { data } = await httpClient.get<ApiResponse<ComplexListResponse>>(
    "/complexes",
    { params }
  );
  return data.data;
}

export async function fetchComplexDetail(
  complexId: string
): Promise<ComplexDetail> {
  const { data } = await httpClient.get<ApiResponse<ComplexDetail>>(
    `/complexes/${complexId}`
  );
  return data.data;
}
