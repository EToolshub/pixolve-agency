import { getOrderStatus, type OrderStatus } from "@/lib/account";
import { cn } from "@/lib/utils";

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const { label, tone } = getOrderStatus(status);
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset", tone, className)}>
      {label}
    </span>
  );
}
