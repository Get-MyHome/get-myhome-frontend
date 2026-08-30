import { Badge } from "@/components/ui/badge";

import type { SupplyType } from "@/types/subscription";

/** other 는 디자인 팔레트에 정의된 색이 없어 neutral 톤으로 임시 처리한다 */
const SUPPLY_TYPE_BADGE: Record<
  SupplyType,
  { label: string; className: string }
> = {
  private: { label: "민영", className: "bg-supply-private" },
  public: { label: "국민", className: "bg-supply-public" },
  other: { label: "", className: "bg-muted text-muted-foreground" },
};

export function SupplyTypeBadge({
  supplyType,
  label,
}: {
  supplyType: SupplyType;
  label?: string;
}) {
  const preset = SUPPLY_TYPE_BADGE[supplyType];

  return <Badge className={preset.className}>{label ?? preset.label}</Badge>;
}
