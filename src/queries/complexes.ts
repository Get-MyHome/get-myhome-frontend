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
    enabled:
      (options.enabled ?? true) &&
      Boolean(params.conditionToken || params.user),
  });
}

/**
 * 공고 상세. complexId 가 비어 있으면 호출하지 않는다 — 빈 값으로 부르면
 * /complexes/ 가 되어 상세가 아니라 목록을 긁어온다.
 * 같은 단지를 여러 화면에서 참조하므로 캐시를 넉넉히 유지한다.
 */
export function useComplexDetailQuery(complexId: string) {
  return useQuery({
    queryKey: complexKeys.detail(complexId),
    queryFn: () => fetchComplexDetail(complexId),
    enabled: Boolean(complexId),
    staleTime: 5 * 60 * 1000,
  });
}

export interface RegionCount {
  region: ComplexRegion;
  count: number | null;
  /** 아직 응답을 못 받은 상태. count 가 null 인 것만으로는 조회 실패와 구분되지 않는다 */
  isLoading: boolean;
}

/** 청약 공고는 하루 단위로만 바뀐다. 백엔드도 1일 캐시라 더 자주 물어도 같은 값이다 */
const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * 지역별 진행중인 청약 개수 + 데이터 갱신일. 집계 API 가 없어 지역마다 size=1 로
 * total 만 읽는다. (지역 필터만 — houseCategory 는 걸지 않음)
 *
 * 지역 수만큼 요청이 나가므로 하루 한 번만 받는다. gcTime 을 함께 늘리지 않으면
 * 홈을 벗어난 사이 캐시가 수거돼 다시 들어올 때 17번을 새로 부른다.
 */
export function useRegionCountsQuery(): {
  counts: RegionCount[];
  updatedAt: string | null;
} {
  const results = useQueries({
    queries: COMPLEX_REGIONS.map((region) => ({
      queryKey: ["complexes", "region-count", region] as const,
      queryFn: () => fetchComplexes({ region, page: 1, size: 1 }),
      staleTime: ONE_DAY,
      gcTime: ONE_DAY,
    })),
  });

  return {
    counts: COMPLEX_REGIONS.map((region, i) => ({
      region,
      count: results[i].data?.total ?? null,
      isLoading: results[i].isPending,
    })),
    updatedAt: results.find((r) => r.data)?.data?.updated_at ?? null,
  };
}
