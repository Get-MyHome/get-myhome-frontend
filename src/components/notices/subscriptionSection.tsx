"use client";

import { useMemo, useState } from "react";

import { ErrorState } from "@/components/ui/errorState";
import { E012_NOTICE_LOAD_FAILED } from "@/constants/errors";
import {
  CONDITIONS_STORAGE_KEY,
  FINANCING_TOKEN_STORAGE_KEY,
} from "@/constants/storage";
import {
  useComplexesQuery,
  useMatchedComplexesQuery,
} from "@/queries/complexes";
import type {
  ComplexRegion,
  ComplexSummary,
  HouseCategory,
} from "@/types/complex";
import type { EligibilityConditions } from "@/types/eligibility";
import type { HousingSubscription, SupplyType } from "@/types/subscription";
import { cn } from "@/utils/cn";
import { toUserConditionRequest } from "@/utils/conditionRequest";
import { formatDotDate } from "@/utils/format";
import {
  clearSessionState,
  parseSessionRaw,
  useIsMounted,
  useSessionRaw,
} from "@/utils/sessionState";

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
    matchedProductNames: complex.matched_product_names,
  };
}

const PAGE_SIZE = 20;

/**
 * 진행중인 청약 목록. 공고 탭과 판정 흐름(조건 입력 후)에서 같은 화면으로 쓴다.
 * headerOffset 은 스티키 필터 헤더가 붙는 위치 — 판정 흐름은 위에 AppBar 가 있어 그만큼 내린다.
 */
export function SubscriptionSection({
  headerOffset = "top-[env(safe-area-inset-top)]",
  matched = false,
}: {
  headerOffset?: string;
  /** true 면 조건 토큰으로 매칭된 공고만 (POST /complexes/matched) */
  matched?: boolean;
} = {}) {
  // undefined = 전체. 백엔드가 region·houseCategory 미입력 시 500 을 내는 버그가 있어
  // 전체를 고르면 에러 화면이 뜰 수 있다 (요청에 따라 기본값은 전체로 둠 — 백엔드 수정 필요).
  const [region, setRegion] = useState<ComplexRegion | undefined>(undefined);
  const [houseCategory, setHouseCategory] = useState<HouseCategory | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);

  // 매칭 모드에서만 필요. 마운트 후 sessionStorage 에서 읽는다.
  const mounted = useIsMounted();
  const rawToken = useSessionRaw(FINANCING_TOKEN_STORAGE_KEY);
  const conditionToken = useMemo(
    () => (matched ? parseSessionRaw<string>(rawToken) : null),
    [matched, rawToken]
  );
  // 토큰은 30분이면 만료된다. 같은 조건으로 계속 조회되도록 user 도 함께 보낸다
  const rawConditions = useSessionRaw(CONDITIONS_STORAGE_KEY);
  const user = useMemo(() => {
    if (!matched) return undefined;
    const conditions = parseSessionRaw<EligibilityConditions>(rawConditions);
    return (conditions ? toUserConditionRequest(conditions) : null) ?? undefined;
  }, [matched, rawConditions]);
  const tokenPending = matched && !mounted;

  const allQuery = useComplexesQuery(
    { region, houseCategory, page, size: PAGE_SIZE },
    { enabled: !matched }
  );
  const matchedQuery = useMatchedComplexesQuery(
    {
      conditionToken: conditionToken ?? "",
      user,
      region,
      houseCategory,
      page,
      size: PAGE_SIZE,
    },
    { enabled: matched && mounted && Boolean(conditionToken || user) }
  );
  const { data, isLoading, isError, refetch } = matched ? matchedQuery : allQuery;

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

      {matched && mounted && conditionToken === null && !user && (
        <ErrorState message="대출 자격 조회를 먼저 진행해주세요." />
      )}

      {(isLoading || tokenPending) && (
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
                <SubscriptionCard
                  subscription={mapComplexToSubscription(complex)}
                  href={
                    matched
                      ? `/eligibility/notices/${complex.complex_id}`
                      : "/eligibility"
                  }
                  // 공고 탭은 조건 없이 둘러보는 경로다. 홈의 [가능성 판정하기]와
                  // 똑같이 이전 입력을 비우고 판정 흐름을 처음부터 시작한다
                  onSelect={
                    matched
                      ? undefined
                      : () => clearSessionState(CONDITIONS_STORAGE_KEY)
                  }
                />
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
