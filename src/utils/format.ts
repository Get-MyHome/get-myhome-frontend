const EOK = 100_000_000;

/**
 * ISO 날짜(YYYY-MM-DD)를 "2026.09.09" 형태로 바꾼다.
 * Date 로 파싱하지 않으므로 타임존에 따라 하루씩 밀리는 문제가 없다.
 */
export function formatDotDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${year}.${month}.${day}`;
}

/** 원 단위 금액을 "14.2억" 형태로 바꾼다. 소수점이 필요 없으면 생략한다. */
export function formatEok(won: number): string {
  return `${Number((won / EOK).toFixed(1))}억`;
}

/** 만원 단위 금액을 "9.1억" 형태로 바꾼다 (API 금액은 만원 단위) */
export function formatManwonToEok(manwon: number): string {
  return formatEok(manwon * 10_000);
}

/**
 * 만원 단위 금액을 "1억 2,595만" 형태로 바꾼다.
 * 억 미만이면 "4,200만", 억 단위가 딱 떨어지면 "2억".
 */
export function formatManwon(manwon: number): string {
  const eok = Math.floor(manwon / 10_000);
  const rest = manwon % 10_000;
  if (eok === 0) return `${rest.toLocaleString()}만`;
  if (rest === 0) return `${eok}억`;
  return `${eok}억 ${rest.toLocaleString()}만`;
}

/** 0~1 비율을 "51.6%" 로. 소수점이 필요 없으면 생략한다 */
export function formatRatio(ratio: number): string {
  const percent = ratio * 100;
  return `${Number(percent.toFixed(1))}%`;
}
