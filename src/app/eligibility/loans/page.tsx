import { AppBar } from "@/components/layout/appBar";
import { LoanRouteList } from "@/components/eligibility/loanRouteList";
import { ProgressBar } from "@/components/ui/progressBar";

export default function LoansPage() {
  return (
    <>
      <AppBar title="대출" borderless />
      <ProgressBar current={2} total={3} label="대출 자격 조회 진행 단계" />
      <LoanRouteList />
    </>
  );
}
