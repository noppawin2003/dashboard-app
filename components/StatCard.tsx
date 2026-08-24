import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { MetricSummary } from "@/lib/data";

const TREND_ICON = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
};

export default function StatCard({ metric }: { metric: MetricSummary }) {
  const Icon = TREND_ICON[metric.trend];

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-sm text-text-muted">{metric.label}</p>
      <div className="mt-2 flex items-end justify-between">
        <span className="font-display text-2xl font-semibold">
          {metric.value}
        </span>
        <span className="flex items-center gap-1 text-xs font-mono text-text-muted">
          <Icon className="h-3.5 w-3.5" />
          {metric.delta}
        </span>
      </div>
    </div>
  );
}
