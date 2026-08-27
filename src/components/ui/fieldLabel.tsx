import type { ReactNode } from "react";

/** 폼 필드 라벨. 필수 항목은 뒤에 빨간 별표가 붙는다. */
export function FieldLabel({
  htmlFor,
  required = false,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="text-subtitle-4 font-bold text-foreground">
      {children}
      {required && (
        <span className="text-danger" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
