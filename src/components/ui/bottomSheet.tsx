"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * 임시 바텀시트 셸. 디자인(Figma node 8:184) 셸만 참고 —
 * 딤 배경 + 상단 라운드 시트 + 그랩 핸들. 슬라이드 애니메이션·포커스 트랩은
 * 정식 디자인 나올 때 붙인다.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  // 시트가 떠 있는 동안 뒤 배경 스크롤을 막는다
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  // 스티키 헤더(z-10) 밖으로 빼내야 하단 탭바(z-40) 위에 올라온다
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-app rounded-t-[16px] bg-surface px-gutter pt-[10px] pb-[calc(env(safe-area-inset-bottom)+24px)]"
      >
        <div className="mx-auto h-[6px] w-[36px] rounded-full bg-neutral-300" />
        <h2 className="mt-[26px] text-subtitle-3 font-bold text-foreground">
          {title}
        </h2>
        <div className="mt-[12px]">{children}</div>
      </div>
    </div>,
    document.body
  );
}
