const STATUS_STYLES: Record<string, string> = {
  CREATED: "bg-blue-500/15 text-blue-400",
  CONFIRMED: "bg-indigo-500/15 text-indigo-400",
  SHIPPED: "bg-amber-500/15 text-amber-400",
  DELIVERED: "bg-emerald-500/15 text-emerald-400",
  CANCELLED: "bg-red-500/15 text-red-400",
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status?.toUpperCase()] ?? "bg-white/10 text-white/50";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}