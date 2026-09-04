"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { VERDICT_ID_STORAGE_KEY } from "@/constants/storage";
import { getHttpStatus } from "@/lib/httpClient";
import { useVerdictEmailMutation } from "@/queries/verdicts";
import { cn } from "@/utils/cn";
import { useIsMounted, useSessionRaw } from "@/utils/sessionState";

/**
 * 판정 리포트 이메일 발송 (Figma 21:537).
 * 판정 화면에서 적어둔 verdict_id 로 POST /verdicts/{id}/email 을 호출한다.
 */
export function EmailReportForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const mounted = useIsMounted();
  const rawVerdictId = useSessionRaw(VERDICT_ID_STORAGE_KEY);
  const verdictId = useMemo(() => {
    if (rawVerdictId === null) return null;
    try {
      return JSON.parse(rawVerdictId) as string;
    } catch {
      return null;
    }
  }, [rawVerdictId]);

  const { mutate, isPending, isError, error } = useVerdictEmailMutation(verdictId);
  // 판정 결과는 서버에서 만료된다. 그때는 다시 판정해야 한다
  const expired = getHttpStatus(error) === 404;

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showError = touched && email !== "" && !valid;
  // 판정을 거치지 않고 들어오면 보낼 대상이 없다
  const missingVerdict = mounted && verdictId === null;
  const submittable = valid && !isPending && !missingVerdict;

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-[12px] px-gutter pt-[26px]">
        <h1 className="text-subtitle-2 font-medium text-foreground">
          이메일 주소를 입력해주세요.
        </h1>

        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="report-email"
            className="text-body-2 font-medium text-neutral-500"
          >
            이메일 주소
          </label>
          <input
            id="report-email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value.trim())}
            onBlur={() => setTouched(true)}
            placeholder="Getmyhome@gmail.com"
            className={cn(
              "h-[46px] rounded-[6px] border px-[10px] text-body-2 font-medium text-foreground placeholder:text-muted-foreground focus:outline-none",
              showError ? "border-danger" : "border-primary"
            )}
          />
          {showError && (
            <p className="text-caption-2 font-medium text-danger">
              이메일 주소가 맞지 않습니다. 다시 입력해주세요.
            </p>
          )}
          {missingVerdict && (
            <p className="text-caption-2 font-medium text-danger">
              판정 결과가 없어요. 판정을 먼저 진행해주세요.
            </p>
          )}
          {isError && (
            <p className="text-caption-2 font-medium text-danger">
              {expired
                ? "판정 결과가 만료됐어요. 판정을 다시 진행해주세요."
                : "발송에 실패했어요. 잠시 후 다시 시도해주세요."}
            </p>
          )}
        </div>

        <p className="rounded-[6px] bg-muted p-[10px] text-caption-2 font-medium text-neutral-400">
          판정 결과 자세한 내용을 모아 이메일로 보내드립니다.
          <br />
          이메일 주소를 입력해주세요.
        </p>
      </div>

      {/* 다른 화면과 같은 하단 여백 규칙(좌우 gutter · 아래 24px)에 맞춘다 */}
      <div className="px-gutter pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <button
          type="button"
          disabled={!submittable}
          onClick={() => mutate(email, { onSuccess: () => setSent(true) })}
          className={cn(
            "flex h-[48px] w-full cursor-pointer items-center justify-center rounded-[6px]",
            "text-body-2 font-bold text-white",
            "disabled:cursor-not-allowed",
            submittable ? "bg-primary" : "bg-primary-400"
          )}
        >
          {isPending ? "보내는 중" : "다음"}
        </button>
      </div>

      {sent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setSent(false)}
            className="absolute inset-0 cursor-pointer bg-black/55"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-[262px] overflow-hidden rounded-[10px] bg-surface"
          >
            <div className="flex flex-col items-center gap-[8px] px-[16px] pt-[20px] pb-[20px]">
              <p className="text-subtitle-3 font-bold text-foreground">
                이메일 전송 완료
              </p>
              <p className="text-body-2 font-medium text-neutral-400">
                이메일에서 확인해 주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                router.push("/");
              }}
              className="flex h-[52px] w-full cursor-pointer items-center justify-center bg-primary text-body-2 font-medium text-white"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
