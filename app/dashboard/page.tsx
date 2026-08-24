import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import StatusPulse from "@/components/StatusPulse";
import { getMetricSummaries, getPlatformModules, getRecentActivity } from "@/lib/data";

export default async function OverviewPage() {
  const [metrics, modules, activity] = await Promise.all([
    getMetricSummaries(),
    getPlatformModules(),
    getRecentActivity(),
  ]);

  return (
    <>
      <Topbar title="Overview" />

      <main className="flex-1 p-6 space-y-6">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <StatCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-display font-semibold text-sm">
                Platform modules
              </h2>
              <span className="font-mono text-xs text-text-muted">
                {modules.length} total
              </span>
            </div>
            <ul className="divide-y divide-border">
              {modules.map((mod) => (
                <li
                  key={mod.id}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div>
                    <p className="text-sm font-medium">{mod.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {mod.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusPulse status={mod.status} />
                    <span className="font-mono text-[11px] text-text-muted">
                      {mod.status === "offline" ? "—" : `${mod.latencyMs} ms`}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-surface">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-display font-semibold text-sm">
                Recent activity
              </h2>
            </div>
            <ul className="divide-y divide-border">
              {activity.map((event) => (
                <li key={event.id} className="px-5 py-3.5">
                  <p className="text-sm">
                    <span className="font-medium">{event.actor}</span>{" "}
                    <span className="text-text-muted">{event.action}</span>{" "}
                    <span className="font-medium">{event.target}</span>
                  </p>
                  <p className="font-mono text-[11px] text-text-muted mt-1">
                    {event.timestamp}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
