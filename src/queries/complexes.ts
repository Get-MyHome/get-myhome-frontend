import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  fetchComplexDetail,
  fetchComplexes,
  type FetchComplexesParams,
} from "@/apis/complexes";

export const complexKeys = {
  list: (params: FetchComplexesParams) => ["complexes", params] as const,
  detail: (complexId: string) => ["complexes", complexId] as const,
};

export function useComplexesQuery(params: FetchComplexesParams = {}) {
  return useQuery({
    queryKey: complexKeys.list(params),
    queryFn: () => fetchComplexes(params),
    placeholderData: keepPreviousData,
  });
}

export function useComplexDetailQuery(complexId: string) {
  return useQuery({
    queryKey: complexKeys.detail(complexId),
    queryFn: () => fetchComplexDetail(complexId),
  });
}
