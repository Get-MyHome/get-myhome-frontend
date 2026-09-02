import { AppBar } from "@/components/layout/appBar";
import { VerdictResult } from "@/components/eligibility/verdictResult";
import { ProgressBar } from "@/components/ui/progressBar";

export default function VerdictResultPage() {
  return (
    <>
      <AppBar title="판정결과" borderless />
      <ProgressBar current={3} total={3} label="판정 진행 단계" />
      <VerdictResult />
    </>
  );
}
