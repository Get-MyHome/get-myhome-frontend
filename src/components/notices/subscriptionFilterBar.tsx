"use client";

import { useState } from "react";

import { BottomSheet } from "@/components/ui/bottomSheet";
import { FilterChip } from "@/components/ui/filterChip";
import {
  COMPLEX_REGIONS,
  HOUSE_CATEGORIES,
  type ComplexRegion,
  type HouseCategory,
} from "@/types/complex";
import { cn } from "@/utils/cn";

/** 필터 미선택 = 전체. 값은 undefined 로 다룬다 */
const ALL_LABEL = "전체";

const HOUSE_CATEGORY_LABEL: Record<HouseCategory, string> = {
  PRIVATE: "민간",
  PUBLIC: "공공",
};

type OpenSheet = "region" | "category" | null;

/**
 * 지역 / 주택 구분 필터. 칩을 누르면 바텀시트에서 값을 고르고 하단 버튼으로 확정한다.
 */
export function SubscriptionFilterBar({
  region,
  houseCategory,
  onRegionChange,
  onHouseCategoryChange,
}: {
  region: ComplexRegion | undefined;
  houseCategory: HouseCategory | undefined;
  onRegionChange: (region: ComplexRegion | undefined) => void;
  onHouseCategoryChange: (houseCategory: HouseCategory | undefined) => void;
}) {
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);
  const close = () => setOpenSheet(null);

  return (
    <>
      <div className="flex items-center gap-[8px]">
        <FilterChip
          label={region ?? ALL_LABEL}
          onClick={() => setOpenSheet("region")}
        />
        <FilterChip
          label={houseCategory ? HOUSE_CATEGORY_LABEL[houseCategory] : ALL_LABEL}
          onClick={() => setOpenSheet("category")}
        />
      </div>

      {openSheet === "region" && (
        <FilterSheet
          title="공급 지역 선택"
          options={[
            { value: undefined, label: ALL_LABEL },
            ...COMPLEX_REGIONS.map((r) => ({ value: r, label: r })),
          ]}
          current={region}
          onConfirm={(next) => {
            onRegionChange(next);
            close();
          }}
          onClose={close}
        />
      )}

      {openSheet === "category" && (
        <FilterSheet
          title="주택 구분 선택"
          options={[
            { value: undefined, label: ALL_LABEL },
            ...HOUSE_CATEGORIES.map((c) => ({
              value: c,
              label: HOUSE_CATEGORY_LABEL[c],
            })),
          ]}
          current={houseCategory}
          onConfirm={(next) => {
            onHouseCategoryChange(next);
            close();
          }}
          onClose={close}
        />
      )}
    </>
  );
}

function FilterSheet<T extends string>({
  title,
  options,
  current,
  onConfirm,
  onClose,
}: {
  title: string;
  options: { value: T | undefined; label: string }[];
  current: T | undefined;
  onConfirm: (value: T | undefined) => void;
  onClose: () => void;
}) {
  const [pending, setPending] = useState<T | undefined>(current);
  const pendingLabel =
    options.find((option) => option.value === pending)?.label ?? ALL_LABEL;

  return (
    <BottomSheet open onClose={onClose} title={title}>
      <div className="flex flex-wrap gap-x-[7px] gap-y-[12px]">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => setPending(option.value)}
            aria-pressed={option.value === pending}
            className={cn(
              "cursor-pointer rounded-full border px-[12px] py-[8px] text-body-3 font-medium text-foreground",
              option.value === pending ? "border-primary" : "border-transparent"
            )}
          >
            <span className="block w-[38px] text-center whitespace-nowrap">
              {option.label}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onConfirm(pending)}
        className="mt-[24px] flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[6px] bg-primary p-[10px] text-subtitle-4 font-bold text-white"
      >
        {pendingLabel} 공고 보기
      </button>
    </BottomSheet>
  );
}
