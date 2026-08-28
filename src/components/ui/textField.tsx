"use client";

import { useId } from "react";

import { cn } from "@/utils/cn";

import { FieldLabel } from "./fieldLabel";

/**
 * 라벨 + 단일 행 입력. 오른쪽 suffix 는 단위("만원")나 입력값 읽기("팔천만원")를 보여준다.
 * 테두리는 에러면 danger, 값이 있는 채로 포커스되면 primary-600, 그 외에는 primary-400 이다.
 */
export function TextField({
  label,
  required = false,
  value,
  onChange,
  onBlur,
  placeholder,
  suffix,
  inputMode = "text",
  maxLength,
  error,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  suffix?: string;
  inputMode?: "text" | "numeric";
  maxLength?: number;
  /** 채워지면 인라인 에러로 노출된다 */
  error?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const filled = value.length > 0;

  return (
    <div className="flex flex-col gap-[6px]">
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>

      <div
        className={cn(
          "flex items-center gap-[10px] rounded-[6px] border p-[10px]",
          error
            ? "border-danger"
            : filled
              ? "border-primary-400 focus-within:border-primary"
              : "border-primary-400"
        )}
      >
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          // iOS Safari 는 16px 미만 입력에 포커스하면 화면을 확대한다.
          // maximum-scale 로 막으면 핀치 줌까지 죽으므로 글자 크기로 해결한다.
          // line-height 는 20 을 유지해 입력 박스 높이는 그대로다 (10+20+10+2=42)
          className="min-w-0 flex-1 text-[16px] leading-[20px] font-medium text-foreground outline-none placeholder:text-neutral-300"
        />
        {suffix && (
          <span className="shrink-0 text-body-2 font-medium text-neutral-300">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p id={errorId} className="text-body-3 font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
