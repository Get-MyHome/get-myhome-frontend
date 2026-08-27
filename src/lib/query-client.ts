import { QueryClient, isServer } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR에서 서버가 이미 받아온 데이터를 클라이언트가 즉시 다시 요청하는 것을 막는다.
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  // 서버에서는 요청마다 새 클라이언트를 만들어 사용자 간 캐시가 섞이지 않게 한다.
  if (isServer) return makeQueryClient();

  // 브라우저에서는 하나를 재사용한다. 리렌더마다 새로 만들면 캐시가 날아간다.
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
