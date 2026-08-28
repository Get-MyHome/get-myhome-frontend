import { formatDotDate } from "@/utils/format";

import type { HousingSubscription } from "@/types/subscription";
import { SubscriptionCard } from "./subscriptionCard";
import { SubscriptionFilterBar } from "./subscriptionFilterBar";

export function SubscriptionSection({
  subscriptions,
  updatedAt,
}: {
  subscriptions: HousingSubscription[];
  updatedAt: string;
}) {
  return (
    <section className="flex flex-col">
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
