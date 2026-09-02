import CheckCircleIcon from "@/assets/icons/checkCircle.svg";
import PersonIcon from "@/assets/icons/person.svg";
import WarnTriangleIcon from "@/assets/icons/warnTriangle.svg";

/**
 * 홈의 "예시로 보는 판정 리포트". 로그인·입력 없이 결과 화면이 어떤 모습인지 보여준다.
 * 내용은 기획서 데모 케이스(GAP-001, 철수 씨)를 그대로 박제한 정적 예시다.
 */
const STAGES = [
  { label: "계약금", status: "가능" },
  { label: "중도금", status: "가능" },
  { label: "잔금", status: "부족" },
] as const;

export function ExampleReportCard() {
  return (
    <section className="flex flex-col gap-[14px]">
      <h2 className="text-body-2 font-bold text-foreground">
        판정 리포트를 받아 보세요!
      </h2>

      <div className="flex flex-col gap-[10px] rounded-[10px] bg-surface p-[20px] shadow-[0_4px_7.25px_rgba(0,0,0,0.2)]">
        <div className="flex items-start gap-[7px]">
          <PersonIcon aria-hidden="true" className="size-6 shrink-0" />
          <div className="flex flex-col">
            <p className="text-body-2 font-medium text-foreground">
              연소득 5,000만 원 · 무주택 청년
            </p>
            <p className="text-caption-2 font-medium text-neutral-400">
              가상 예시
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-border" />

        <div className="flex flex-col gap-[4px]">
          <p className="text-body-2 font-bold text-foreground">
            공덕 삼성 래미안 · 84㎡
          </p>
          <p className="text-caption-2 font-medium text-info">
            분양가 4.2억 원 기준
          </p>
        </div>

        <ul className="flex flex-col gap-[6px]">
          {STAGES.map((stage) => (
            <li
              key={stage.label}
              className="flex items-center justify-between rounded-[6px] bg-muted px-[10px] py-[8px]"
            >
              <span className="text-caption-2 font-medium text-foreground">
                {stage.label}
              </span>
              {stage.status === "가능" ? (
                <span className="flex items-center gap-[4px] text-caption-2 font-medium text-success">
                  <CheckCircleIcon aria-hidden="true" className="size-4 shrink-0" />
                  가능
                </span>
              ) : (
                <span className="flex items-center gap-[4px] text-caption-2 font-medium text-warning-foreground">
                  <WarnTriangleIcon aria-hidden="true" className="size-4 shrink-0" />
                  3,000만 부족
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-caption-2 font-medium text-neutral-400">
        공개 자료 기준으로 계산한 예시에요.
      </p>
    </section>
  );
}
