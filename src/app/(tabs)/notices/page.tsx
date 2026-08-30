import { SubscriptionSection } from "@/components/notices/subscriptionSection";

export default function NoticesPage() {
  return (
    <div className="flex flex-1 flex-col px-gutter pt-[calc(env(safe-area-inset-top)+13px)]">
      <SubscriptionSection />
    </div>
  );
}
