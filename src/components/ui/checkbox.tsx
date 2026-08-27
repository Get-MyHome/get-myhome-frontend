"use client";

import type { ReactNode } from "react";

import CheckboxIcon from "@/assets/icons/checkbox.svg";
import { cn } from "@/utils/cn";

/**
 * 체크 표시가 들어간 사각형 아이콘 하나로 두 상태를 색으로만 구분한다 (디자인 그대로).
 * 에셋은 path 에 fill 을 직접 물고 있어서 svg 에 건 fill 은 상속으로 밀린다.
 * path 를 직접 겨냥해야 색이 바뀐다.
 */
export function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-[6px] select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <CheckboxIcon
        aria-hidden="true"
        className={cn(
          "size-[18px] shrink-0 rounded-[2px]",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
          checked ? "[&_path]:fill-primary" : "[&_path]:fill-primary-300",
        )}
      />
      <span className="text-body-2 font-medium text-foreground">{children}</span>
    </label>
  );
}
