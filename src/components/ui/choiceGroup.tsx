"use client";

import { FieldLabel } from "./fieldLabel";
import { cn } from "@/utils/cn";

/** 라벨 + 나란히 놓인 택일 버튼. 선택된 쪽만 배경과 진한 테두리를 갖는다. */
export function ChoiceGroup<Value extends string>({
  label,
  required = false,
  value,
  options,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: Value | null;
  options: readonly { value: Value; label: string }[];
  onChange: (value: Value) => void;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <FieldLabel required={required}>{label}</FieldLabel>

      <div className="flex gap-[11px]">
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={cn(
                "flex h-[55px] flex-1 items-center justify-center rounded-[6px] border p-[10px] text-body-2 font-medium",
                selected
                  ? "border-neutral-500 bg-muted text-foreground"
                  : "border-primary-300 text-neutral-300",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
