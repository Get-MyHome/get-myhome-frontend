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

const HOUSE_CATEGORY_LABEL: Record<HouseCategory, string> = {
  PRIVATE: "민간",
  PUBLIC: "공공",
};

type OpenSheet = "region" | "category" | null;

/**
 * 지역 / 주택 구분 필터. 칩을 누르면 바텀시트에서 값을 고른다.
 * 정식 디자인 나오면 시트 내용·스타일을 교체한다.
 */
export function SubscriptionFilterBar({
  region,
  houseCategory,
  onRegionChange,
  onHouseCategoryChange,
}: {
  region: ComplexRegion;
  houseCategory: HouseCategory;
  onRegionChange: (region: ComplexRegion) => void;
  onHouseCategoryChange: (houseCategory: HouseCategory) => void;
}) {
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);
  const close = () => setOpenSheet(null);

  return (
    <>
      <div className="flex items-center gap-[8px]">
        <FilterChip label={region} onClick={() => setOpenSheet("region")} />
        <FilterChip
          label={HOUSE_CATEGORY_LABEL[houseCategory]}
          onClick={() => setOpenSheet("category")}
        />
      </div>

      <BottomSheet open={openSheet === "region"} onClose={close} title="지역">
        <ul className="flex max-h-[50vh] flex-col overflow-y-auto">
          {COMPLEX_REGIONS.map((option) => (
            <li key={option}>
              <OptionRow
                label={option}
                selected={option === region}
                onClick={() => {
                  onRegionChange(option);
                  close();
                }}
              />
            </li>
          ))}
        </ul>
      </BottomSheet>

      <BottomSheet
        open={openSheet === "category"}
        onClose={close}
        title="주택 구분"
      >
        <ul className="flex flex-col">
          {HOUSE_CATEGORIES.map((option) => (
            <li key={option}>
              <OptionRow
                label={HOUSE_CATEGORY_LABEL[option]}
                selected={option === houseCategory}
                onClick={() => {
                  onHouseCategoryChange(option);
                  close();
                }}
              />
            </li>
          ))}
        </ul>
      </BottomSheet>
    </>
  );
}

function OptionRow({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-[6px] px-[12px] py-[12px] text-left text-body-2",
        selected
          ? "bg-primary-50 font-bold text-primary"
          : "font-medium text-foreground"
      )}
    >
      {label}
    </button>
  );
}
