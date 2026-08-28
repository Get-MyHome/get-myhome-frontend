"use client";

import CaretUp from "@/assets/icons/caretUp.svg";

/**
 * 드롭다운을 여는 필터 칩. 디자인에 드롭다운 패널 스펙이 아직 없어
 * 열림 동작은 onSelect 를 붙이는 쪽에 맡긴다.
 */
export function FilterChip({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="listbox"
      className="flex items-center gap-[6px] rounded-[48px] border border-neutral-300 px-[8px] py-[6px] text-body-3 font-medium text-foreground"
    >
      {label}
      {/* 디자인은 11x8 박스 안에 7.39x5.39 삼각형이 들어있다.
          에셋은 위를 향하므로 rotate-180 으로 아래를 향하게 한다. */}
      <span className="relative block h-[8px] w-[11px] rotate-180">
        <CaretUp className="absolute top-[7.6%] left-[16.41%] h-[5.392px] w-[7.389px]" />
      </span>
    </button>
  );
}
