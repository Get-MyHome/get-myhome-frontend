"use client";

import { useState } from "react";

import AlertCircleIcon from "@/assets/icons/alertCircle.svg";
import BuildingIcon from "@/assets/icons/building.svg";
import CheckCircleIcon from "@/assets/icons/checkCircle.svg";
import HelpCircleIcon from "@/assets/icons/helpCircle.svg";
import LocationPointIcon from "@/assets/icons/locationPoint.svg";
import { TermsAgreementSheet } from "@/components/eligibility/termsAgreementSheet";

const NOTICE =
  "이 결과는 공개 자료 기준 추정이며,\n최종 확정은 금융기관 심사에 따릅니다 · 2026.08.20 규정 기준";

/**
 * 판정 결과 리포트. POST /verdicts 가 아직 미연동이라 값은 디자인(Figma 14:1043)
 * 그대로 정적이다. verdicts API 연동 시 props 로 데이터를 받게 바꾼다.
 */
export function VerdictResult() {
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-[24px] px-gutter pt-[26px] pb-[calc(env(safe-area-inset-bottom)+12px)]">
      {/* 공고 요약 */}
      <div className="relative flex flex-col gap-[8px] rounded-[6px] bg-primary-50 p-[12px]">
        <span className="flex w-fit items-center rounded-[5px] bg-primary-400 p-[4px]">
          <BuildingIcon aria-hidden="true" className="size-6 text-foreground" />
        </span>
        <h2 className="text-subtitle-3 font-bold text-foreground">
          홍은동 힐스테이트
        </h2>
        <p className="flex items-center gap-[4px] text-caption-2 font-medium text-foreground">
          <LocationPointIcon aria-hidden="true" className="size-[17px] shrink-0" />
          서울특별시 서대문구 홍은동
        </p>
        <p className="text-subtitle-3 font-medium text-foreground">
          99㎡ <span className="text-muted-foreground">/ 4.9억원 기준</span>
        </p>
        <span className="absolute right-[12px] top-[12px] flex items-center gap-[4px] text-caption-2 font-medium text-danger">
          <AlertCircleIcon aria-hidden="true" className="size-[14px] shrink-0" />
          확인 필요있음
        </span>
      </div>

      {/* 단계별 결과 */}
      <section className="flex flex-col gap-[10px]">
        <h3 className="text-body-2 font-medium text-foreground">
          계약금 · 중도금 · 잔금 단계별 결과
        </h3>

        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-[6px] text-body-2 font-medium text-foreground">
              <CheckCircleIcon aria-hidden="true" className="size-5 shrink-0" />
              계약금 <span className="text-info">4,200만</span>
            </span>
            <span className="text-body-2 font-medium text-success">가능</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-[6px] text-body-2 font-medium text-foreground">
              <HelpCircleIcon aria-hidden="true" className="size-5 shrink-0" />
              중도금
            </span>
            <span className="text-body-2 font-medium text-danger">확인필요</span>
          </div>
          <p className="rounded-[6px] bg-neutral-100 p-[10px] text-caption-2 font-medium text-neutral-400">
            중도금 비율이 공고문에 없어요.
            <br />
            질문지를 저장해 시행사에 확인해 보세요.
          </p>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-[6px] text-body-2 font-medium text-foreground">
              <HelpCircleIcon aria-hidden="true" className="size-5 shrink-0" />
              잔금
            </span>
            <span className="text-body-2 font-medium text-danger">확인필요</span>
          </div>
        </div>
      </section>

      {/* 미래규정 변화 시나리오 — 디자인상 작업 중 */}
      <section className="flex flex-col gap-[10px]">
        <h3 className="text-body-2 font-medium text-foreground">
          미래규정 변화에 따른 시나리오
        </h3>
        <p className="rounded-[6px] bg-neutral-100 p-[10px] text-caption-2 font-medium text-neutral-400">
          곧 제공될 예정이에요.
        </p>
      </section>

      {/* 대출 상환 시나리오 */}
      <section className="flex flex-col gap-[10px]">
        <h3 className="text-body-2 font-medium text-foreground">
          대출 상환 시나리오
        </h3>
        <p className="rounded-[6px] bg-muted p-[10px] text-caption-2 font-medium text-neutral-400">
          월 95만 원씩 모으면 32개월 만에 채울 수 있어요.
        </p>
      </section>

      <p className="whitespace-pre-line text-caption-2 font-medium text-foreground">
        {NOTICE}
      </p>

      <button
        type="button"
        onClick={() => setTermsOpen(true)}
        className="mt-auto flex h-[44px] w-full items-center justify-center rounded-[6px] bg-primary p-[10px] text-subtitle-4 font-bold text-white"
      >
        내용 받기
      </button>

      <TermsAgreementSheet
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        onAgree={() => setTermsOpen(false)}
      />
    </div>
  );
}
