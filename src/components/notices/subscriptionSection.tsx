"use client";

import { useState } from "react";

import { ErrorState } from "@/components/ui/errorState";
import { E012_NOTICE_LOAD_FAILED } from "@/constants/errors";
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
  // undefined = 전체. 다만 백엔드가 region·houseCategory 미입력 시 500 을 낸다 (버그) —
  // 전체를 고르면 현재는 에러 화면이 뜬다. 기본값은 동작하는 값으로 둔다.
  const [region, setRegion] = useState<ComplexRegion | undefined>("서울");
  const [houseCategory, setHouseCategory] = useState<HouseCategory | undefined>(
    "PRIVATE"
  );
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useComplexesQuery({
    region,
    houseCategory,
    page,
    size: PAGE_SIZE,
  });

  // 페이지·필터를 바꾸면 항상 목록 맨 위로
  const scrollToTop = () => window.scrollTo({ top: 0 });

  const changePage = (updater: (p: number) => number) => {
    setPage(updater);
    scrollToTop();
  };

  const handleRegionChange = (next: ComplexRegion | undefined) => {
    setRegion(next);
    setPage(1);
    scrollToTop();
  };

  const handleHouseCategoryChange = (next: HouseCategory | undefined) => {
    setHouseCategory(next);
    setPage(1);
    scrollToTop();
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
        <ErrorState
          message={E012_NOTICE_LOAD_FAILED}
          actionLabel="새로고침"
          onAction={() => refetch()}
        />
      )}

      {data && data.items.length === 0 && (
        <ErrorState message="현재 진행중인 청약 공고가 없습니다." />
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
              onClick={() => changePage((p) => p - 1)}
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
              onClick={() => changePage((p) => p + 1)}
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
