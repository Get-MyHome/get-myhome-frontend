import { useSyncExternalStore } from "react";

/**
 * 화면을 벗어났다 돌아와도 입력값이 남아 있도록 sessionStorage 에 임시 보관한다.
 * 소득·자산을 다루므로 localStorage 가 아니라 탭을 닫으면 사라지는
 * sessionStorage 를 쓴다 (기획서 P-030 수집 최소화 · P-031 임시값 보관).
 *
 * 시크릿 모드나 저장이 차단된 환경에서는 접근 자체가 예외를 던지므로
 * 읽기·쓰기 모두 실패해도 조용히 넘어간다.
 */
export function readSessionState<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeSessionState(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 불가 환경에서는 보존을 포기한다. 입력 자체는 계속 동작한다
  }
}

export function clearSessionState(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // 저장 불가 환경에서는 지울 것도 없다
  }
}

const subscribeNoop = () => () => {};

/** SSR 에서는 false, 클라이언트 마운트 후 true. 하이드레이션 불일치 없이 안전하게 갈린다 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}

/**
 * sessionStorage 원문(JSON 문자열)을 마운트 후 읽는다. SSR·미저장 시 null.
 * 파싱은 호출부에서 원문 문자열에 useMemo 를 걸어 참조를 안정화한다.
 */
export function useSessionRaw(key: string): string | null {
  return useSyncExternalStore(
    subscribeNoop,
    () => {
      try {
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null
  );
}
