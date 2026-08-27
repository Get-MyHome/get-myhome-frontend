"use client";

import { cn } from "@/utils/cn";

/** 왼쪽 라벨 · 오른쪽 값으로 된 택일 행. 선택되면 테두리와 글자가 진해진다 */
export function SelectableRow({
  label,
  value,
  selected,
  onClick,
}: {
  label: string;
  value: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center justify-between rounded-[6px] border p-[12px]",
        "text-body-2 font-medium",
        selected
          ? "border-primary text-foreground"
          : "border-primary-300 text-neutral-300"
      )}
    >
      <span>{label}</span>
      <span>{value}</span>
    </button>
  );
}
