import { EligibilityCtaCard } from "@/components/home/eligibilityCtaCard";
import { SubscriptionSection } from "@/components/home/subscriptionSection";
import {
  MOCK_SUBSCRIPTIONS,
  MOCK_UPDATED_AT,
} from "@/mocks/subscriptions";

/**
 * 상단 여백: 디자인의 57px 은 기기 상태바 44px 을 포함한 값이라 13px 만 남긴다.
 * 히어로-섹션 간격 20px 은 여기 7px + 스티키 바의 pt 13px 으로 나눠 갖는다.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col gap-[7px] px-gutter pt-[calc(env(safe-area-inset-top)+13px)]">
      <EligibilityCtaCard />
      <SubscriptionSection
        subscriptions={MOCK_SUBSCRIPTIONS}
        updatedAt={MOCK_UPDATED_AT}
      />
    </div>
  );
}
