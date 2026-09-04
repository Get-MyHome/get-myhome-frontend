"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import ChevronRightIcon from "@/assets/icons/chevronRight.svg";
import InfoCircleIcon from "@/assets/icons/infoCircle.svg";
import MoneyStackIcon from "@/assets/icons/moneyStack.svg";
import { ErrorState } from "@/components/ui/errorState";
import { LoadingState } from "@/components/ui/loadingState";
import { E012_NOTICE_LOAD_FAILED } from "@/constants/errors";
import { LOAN_PRODUCT_DESCRIPTION } from "@/constants/loanProducts";
import {
  CONDITIONS_STORAGE_KEY,
  FINANCING_TOKEN_STORAGE_KEY,
} from "@/constants/storage";
import { useFinancingRoutesQuery } from "@/queries/financing";
import type { EligibilityConditions } from "@/types/eligibility";
import type { FinancingRouteDetail } from "@/types/financing";
import { cn } from "@/utils/cn";
import { getConditionProgress } from "@/utils/conditionProgress";
import { toUserConditionRequest } from "@/utils/conditionRequest";
import { formatManwonToEok } from "@/utils/format";
import {
  parseSessionRaw,
  useIsMounted,
  useSessionRaw,
  writeSessionState,
} from "@/utils/sessionState";

const DISCLAIMER =
  "입력한 조건과 현재 규칙을 기준으로 계산한 사전 결과예요.\n선택한 주택의 가격과 금융기관의 실제 심사는 아직 반영되지 않았어요.";

function amountText(route: FinancingRouteDetail): {
  text: string;
  tone: "primary" | "danger" | "muted";
} {
  if (route.status === "BLOCK") return { text: "해당 없음", tone: "danger" };
  const min = route.limit_min;
  const max = route.limit_max;
  if (typeof min === "number" && typeof max === "number") {
    return {
      text: `${formatManwonToEok(min)} ~ ${formatManwonToEok(max)} 원`,
      tone: "primary",
    };
  }
  if (typeof max === "number") {
    return { text: `최대 ${formatManwonToEok(max)} 원`, tone: "primary" };
  }
  return { text: "확인 필요", tone: "muted" };
}

export function LoanRouteList() {
  const router = useRouter();

  // sessionStorage 는 클라이언트에서만 — 마운트 후에 읽어 하이드레이션 불일치를 피한다.
  const mounted = useIsMounted();
  const rawConditions = useSessionRaw(CONDITIONS_STORAGE_KEY);
  const conditions = useMemo(
    () => parseSessionRaw<EligibilityConditions>(rawConditions),
    [rawConditions]
  );
  const user = useMemo(
    () => (conditions ? toUserConditionRequest(conditions) : null),
    [conditions]
  );
  const progress = conditions ? getConditionProgress(conditions) : null;

  const { data, isLoading, isError, refetch } = useFinancingRoutesQuery(
    mounted ? user : undefined
  );

  useEffect(() => {
    if (data?.condition_token) {
      writeSessionState(FINANCING_TOKEN_STORAGE_KEY, data.condition_token);
    }
  }, [data?.condition_token]);

  const wrapper =
    "flex flex-1 flex-col px-gutter pt-[26px] pb-[calc(env(safe-area-inset-bottom)+24px)]";

  if (!mounted || isLoading) {
    return (
      <div className={wrapper}>
        <LoadingState message="가능한 대출을 계산하는 중이에요" />
      </div>
    );
  }

  if (user === null) {
    return (
      <div className={wrapper}>
        <ErrorState
          message="조건 입력이 필요해요"
          actionLabel="조건 입력하기"
          onAction={() => router.replace("/eligibility")}
        />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={wrapper}>
        <ErrorState
          message={E012_NOTICE_LOAD_FAILED}
          actionLabel="새로고침"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  const availableCount = data.routes.filter((r) => r.status !== "BLOCK").length;

  return (
    <div className={wrapper}>
      <div className="flex flex-col gap-[6px]">
        <p className="flex items-center gap-[6px] text-body-2 font-medium text-foreground">
          <MoneyStackIcon aria-hidden="true" className="size-5 shrink-0" />
          현재 가능한 대출 {availableCount}개가 있어요.
        </p>
        <p className="flex items-center gap-[4px] rounded-[6px] bg-neutral-100 px-[10px] py-[6px] text-caption-2 font-medium text-supply-private">
          <InfoCircleIcon aria-hidden="true" className="size-4 shrink-0" />
          대출 추천이 아닌 공식 조건 기반 계산 결과 입니다.
        </p>
      </div>

      <ul className="mt-[20px] flex flex-col gap-[20px]">
        {data.routes.map((route) => {
          const { text, tone } = amountText(route);
          const note = route.hold_message ?? route.ineligible_reason;

          return (
            <li
              key={route.product_code}
              className="flex flex-col gap-[6px] rounded-[6px] border border-primary-400 p-[10px] shadow-[0_4px_14.5px_0_rgba(0,0,0,0.2)]"
            >
              <h3 className="text-body-2 font-bold text-foreground">
                {route.product_name}
              </h3>
              <p className="text-caption-2 font-medium text-muted-foreground">
                {LOAN_PRODUCT_DESCRIPTION[route.product_code]}
              </p>
              <p
                className={cn(
                  "text-subtitle-3 font-bold",
                  tone === "danger"
                    ? "text-danger"
                    : tone === "muted"
                      ? "text-muted-foreground"
                      : "text-primary"
                )}
              >
                {text}
              </p>
              {route.binding_factor && (
                <p className="text-caption-2 font-medium text-info">
                  {route.binding_factor} 기준
                </p>
              )}
              {note && (
                <p className="flex min-h-[23px] items-center justify-center rounded-[6px] bg-primary-50 px-[10px] text-caption-2 font-medium text-neutral-400">
                  {note}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-[14px] whitespace-pre-line text-caption-2 font-medium text-neutral-300">
        {DISCLAIMER}
      </p>

      <div className="mt-auto flex flex-col gap-[10px] pt-[20px]">
        {progress && (
          <div className="flex flex-col gap-[6px] px-[10px]">
            <div className="flex items-end justify-between gap-[12px]">
              <div className="flex min-w-0 flex-col">
                {/* 1단계 필수는 이미 채우고 온 화면이라, 여기서 세는 것이
                    2단계 추가 항목이라는 걸 문구로 못박는다 */}
                <p className="text-body-3 font-medium text-foreground">
                  추가 정보 {progress.answered}/{progress.total} 입력 ·{" "}
                  {progress.percent}%
                </p>
                <p className="text-body-3 font-medium text-muted-foreground">
                  더 자세한 청약 가능성을 받아보세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/eligibility/loans/detail")}
                className="flex shrink-0 cursor-pointer items-center text-caption-2 font-medium text-info"
              >
                이어서 답하기
                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-[18px] shrink-0"
                />
              </button>
            </div>

            <span
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={progress.total}
              aria-valuenow={progress.answered}
              aria-valuetext={`${progress.total}개 중 ${progress.answered}개 답변`}
              className="block h-[4px] w-full overflow-hidden rounded-full bg-muted"
            >
              <span
                className="block h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${progress.percent}%` }}
              />
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push("/eligibility/notices")}
          className="flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[6px] bg-primary p-[10px] text-subtitle-4 font-bold text-white"
        >
          다음
        </button>
      </div>
    </div>
  );
}
