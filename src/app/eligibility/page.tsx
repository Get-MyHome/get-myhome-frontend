import { ConditionForm } from "@/components/eligibility/conditionForm";
import { AppBar } from "@/components/layout/appBar";
import { ProgressBar } from "@/components/ui/progressBar";

/** 조건 입력 → 공고 선택 → 평형 선택 3단계 중 1단계 */
export default function EligibilityPage() {
  return (
    <>
      <AppBar title="조건 입력" borderless />
      <ProgressBar current={1} total={3} label="조건 입력 진행 단계" />
      <ConditionForm />
    </>
  );
}
