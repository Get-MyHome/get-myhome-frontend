import BuildingIcon from "@/assets/icons/building.svg";
import { SubscriptionCard } from "@/components/home/subscriptionCard";
import type { HousingSubscription } from "@/types/subscription";

/**
 * 판정에 쓸 청약을 고르는 목록.
 * 단지를 고르지 않으면 소득 기준 추정 범위만 계산되므로 그 사실을 먼저 알린다.
 */
export function NoticeSelectList({
  subscriptions,
}: {
  subscriptions: HousingSubscription[];
}) {
  return (
    <div className="flex flex-col gap-[10px] px-gutter pt-5">
      <p className="flex flex-row items-center gap-[6px] text-body-2 font-medium text-foreground">
        <BuildingIcon aria-hidden="true" className="size-5 shrink-0" />
        관심 있는 청약을 선택해주세요.
      </p>

      <ul className="flex flex-col gap-[14px]">
        {subscriptions.map((subscription) => (
          <li key={subscription.id}>
            <SubscriptionCard subscription={subscription} />
          </li>
        ))}
      </ul>
    </div>
  );
}
