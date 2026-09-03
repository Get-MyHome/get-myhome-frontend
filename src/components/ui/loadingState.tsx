/**
 * 불러오는 중 안내. ErrorState 와 같은 자리·같은 정렬을 쓴다.
 *
 * 판정처럼 오래 걸리는 요청이 있어서, 멈춘 화면으로 보이지 않도록 회전
 * 표시를 함께 둔다. hint 는 기다림이 길어질 이유를 알려줄 때만 쓴다.
 */
export function LoadingState({
  message,
  hint,
}: {
  message: string;
  hint?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-[10px] pt-[70px]"
    >
      <span
        aria-hidden="true"
        className="size-7 animate-spin rounded-full border-[3px] border-primary-300 border-t-primary motion-reduce:animate-none"
      />
      <p className="text-center text-body-2 font-medium text-neutral-300">
        {message}
      </p>
      {hint && (
        <p className="whitespace-pre-line text-center text-body-3 font-medium text-neutral-300">
          {hint}
        </p>
      )}
    </div>
  );
}
