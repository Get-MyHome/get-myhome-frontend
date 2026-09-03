import Link from "next/link";

import ChevronRightIcon from "@/assets/icons/chevronRight.svg";
import type { HousingSubscription } from "@/types/subscription";
import { formatDotDate, formatEok } from "@/utils/format";

import { SupplyTypeBadge } from "./supplyTypeBadge";

/**
 * 청약 공고 카드. 누른 뒤 어디로 갈지는 목록마다 달라서 부모가 정한다.
 * (매칭 목록 → 평형 선택 / 공고 탭 → 판정 흐름 시작)
 */
export function SubscriptionCard({
  subscription,
  href,
  onSelect,
}: {
  subscription: HousingSubscription;
  href: string;
  onSelect?: () => void;
}) {
  const {
    supplyType,
    supplyTypeLabel,
    deadline,
    name,
    address,
    price,
    matchedProductNames,
  } = subscription;

  return (
    <Link
      href={href}
      onClick={onSelect}
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

        {matchedProductNames && matchedProductNames.length > 0 && (
          <ul className="flex flex-wrap gap-[4px]">
            {matchedProductNames.map((productName) => (
              <li
                key={productName}
                className="rounded-[4px] bg-primary-subtle px-[6px] py-[2px] text-caption-2 font-medium text-primary"
              >
                {productName}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ChevronRightIcon
        aria-hidden="true"
        className="size-6 shrink-0 text-foreground"
      />
    </Link>
  );
}
