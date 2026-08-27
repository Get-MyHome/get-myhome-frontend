import { UnitTypeSelector } from "@/components/notices/unitTypeSelector";
import type { HousingSubscription } from "@/types/subscription";
import { formatYearMonth } from "@/utils/format";

export function NoticeDetail({
  subscription,
}: {
  subscription: HousingSubscription;
}) {
  const { name, address, moveInMonth, unitTypes, noticeUrl } = subscription;

  return (
    <div className="flex flex-1 flex-col gap-5 px-gutter pt-5 pb-[calc(env(safe-area-inset-bottom)+12px)]">
      <p className="text-body-2 font-medium text-foreground">
        평형을 선택해주세요.
      </p>

      <div className="flex flex-col gap-[6px]">
        <h2 className="text-subtitle-3 font-bold text-foreground">{name}</h2>
        <p className="text-body-3 font-medium text-foreground">{address}</p>
        <p className="text-body-3 font-medium text-foreground">
          입주 예정 {formatYearMonth(moveInMonth)}
        </p>
      </div>

      <UnitTypeSelector unitTypes={unitTypes} noticeUrl={noticeUrl} />
    </div>
  );
}
