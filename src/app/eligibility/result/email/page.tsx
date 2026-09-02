import { AppBar } from "@/components/layout/appBar";
import { EmailReportForm } from "@/components/eligibility/emailReportForm";

export default function EmailReportPage() {
  return (
    <>
      <AppBar title="내용 받기" />
      <EmailReportForm />
    </>
  );
}
