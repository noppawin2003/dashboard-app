import type { ModuleStatus } from "@/lib/data";

const STATUS_STYLES: Record<ModuleStatus, { color: string; label: string }> = {
  online: { color: "var(--status-online)", label: "Online" },
  warning: { color: "var(--status-warn)", label: "Degraded" },
  offline: { color: "var(--status-offline)", label: "Offline" },
};

export default function StatusPulse({ status }: { status: ModuleStatus }) {
  const { color, label } = STATUS_STYLES[status];

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="status-dot inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: color, color }}
      />
      <span className="font-mono text-xs text-text-muted">{label}</span>
    </span>
  );
}
