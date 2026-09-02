import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  fetchComplexDetail,
  fetchComplexes,
  fetchMatchedComplexes,
  type FetchComplexesParams,
  type FetchMatchedComplexesParams,
} from "@/apis/complexes";

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
