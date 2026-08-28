/**
 * 플로우 진행도 막대. 디자인상 앱바 바로 아래에 화면 폭 전체(375x6)로 붙는다.
 * 폭은 단계 수에 따라 달라지므로 유틸리티 대신 inline style 로 준다.
 */
export function ProgressBar({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  const ratio = Math.min(Math.max(current / total, 0), 1);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={`${total}단계 중 ${current}단계`}
      className="h-[6px] w-full shrink-0 bg-neutral-200"
    >
      <div
        className="h-full rounded-r-full bg-primary-500"
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}
