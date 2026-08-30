import Link from "next/link";

import ChevronRightIcon from "@/assets/icons/chevronRight.svg";
import type { HousingSubscription } from "@/types/subscription";
import { formatDotDate, formatEok } from "@/utils/format";

import { SupplyTypeBadge } from "./supplyTypeBadge";

/** 청약 공고 카드. 누르면 평형 선택 화면으로 넘어간다 */
export function SubscriptionCard({
  subscription,
}: {
  subscription: HousingSubscription;
}) {
  const { id, supplyType, supplyTypeLabel, deadline, name, address, price } =
    subscription;

  return (
    <Link
      href={`/eligibility/notices/${id}`}
      className="flex items-center justify-between rounded-[6px] bg-muted p-[12px]"
    >
      <div className="flex min-w-0 flex-col gap-[6px]">
        <div className="flex items-end gap-[6px]">
          <SupplyTypeBadge supplyType={supplyType} label={supplyTypeLabel} />
          <span className="text-body-3 font-medium text-muted-foreground">
            {formatDotDate(deadline)} 까지
          </span>
        </div>

        <div className="flex flex-col gap-[2px]">
          <h3 className="text-subtitle-4 font-bold text-foreground">{name}</h3>
          <p className="text-body-3 font-medium text-foreground">{address}</p>
          <p className="text-body-3 font-medium text-info">
            분양가 {price === null ? "미정" : formatEok(price)}
          </p>
        </div>
      </div>

      <ChevronRightIcon
        aria-hidden="true"
        className="size-6 shrink-0 text-foreground"
      />
    </Link>
  );
}
