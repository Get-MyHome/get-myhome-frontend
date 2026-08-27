import { formatDotDate } from "@/utils/format";

import type { HousingSubscription } from "@/types/subscription";
import { SubscriptionCard } from "./subscriptionCard";
import { SubscriptionFilterBar } from "./subscriptionFilterBar";

export function SubscriptionSection({
  subscriptions,
  updatedAt,
}: {
  subscriptions: HousingSubscription[];
  /** 목록 갱신일. ISO 날짜(YYYY-MM-DD) */
  updatedAt: string;
}) {
  return (
    <section className="flex flex-col">
      {/* 스크롤하면 헤더 + 필터가 상단에 붙는다.
          -mx-gutter 로 배경을 화면 폭 끝까지 늘려야 카드가 좌우 여백으로 비치지 않는다.
          pt/pb 는 각각 히어로와의 간격, 리스트와의 간격에서 옮겨온 값이라
          고정되지 않은 상태의 레이아웃은 이전과 같다. */}
      <div className="sticky top-[env(safe-area-inset-top)] z-10 -mx-gutter flex flex-col gap-[6px] bg-background px-gutter pt-[13px] pb-[14px]">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-[6px] text-body-2 font-medium text-foreground">
            진행중인 청약
            <span>{subscriptions.length}개</span>
          </h2>
          <p className="text-body-3 font-medium text-neutral-300">
            {formatDotDate(updatedAt)} 업데이트
          </p>
        </div>

        <SubscriptionFilterBar />
      </div>

      <ul className="flex flex-col gap-[14px]">
        {subscriptions.map((subscription) => (
          <li key={subscription.id}>
            <SubscriptionCard subscription={subscription} />
          </li>
        ))}
      </ul>
    </section>
  );
}
