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
    <div className="flex flex-col gap-5 px-gutter pt-5">
      <p className="text-body-2 font-medium text-foreground">
        관심 있는 청약을 아직 고르지 않아서, 소득 정보만으로 계산한 대략적인
        범위예요. 청약을 선택하면 해당 청약 기준으로 다시 계산돼요.
      </p>

      <section className="flex flex-col gap-[14px]">
        <h2 className="flex items-center gap-[6px] text-body-2 font-medium text-foreground">
          청약 공고 목록
          <span>{subscriptions.length}개</span>
        </h2>

        <ul className="flex flex-col gap-[14px]">
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              <SubscriptionCard subscription={subscription} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
