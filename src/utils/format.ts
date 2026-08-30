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
