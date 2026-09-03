"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import BuildingIcon from "@/assets/icons/building.svg";
import ErrorSmallIcon from "@/assets/icons/errorSmall.svg";
import LocationPointIcon from "@/assets/icons/locationPoint.svg";
import StageBlockIcon from "@/assets/icons/stageBlock.svg";
import StageHoldIcon from "@/assets/icons/stageHold.svg";
import StageOkIcon from "@/assets/icons/stageOk.svg";
import { TermsAgreementSheet } from "@/components/eligibility/termsAgreementSheet";
import { ErrorState } from "@/components/ui/errorState";
import {
  CONDITIONS_STORAGE_KEY,
  FINANCING_TOKEN_STORAGE_KEY,
  VERDICT_ID_STORAGE_KEY,
  VERDICT_TARGET_STORAGE_KEY,
} from "@/constants/storage";
import { RULE_VERSION } from "@/constants/verdict";
import { useComplexDetailQuery } from "@/queries/complexes";
import { useVerdictQuery } from "@/queries/verdicts";
import type { EligibilityConditions } from "@/types/eligibility";
import type { VerdictStatus } from "@/types/financing";
import {
  STAGE_LABEL,
  type StageVerdict,
  type VerdictRequest,
  type VerdictTarget,
} from "@/types/verdict";
import { cn } from "@/utils/cn";
import { toUserConditionRequest } from "@/utils/conditionRequest";
import { formatManwon, formatManwonToEok, formatRatio } from "@/utils/format";
import {
  parseSessionRaw,
  useIsMounted,
  useSessionRaw,
  writeSessionState,
} from "@/utils/sessionState";

const NOTICE =
  "이 결과는 공개 자료 기준 추정이며,\n최종 확정은 금융기관 심사에 따릅니다";

/** 이메일 판정지에만 담기는 항목. 화면이 길어지지 않게 여기서는 목록만 안내한다 */
const REPORT_ONLY_SECTIONS = [
  "공고문 분석 요약",
  "대출 상품별 잔금 비교",
  "중도금 금융조달 상세 (회차·이자 방식)",
  "공고문 위험조항 및 원문 근거",
];

const STATUS_LABEL: Record<VerdictStatus, string> = {
  OK: "가능",
  GAP: "부족",
  BLOCK: "불가능",
  HOLD: "확인필요",
};

function StageIcon({ status }: { status: VerdictStatus }) {
  if (status === "OK")
    return <StageOkIcon aria-hidden="true" className="size-5 shrink-0" />;
  if (status === "HOLD")
    return <StageHoldIcon aria-hidden="true" className="size-6 shrink-0" />;
  return <StageBlockIcon aria-hidden="true" className="size-6 shrink-0" />;
}

/** 구간 한 줄 + 아래로 이어지는 세로선. 마지막 구간은 선을 그리지 않는다 */
function StageRow({ stage, last }: { stage: StageVerdict; last: boolean }) {
  const note = stage.reason_summary;
  const amount = stage.required === null ? null : formatManwon(stage.required);
  const gap = stage.gap === null ? null : formatManwon(stage.gap);

  return (
    <li className="flex flex-col gap-[4px]">
      <div className="flex items-center justify-between gap-[8px]">
        <span className="flex min-w-0 items-center gap-[6px]">
          <StageIcon status={stage.status} />
          <span className="text-body-2 font-bold text-foreground">
            {STAGE_LABEL[stage.stage]}
          </span>
          {amount && (
            <span className="text-body-2 font-medium text-supply-private">
              {amount}
            </span>
          )}
        </span>
        <span className="flex shrink-0 items-center gap-[8px] text-body-2 font-medium">
          {gap && <span className="text-danger">{gap} 부족</span>}
          <span
            className={
              stage.status === "OK" ? "text-success" : "text-danger"
            }
          >
            {STATUS_LABEL[stage.status]}
          </span>
        </span>
      </div>

      {note && (
        <div className="flex items-stretch gap-[5px]">
          <span className="flex w-[21px] shrink-0 justify-center">
            <span className="w-px bg-primary" />
          </span>
          <p className="flex-1 rounded-[6px] bg-muted p-[10px] text-body-3 font-medium text-muted-foreground">
            {note}
          </p>
        </div>
      )}

      {!last && (
        <span className="flex w-[21px] justify-center">
          <span className="h-[21px] w-px bg-primary" />
        </span>
      )}
    </li>
  );
}

/**
 * 판정 결과 (Figma 2022:634). POST /verdicts 응답을 그대로 그린다.
 * 응답에는 임계선·스트레스 시나리오·위험조항까지 들어 있지만 화면이 길어지므로
 * 핵심(구간별 판정)만 남기고 나머지는 이메일 판정지로 안내한다.
 */
export function VerdictResult() {
  const router = useRouter();
  const [termsOpen, setTermsOpen] = useState(false);

  const mounted = useIsMounted();
  const rawToken = useSessionRaw(FINANCING_TOKEN_STORAGE_KEY);
  const rawTarget = useSessionRaw(VERDICT_TARGET_STORAGE_KEY);
  const rawConditions = useSessionRaw(CONDITIONS_STORAGE_KEY);

  const request = useMemo<VerdictRequest | null>(() => {
    const token = parseSessionRaw<string>(rawToken);
    const conditions = parseSessionRaw<EligibilityConditions>(rawConditions);
    const user = conditions ? toUserConditionRequest(conditions) : null;
    // 토큰이 만료돼도 같은 조건으로 다시 판정되도록 user 를 함께 싣는다
    if (!token && !user) return null;

    const target = parseSessionRaw<VerdictTarget>(rawTarget);
    return {
      condition_token: token ?? undefined,
      user: user ?? undefined,
      complex_id: target?.complexId,
      unit_type_id: target?.unitTypeId ?? undefined,
      rule_version: RULE_VERSION,
    };
  }, [rawToken, rawTarget, rawConditions]);

  const { data, isLoading, isError, refetch } = useVerdictQuery(request, {
    enabled: mounted,
  });

  // 이메일 발송 화면이 verdict_id 를 알아야 한다
  useEffect(() => {
    if (data?.verdict_id) {
      writeSessionState(VERDICT_ID_STORAGE_KEY, data.verdict_id);
    }
  }, [data?.verdict_id]);

  // 주소는 판정 응답에 없어 이전 화면에서 받아둔 공고 상세를 재사용한다
  const complexId = data?.meta?.complex_id ?? "";
  const { data: complex } = useComplexDetailQuery(complexId);

  const wrapper =
    "flex flex-1 flex-col gap-[24px] px-gutter pt-[26px] pb-[calc(env(safe-area-inset-bottom)+24px)]";

  if (!mounted || isLoading) {
    return (
      <div className={wrapper}>
        <p className="py-[24px] text-body-2 font-medium text-muted-foreground">
          판정하는 중이에요
        </p>
      </div>
    );
  }

  if (request === null) {
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
          message={"판정 결과를 불러오지 못했어요.\n잠시 후 다시 시도해주세요"}
          actionLabel="다시 시도"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  const meta = data.meta;
  const stages = data.verdicts ?? [];
  const needsCheck = data.overall_info_confidence !== "CONFIRMED";
  const criticalLine = data.interim_critical_line;

  return (
    <div className={wrapper}>
      {/* 공고 요약 */}
      <div className="relative flex flex-col gap-[8px] rounded-[6px] bg-primary-50 p-[12px]">
        <span className="flex w-fit items-center rounded-[5px] bg-primary-400 p-[4px]">
          <BuildingIcon aria-hidden="true" className="size-6 text-foreground" />
        </span>
        <h2 className="text-subtitle-3 font-bold text-foreground">
          {meta?.complex_name ?? "선택한 공고"}
        </h2>
        {complex?.address && (
          <p className="flex items-center gap-[4px] text-body-3 font-medium text-foreground">
            <LocationPointIcon aria-hidden="true" className="size-[17px] shrink-0" />
            {complex.address}
          </p>
        )}
        <p className="flex items-center gap-[4px] text-subtitle-3 font-medium text-foreground">
          {meta?.unit_type_name ?? "대표 주택형"}
          {typeof meta?.sale_price_manwon === "number" && (
            <span className="font-bold text-info">
              / {formatManwonToEok(meta.sale_price_manwon)}원 기준
            </span>
          )}
        </p>
        {needsCheck && (
          <span className="absolute top-[12px] right-[12px] flex items-center gap-[4px] text-body-3 font-medium text-danger">
            <ErrorSmallIcon aria-hidden="true" className="size-[14px] shrink-0" />
            확인 필요있음
          </span>
        )}
      </div>

      {/* 결론 — 통과 여부와 부족액을 가장 먼저 */}
      <div
        className={cn(
          "flex flex-col gap-[4px] rounded-[6px] p-[14px]",
          data.overall_fund_status === "OK" ? "bg-success-subtle" : "bg-muted"
        )}
      >
        <p className="text-body-3 font-medium text-muted-foreground">
          입주까지 자금 완주
        </p>
        {data.first_shortfall_stage && data.first_shortfall_gap !== null ? (
          <p className="text-subtitle-2 font-bold text-foreground">
            {STAGE_LABEL[data.first_shortfall_stage]}에서{" "}
            <span className="text-danger">
              {formatManwon(data.first_shortfall_gap)} 원
            </span>{" "}
            부족해요
          </p>
        ) : (
          <p className="text-subtitle-2 font-bold text-foreground">
            {data.overall_fund_status === "OK"
              ? "지금 조건으로 완주할 수 있어요"
              : "부족 구간을 계산하지 못했어요"}
          </p>
        )}
      </div>

      {/* 구간별 결과 */}
      <section className="flex flex-col gap-[10px]">
        <h3 className="text-body-2 font-bold text-foreground">
          계약금 · 중도금 · 잔금 단계별 결과
        </h3>

        {stages.length > 0 ? (
          <ul className="flex flex-col gap-[4px] rounded-[6px] border border-primary-500 bg-surface p-[20px]">
            {stages.map((stage, index) => (
              <StageRow
                key={stage.stage}
                stage={stage}
                last={index === stages.length - 1}
              />
            ))}
          </ul>
        ) : (
          <p className="rounded-[6px] bg-muted p-[10px] text-body-3 font-medium text-muted-foreground">
            단지를 선택하지 않아 구간별 판정을 계산하지 못했어요.
          </p>
        )}
      </section>

      {/* 중도금 임계선 — 핵심 판정값이라 한 줄로 유지 */}
      {criticalLine?.critical_loan_ratio != null && (
        <p className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px] rounded-[6px] bg-muted p-[10px] text-body-3 font-medium text-muted-foreground">
          <span>
            중도금 최소 필요{" "}
            <span className="font-bold text-foreground">
              {formatRatio(criticalLine.critical_loan_ratio)}
            </span>
          </span>
          {criticalLine.arranged_ratio != null && (
            <span>
              · 공고상 알선{" "}
              <span className="font-bold text-foreground">
                {formatRatio(criticalLine.arranged_ratio)}
              </span>
            </span>
          )}
          {criticalLine.safety_margin_pp != null && (
            <span>
              · 안전마진{" "}
              <span
                className={cn(
                  "font-bold",
                  criticalLine.safety_status === "SAFE"
                    ? "text-success"
                    : "text-danger"
                )}
              >
                {criticalLine.safety_margin_pp > 0 ? "+" : ""}
                {criticalLine.safety_margin_pp}%p
              </span>
            </span>
          )}
        </p>
      )}

      {/* 미래규정 시나리오 — 디자인상 준비 중 */}
      <section className="flex flex-col gap-[10px]">
        <h3 className="text-body-2 font-bold text-foreground">
          미래규정 변화에 따른 시나리오
        </h3>
        <p className="rounded-[6px] bg-muted p-[10px] text-body-3 font-medium text-muted-foreground">
          준비 중 입니다.
        </p>
      </section>

      {/* 나머지 상세는 판정지로 */}
      <section className="flex flex-col gap-[10px]">
        <h3 className="text-body-2 font-bold text-foreground">
          더 자세한 내용
        </h3>
        <div className="flex flex-col gap-[8px] rounded-[6px] bg-primary-50 p-[12px]">
          <p className="text-body-3 font-medium text-foreground">
            아래 내용은 이메일로 받는 판정지에서 확인해주세요.
          </p>
          <ul className="flex flex-col gap-[2px]">
            {REPORT_ONLY_SECTIONS.map((section) => (
              <li
                key={section}
                className="text-body-3 font-medium text-muted-foreground"
              >
                · {section}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="whitespace-pre-line text-body-3 font-medium text-neutral-300">
        {NOTICE}
        {meta?.calculated_at ? ` · ${meta.calculated_at} 기준` : ""}
      </p>

      <button
        type="button"
        onClick={() => setTermsOpen(true)}
        className={cn(
          "mt-auto flex h-[44px] w-full items-center justify-center rounded-[6px]",
          "bg-primary p-[10px] text-subtitle-4 font-bold text-white"
        )}
      >
        내용 받기
      </button>

      <TermsAgreementSheet
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        onAgree={() => {
          setTermsOpen(false);
          router.push("/eligibility/result/email");
        }}
      />
    </div>
  );
}
