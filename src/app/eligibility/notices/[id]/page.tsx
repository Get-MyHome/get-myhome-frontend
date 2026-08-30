import { AppBar } from "@/components/layout/appBar";
import { NoticeDetail } from "@/components/notices/noticeDetail";
import { ProgressBar } from "@/components/ui/progressBar";

export default async function NoticeDetailPage({
  params,
}: PageProps<"/eligibility/notices/[id]">) {
  const { id } = await params;

  return (
    <>
      <AppBar title="청약 공고 선택" borderless />
      <ProgressBar current={2} total={3} label="청약 공고 선택 진행 단계" />
      <NoticeDetail complexId={id} />
    </>
  );
}
