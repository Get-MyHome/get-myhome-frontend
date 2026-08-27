"use client";

import { useId, useState } from "react";

import ChevronIcon from "@/assets/icons/chevronRight.svg";
import { cn } from "@/utils/cn";

import { FieldLabel } from "./fieldLabel";

/**
 * 라벨 + 드롭다운. 목록은 버튼 아래에 겹쳐 뜬다 (디자인상 버튼과 9px 간격).
 * 셰브론 에셋은 오른쪽을 향하므로 닫힘=아래, 열림=위로 회전시킨다.
 */
export function SelectField<Option extends string>({
  label,
  required = false,
  value,
  options,
  onChange,
  placeholder = "선택 해주세요.",
}: {
  label: string;
  required?: boolean;
  value: Option | null;
  options: readonly Option[];
  onChange: (value: Option) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <div className="flex flex-col gap-[6px]">
      <FieldLabel required={required}>{label}</FieldLabel>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-expanded={open}
          aria-controls={listId}
          className={cn(
            "flex w-full items-center justify-between gap-[11px] rounded-[6px] border bg-surface px-[10px] py-[8px]",
            value || open ? "border-primary" : "border-primary-400",
          )}
        >
          <span
            className={cn(
              "text-body-2 font-medium",
              value ? "text-foreground" : "text-neutral-300",
            )}
          >
            {value ?? placeholder}
          </span>
          <ChevronIcon
            aria-hidden="true"
            className={cn("size-6 shrink-0 text-foreground", open ? "-rotate-90" : "rotate-90")}
          />
        </button>

        {open && (
          <ul
            id={listId}
            className="absolute top-full right-0 left-0 z-20 mt-[9px] flex flex-col gap-[4px] rounded-[8px] border border-primary bg-primary-50 py-[8px]"
          >
            {options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className="flex w-full px-[16px] py-[8px] text-left text-body-2 font-medium text-black"
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
