const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-500/15 text-emerald-400",
  INACTIVE: "bg-white/10 text-white/50",
  MAINTENANCE: "bg-amber-500/15 text-amber-400",
};

export default function Badge({ status }: { status: string }) {
  const style = STATUS_STYLES[status?.toUpperCase()] ?? "bg-white/10 text-white/50";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}