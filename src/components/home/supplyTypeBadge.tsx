import { Badge } from "@/components/ui/badge";

import type { SupplyType } from "@/types/subscription";

const SUPPLY_TYPE_BADGE: Record<
  SupplyType,
  { label: string; className: string }
> = {
  private: { label: "민영", className: "bg-supply-private" },
  public: { label: "국민", className: "bg-supply-public" },
};

export function SupplyTypeBadge({ supplyType }: { supplyType: SupplyType }) {
  const { label, className } = SUPPLY_TYPE_BADGE[supplyType];

  return <Badge className={className}>{label}</Badge>;
}
