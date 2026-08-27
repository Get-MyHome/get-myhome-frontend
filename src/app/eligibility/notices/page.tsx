import { NoticeSelectList } from "@/components/notices/noticeSelectList";
import { AppBar } from "@/components/layout/appBar";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export default function NoticeSelectPage() {
  return (
    <>
      <AppBar title="청약 공고 선택" />
      <NoticeSelectList subscriptions={MOCK_SUBSCRIPTIONS} />
    </>
  );
}
