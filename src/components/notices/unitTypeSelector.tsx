"use client";

import { useState } from "react";

import ExternalLinkIcon from "@/assets/icons/externalLink.svg";
import { SelectableRow } from "@/components/ui/selectableRow";
import type { UnitType } from "@/types/subscription";
import { cn } from "@/utils/cn";
import { formatEok } from "@/utils/format";

/**
 * 주택형(평형)을 고르고 판정으로 넘어가는 영역.
 * 디자인에는 선택된 상태만 있어 비활성 CTA 는 조건 입력 화면과 같은 규칙을 따랐다.
 */
export function UnitTypeSelector({
  unitTypes,
  noticeUrl,
}: {
  unitTypes: UnitType[];
  noticeUrl: string;
}) {
  const [selectedArea, setSelectedArea] = useState<number | null>(null);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <ul className="flex flex-col gap-4">
        {unitTypes.map((unitType) => (
          <li key={unitType.area}>
            <SelectableRow
              label={`${unitType.area}㎡`}
              value={`${formatEok(unitType.price)} 원`}
              selected={unitType.area === selectedArea}
              onClick={() => setSelectedArea(unitType.area)}
            />
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col items-center gap-3">
        {/* TODO: 판정 결과 화면(/eligibility/result)이 생기면 라우팅을 붙인다 */}
        <button
          type="button"
          disabled={selectedArea === null}
          className={cn(
            "flex h-[44px] w-full items-center justify-center rounded-[6px] p-[10px]",
            "text-subtitle-4 font-bold text-white",
            selectedArea === null ? "bg-primary-300" : "bg-primary"
          )}
        >
          가능성 판정하기
        </button>

        {/* 원문 PDF 는 자체 재배포하지 않고 링크로만 연결한다 */}
        <a
          href={noticeUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-[4px] text-body-3 font-medium text-foreground"
        >
          <ExternalLinkIcon aria-hidden="true" className="size-4 shrink-0" />
          원문 공고문 보기
        </a>
      </div>
    </div>
  );
}
