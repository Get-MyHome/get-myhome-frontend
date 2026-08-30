"use client";

import { useState } from "react";

import WarningIcon from "@/assets/icons/warning.svg";
import { useComplexesQuery } from "@/queries/complexes";
import type {
  ComplexRegion,
  ComplexSummary,
  HouseCategory,
} from "@/types/complex";
import type { HousingSubscription, SupplyType } from "@/types/subscription";
import { cn } from "@/utils/cn";
import { formatDotDate } from "@/utils/format";

import { SubscriptionCard } from "./subscriptionCard";
import { SubscriptionFilterBar } from "./subscriptionFilterBar";

function mapComplexToSubscription(complex: ComplexSummary): HousingSubscription {
  const supplyType: SupplyType =
    complex.house_type === "민영"
      ? "private"
      : complex.house_type === "국민"
        ? "public"
        : "other";

  return {
    id: complex.complex_id,
    supplyType,
    supplyTypeLabel: supplyType === "other" ? complex.house_type : undefined,
    deadline: complex.application_end_date,
    name: complex.name,
    address: complex.address,
    // sale_price 는 만원 단위. 미등록 공고는 null (목록 절반가량)
    price: complex.sale_price === null ? null : complex.sale_price * 10_000,
    moveInMonth: complex.expected_move_in,
    unitTypes: [],
    noticeUrl: "",
  };
}

const PAGE_SIZE = 20;

/**
 * 진행중인 청약 목록. 공고 탭과 판정 흐름(조건 입력 후)에서 같은 화면으로 쓴다.
 * headerOffset 은 스티키 필터 헤더가 붙는 위치 — 판정 흐름은 위에 AppBar 가 있어 그만큼 내린다.
 */
export function SubscriptionSection({
  headerOffset = "top-[env(safe-area-inset-top)]",
}: {
  headerOffset?: string;
} = {}) {
  // region · houseCategory 를 빼면 백엔드가 500 을 낸다 (버그) — 항상 값을 넘긴다.
  // "전체(공공+민간)" 조회는 houseCategory 필수 버그 때문에 아직 불가.
  const [region, setRegion] = useState<ComplexRegion>("서울");
  const [houseCategory, setHouseCategory] = useState<HouseCategory>("PRIVATE");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useComplexesQuery({
    region,
    houseCategory,
    page,
    size: PAGE_SIZE,
  });

  const handleRegionChange = (next: ComplexRegion) => {
    setRegion(next);
    setPage(1);
  };

  const handleHouseCategoryChange = (next: HouseCategory) => {
    setHouseCategory(next);
    setPage(1);
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.size)) : 1;

  return (
    <section className="flex flex-col">
      <div
        className={cn(
          "sticky z-10 -mx-gutter flex flex-col gap-[6px] bg-background px-gutter pt-[13px] pb-[14px]",
          headerOffset
        )}
      >
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-[6px] text-body-2 font-medium text-foreground">
            진행중인 청약
            <span>{data?.total ?? 0}개</span>
          </h2>
          {data && (
            <p className="text-body-3 font-medium text-neutral-300">
              {formatDotDate(data.updated_at.split(" ")[0])} 업데이트
            </p>
          )}
        </div>

        <SubscriptionFilterBar
          region={region}
          houseCategory={houseCategory}
          onRegionChange={handleRegionChange}
          onHouseCategoryChange={handleHouseCategoryChange}
        />
      </div>

      {isLoading && (
        <p className="px-gutter py-[24px] text-body-2 font-medium text-muted-foreground">
          불러오는 중이에요
        </p>
      )}

      {isError && (
        <p className="px-gutter py-[24px] text-body-2 font-medium text-muted-foreground">
          목록을 불러오지 못했어요
        </p>
      )}

      {data && data.items.length === 0 && (
        <div className="flex flex-col items-center gap-[10px] pt-[70px]">
          <WarningIcon aria-hidden="true" className="size-7 text-neutral-300" />
          <p className="text-body-2 font-medium text-neutral-300">
            현재 진행중인 청약 공고가 없습니다.
          </p>
        </div>
      )}

      {data && data.items.length > 0 && (
        <>
          <ul className="flex flex-col gap-[14px]">
            {data.items.map((complex) => (
              <li key={complex.complex_id}>
                <SubscriptionCard subscription={mapComplexToSubscription(complex)} />
              </li>
            ))}
          </ul>

          {/* 디자인 나오기 전까지 쓰는 임시 페이지네이션 */}
          <div className="flex items-center justify-center gap-[12px] py-[20px]">
            <button
              type="button"
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              className="rounded-[6px] border border-border px-[10px] py-[6px] text-body-3 font-medium text-foreground disabled:text-muted-foreground"
            >
              이전
            </button>
            <span className="text-body-3 font-medium text-muted-foreground">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="rounded-[6px] border border-border px-[10px] py-[6px] text-body-3 font-medium text-foreground disabled:text-muted-foreground"
            >
              다음
            </button>
          </div>
        </>
      )}
    </section>
  );
}
