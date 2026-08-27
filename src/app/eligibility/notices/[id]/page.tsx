import { notFound } from "next/navigation";

import { AppBar } from "@/components/layout/appBar";
import { NoticeDetail } from "@/components/notices/noticeDetail";
import { findSubscription } from "@/mocks/subscriptions";

export default async function NoticeDetailPage({
  params,
}: PageProps<"/eligibility/notices/[id]">) {
  const { id } = await params;
  const subscription = findSubscription(id);

  if (!subscription) notFound();

  return (
    <>
      <AppBar title="청약 공고 선택" />
      <NoticeDetail subscription={subscription} />
    </>
  );
}
