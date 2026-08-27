import { FilterChip } from "@/components/ui/filterChip";

/**
 * 지역 / 공급유형 / 접수상태 필터.
 * 디자인에 드롭다운 패널이 아직 없어 현재 선택값만 보여준다.
 */
export function SubscriptionFilterBar() {
  return (
    <div className="flex items-center gap-[8px]">
      <FilterChip label="서울 특별시" />
      <FilterChip label="전체" />
      <FilterChip label="접수중" />
    </div>
  );
}
