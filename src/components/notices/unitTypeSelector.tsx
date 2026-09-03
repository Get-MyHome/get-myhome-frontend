"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import ExternalLinkIcon from "@/assets/icons/externalLink.svg";
import InfoCircleIcon from "@/assets/icons/infoCircle.svg";
import RulerIcon from "@/assets/icons/ruler.svg";
import { SelectableRow } from "@/components/ui/selectableRow";
import { VERDICT_TARGET_STORAGE_KEY } from "@/constants/storage";
import type { ComplexUnitType } from "@/types/complex";
import { cn } from "@/utils/cn";
import { formatManwonToEok } from "@/utils/format";
import { writeSessionState } from "@/utils/sessionState";

/** "059.9442A" → { area: 60, variant: "A" } */
function parseUnitType(type: string): { area: number; variant: string } {
  return {
    area: Math.round(parseFloat(type)),
    variant: type.replace(/[\d.\s]/g, ""),
  };
}

/**
 * 주택형(평형)을 고르고 판정으로 넘어가는 영역.
 * 디자인에는 선택된 상태만 있어 비활성 CTA 는 조건 입력 화면과 같은 규칙을 따랐다.
 */
export function UnitTypeSelector({
  complexId,
  unitTypes,
  sourceUrl,
}: {
  complexId: string;
  unitTypes: ComplexUnitType[];
  sourceUrl: string;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const hasUnitTypes = unitTypes.length > 0;
  // 평형 선택지가 없는 공고는 고를 게 없으므로 바로 판정으로 넘어갈 수 있다
  const canProceed = !hasUnitTypes || selectedId !== null;

  return (
    <div className="flex flex-1 flex-col gap-[10px]">
      {hasUnitTypes ? (
        <>
          <p className="flex items-center gap-[6px] text-body-2 font-medium text-foreground">
            <RulerIcon aria-hidden="true" className="size-5 shrink-0" />
            평형을 선택해주세요.
          </p>

          <ul className="flex flex-col gap-[14px]">
            {unitTypes.map((unitType) => {
              const { area, variant } = parseUnitType(unitType.type);

              return (
                <li key={unitType.unit_type_id}>
                  <SelectableRow
                    label={`${area}㎡${variant ? ` ${variant}` : ""}`}
                    value={
                      unitType.sale_price === null
                        ? "미정"
                        : `${formatManwonToEok(unitType.sale_price)} 원`
                    }
                    selected={unitType.unit_type_id === selectedId}
                    onClick={() => setSelectedId(unitType.unit_type_id)}
                  />
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="flex items-center gap-[6px] text-body-2 font-medium text-foreground">
          <InfoCircleIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          해당 공고는 평형선택 조건이 없습니다.
        </p>
      )}

      <div className="mt-auto flex flex-col items-center gap-[10px] pt-[20px]">
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => {
            // 판정 화면이 어떤 단지·평형으로 계산할지 알아야 한다
            writeSessionState(VERDICT_TARGET_STORAGE_KEY, {
              complexId,
              unitTypeId: selectedId,
            });
            router.push("/eligibility/result");
          }}
          className={cn(
            "flex h-[44px] w-full items-center justify-center rounded-[6px] p-[10px]",
            "text-subtitle-4 font-bold text-white",
            canProceed ? "bg-primary" : "bg-primary-400"
          )}
        >
          가능성 판정하기
        </button>

        {/* 원문 PDF 는 자체 재배포하지 않고 링크로만 연결한다 */}
        <a
          href={sourceUrl}
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
