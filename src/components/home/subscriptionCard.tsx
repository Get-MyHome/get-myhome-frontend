import ChevronRightIcon from "@/assets/icons/chevronRight.svg";
import { formatDotDate, formatEok } from "@/utils/format";

import type { HousingSubscription } from "@/types/subscription";
import { SupplyTypeBadge } from "./supplyTypeBadge";

export function SubscriptionCard({
  subscription,
}: {
  subscription: HousingSubscription;
}) {
  const { supplyType, deadline, name, address, price } = subscription;

  return (
    <article className="flex items-center justify-between gap-[12px] rounded-[6px] bg-muted p-[12px]">
      <div className="flex min-w-0 flex-col gap-[2px]">
        <div className="flex items-end gap-[6px]">
          <SupplyTypeBadge supplyType={supplyType} />
          <span className="text-body-3 font-medium text-muted-foreground">
            {formatDotDate(deadline)} 까지
          </span>
        </div>

        <h3 className="text-subtitle-4 font-bold text-foreground">{name}</h3>
        <p className="text-body-3 font-medium text-foreground">{address}</p>
        <p className="text-body-3 font-medium text-info">
          분양가 {formatEok(price)}
        </p>
      </div>

      <ChevronRightIcon className="size-6 shrink-0 text-foreground" />
    </article>
  );
}
