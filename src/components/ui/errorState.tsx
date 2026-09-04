import WarningIcon from "@/assets/icons/warning.svg";

/**
 * 목록 "공고 없음"과 같은 스타일의 안내 화면.
 * 에러일 때는 actionLabel/onAction 으로 다음 행동 버튼을 함께 준다 (기획서 13절).
 */
export function ErrorState({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-[10px] pt-[70px]">
      <WarningIcon aria-hidden="true" className="size-7 text-neutral-300" />
      <p className="whitespace-pre-line text-center text-body-2 font-medium text-neutral-300">
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-[6px] cursor-pointer rounded-[6px] border border-border px-[12px] py-[6px] text-body-3 font-medium text-foreground"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
