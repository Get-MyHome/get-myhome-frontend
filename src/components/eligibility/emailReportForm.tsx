"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/utils/cn";

/**
 * 판정 리포트 이메일 발송 (Figma 14:830).
 * POST /verdicts/{id}/email 은 verdictId 가 필요한데 POST /verdicts 가 아직
 * 미연동이라, 지금은 [다음] 시 전송 완료 팝업만 띄운다 (UI 퍼블).
 */
export function EmailReportForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showError = touched && email !== "" && !valid;

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
        </div>

        <p className="rounded-[6px] bg-muted p-[10px] text-caption-2 font-medium text-neutral-400">
          판정 결과 자세한 내용을 모아 이메일로 보내드립니다.
          <br />
          이메일 주소를 입력해주세요.
        </p>
      </div>

      <button
        type="button"
        disabled={!valid}
        onClick={() => setSent(true)}
        className={cn(
          "flex h-[48px] w-full items-center justify-center text-body-2 font-bold text-white",
          valid ? "bg-primary" : "bg-primary-400"
        )}
      >
        다음
      </button>

      {sent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setSent(false)}
            className="absolute inset-0 bg-black/55"
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
              className="flex h-[52px] w-full items-center justify-center bg-primary text-body-2 font-medium text-white"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
