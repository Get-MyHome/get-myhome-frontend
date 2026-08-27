import { ConditionForm } from "@/components/eligibility/conditionForm";
import { AppBar } from "@/components/layout/appBar";

export default function EligibilityPage() {
  return (
    <>
      <AppBar title="조건 입력" />
      <ConditionForm />
    </>
  );
}
