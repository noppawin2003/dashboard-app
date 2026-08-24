import Topbar from "@/components/Topbar";
import StatusPulse from "@/components/StatusPulse";
import { getPlatformModules } from "@/lib/data";

export default async function ModulesPage() {
  const modules = await getPlatformModules();

  return (
    <>
      <Topbar title="Modules" />
      <main className="flex-1 p-6">
        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Module</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {modules.map((mod) => (
                <tr key={mod.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium">{mod.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {mod.description}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusPulse status={mod.status} />
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-text-muted">
                    {mod.status === "offline" ? "—" : `${mod.latencyMs} ms`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-text-muted max-w-md">
          Each row reads from{" "}
          <code className="font-mono text-text">lib/data.ts</code>. Point{" "}
          <code className="font-mono text-text">getPlatformModules()</code> at
          your real service registry and this table updates automatically.
        </p>
      </main>
    </>
  );
}
