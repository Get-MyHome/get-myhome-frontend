import { AppBar } from "@/components/layout/appBar";
import { SubscriptionSection } from "@/components/notices/subscriptionSection";

export default function NoticeSelectPage() {
  return (
    <>
      <AppBar title="청약 공고 선택" />
      <div className="flex flex-1 flex-col px-gutter pt-[13px]">
        <SubscriptionSection headerOffset="top-[calc(env(safe-area-inset-top)+56px)]" />
      </div>
    </>
  );
}
