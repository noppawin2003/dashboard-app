// This file holds placeholder data shaped like what a real API would return.
// When you connect a backend, replace each function's body with a fetch call
// (or a database query) that returns the same shape — nothing else has to change.

export type ModuleStatus = "online" | "warning" | "offline";

export type PlatformModule = {
  id: string;
  name: string;
  description: string;
  status: ModuleStatus;
  latencyMs: number;
};

export type MetricSummary = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
};

export type ActivityEvent = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
};

export async function getMetricSummaries(): Promise<MetricSummary[]> {
  return [
    { label: "Active users", value: "12,480", delta: "+4.2%", trend: "up" },
    { label: "Requests / min", value: "3,214", delta: "+1.1%", trend: "up" },
    { label: "Error rate", value: "0.32%", delta: "-0.08%", trend: "down" },
    { label: "Avg. response", value: "184 ms", delta: "+6 ms", trend: "flat" },
  ];
}

export async function getPlatformModules(): Promise<PlatformModule[]> {
  return [
    {
      id: "api-gateway",
      name: "API Gateway",
      description: "Routes and rate-limits every request entering the platform.",
      status: "online",
      latencyMs: 42,
    },
    {
      id: "auth-service",
      name: "Auth Service",
      description: "Handles sign-in, sessions, and permission checks.",
      status: "online",
      latencyMs: 58,
    },
    {
      id: "data-pipeline",
      name: "Data Pipeline",
      description: "Streams and transforms events for analytics.",
      status: "warning",
      latencyMs: 310,
    },
    {
      id: "billing",
      name: "Billing",
      description: "Metering, invoices, and subscription state.",
      status: "online",
      latencyMs: 71,
    },
    {
      id: "notifications",
      name: "Notifications",
      description: "Email, SMS, and in-app delivery queues.",
      status: "offline",
      latencyMs: 0,
    },
  ];
}

export async function getRecentActivity(): Promise<ActivityEvent[]> {
  return [
    { id: "1", actor: "Nan T.", action: "deployed", target: "api-gateway v1.4.2", timestamp: "2 min ago" },
    { id: "2", actor: "System", action: "flagged latency on", target: "data-pipeline", timestamp: "18 min ago" },
    { id: "3", actor: "Ploy K.", action: "invited", target: "3 new team members", timestamp: "1 hr ago" },
    { id: "4", actor: "System", action: "restarted", target: "notifications", timestamp: "3 hr ago" },
    { id: "5", actor: "Arm S.", action: "updated permissions for", target: "Billing module", timestamp: "5 hr ago" },
  ];
}
