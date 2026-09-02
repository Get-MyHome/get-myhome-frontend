import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";

import {
  fetchComplexDetail,
  fetchComplexes,
  fetchMatchedComplexes,
  type FetchComplexesParams,
  type FetchMatchedComplexesParams,
} from "@/apis/complexes";
import { COMPLEX_REGIONS, type ComplexRegion } from "@/types/complex";

export const complexKeys = {
  list: (params: FetchComplexesParams) => ["complexes", params] as const,
  matched: (params: FetchMatchedComplexesParams) =>
    ["complexes", "matched", params] as const,
  detail: (complexId: string) => ["complexes", complexId] as const,
};

export function useComplexesQuery(
  params: FetchComplexesParams = {},
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: complexKeys.list(params),
    queryFn: () => fetchComplexes(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

export function useMatchedComplexesQuery(
  params: FetchMatchedComplexesParams,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: complexKeys.matched(params),
    queryFn: () => fetchMatchedComplexes(params),
    placeholderData: keepPreviousData,
    enabled: (options.enabled ?? true) && Boolean(params.conditionToken),
  });
}

export function useComplexDetailQuery(complexId: string) {
  return useQuery({
    queryKey: complexKeys.detail(complexId),
    queryFn: () => fetchComplexDetail(complexId),
  });
}

export interface RegionCount {
  region: ComplexRegion;
  count: number | null;
}

/**
 * 지역별 진행중인 청약 개수. 집계 API 가 없어 지역마다 size=1 로 total 만 읽는다.
 * (지역 필터만 — houseCategory 는 걸지 않음)
 */
export function useRegionCountsQuery(): RegionCount[] {
  const results = useQueries({
    queries: COMPLEX_REGIONS.map((region) => ({
      queryKey: ["complexes", "region-count", region] as const,
      queryFn: () => fetchComplexes({ region, page: 1, size: 1 }),
      staleTime: 5 * 60 * 1000,
    })),
  });

  return COMPLEX_REGIONS.map((region, i) => ({
    region,
    count: results[i].data?.total ?? null,
  }));
}
