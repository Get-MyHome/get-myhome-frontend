import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * 알약형 라벨. 디자인은 2글자 라벨이 33x18 로 떨어지는데, 글자 수가 늘어도
 * 깨지지 않도록 폭은 min-width + 좌우 패딩으로 잡았다.
 */
export function Badge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[18px] min-w-[33px] items-center justify-center rounded-[20px] px-[6px]",
        "text-[10px] leading-[20px] font-medium text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
