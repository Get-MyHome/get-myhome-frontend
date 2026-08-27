const DIGITS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const SMALL_UNITS = ["", "십", "백", "천"];
const BIG_UNITS = ["", "만", "억", "조"];

/** 4자리 이하 묶음을 한글로 읽는다. 십·백·천 앞의 "일" 은 관례대로 생략한다 */
function readGroup(group: number): string {
  let result = "";

  for (let position = SMALL_UNITS.length - 1; position >= 0; position -= 1) {
    const digit = Math.floor(group / 10 ** position) % 10;
    if (digit === 0) continue;
    result += (position > 0 && digit === 1 ? "" : DIGITS[digit]) + SMALL_UNITS[position];
  }

  return result;
}

/** 정수를 한글로 읽는다. 예: 80000000 -> "팔천만" */
export function toKoreanNumeral(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "";

  const groups: string[] = [];
  let rest = Math.floor(value);

  for (let index = 0; rest > 0 && index < BIG_UNITS.length; index += 1) {
    const group = rest % 10_000;
    if (group > 0) groups.unshift(readGroup(group) + BIG_UNITS[index]);
    rest = Math.floor(rest / 10_000);
  }

  return groups.join("");
}

/** 만원 단위 금액의 한글 읽기. 예: 8000 -> "팔천만원" */
export function formatKoreanWon(manwon: number): string {
  const numeral = toKoreanNumeral(manwon * 10_000);
  return numeral ? `${numeral}원` : "";
}
