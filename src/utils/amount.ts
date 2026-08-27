import { formatKoreanWon } from "./koreanNumber";

/**
 * 만원 단위 입력의 최대 자릿수. 9자리면 약 10조원까지 커버되고,
 * 원 단위로 환산해도 Number 의 안전 정수 범위 안에 머문다.
 */
export const AMOUNT_MAX_LENGTH = 9;

/** 숫자만 남기고 자릿수를 제한하며 앞자리 0 을 떼어낸다 */
export function normalizeAmount(value: string): string {
  const digits = value.replace(/[^0-9]/g, "").slice(0, AMOUNT_MAX_LENGTH);
  return digits.replace(/^0+(?=\d)/, "");
}

/**
 * 금액 입력 오른쪽에 붙는 글자.
 * 값이 있으면 한글 읽기("팔천만원"), 비어 있거나 읽을 수 없으면 단위("만원").
 */
export function amountSuffix(value: string): string {
  return formatKoreanWon(Number(value)) || "만원";
}
