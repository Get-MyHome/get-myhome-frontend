import { AppBar } from "@/components/layout/appBar";
import { OptionalConditionForm } from "@/components/eligibility/optionalConditionForm";
import { ProgressBar } from "@/components/ui/progressBar";

export default function LoanConditionDetailPage() {
  return (
    <>
      <AppBar title="조건 추가 입력" borderless />
      <ProgressBar current={2} total={3} label="대출 자격 조회 진행 단계" />
      <OptionalConditionForm />
    </>
  );
}
