import Topbar from "@/components/Topbar";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" />
      <main className="flex-1 p-6 max-w-lg">
        <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Platform name
            </label>
            <input
              type="text"
              defaultValue="My Platform"
              className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Alert email
            </label>
            <input
              type="email"
              placeholder="ops@yourplatform.com"
              className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent placeholder:text-text-muted"
            />
          </div>
          <button className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-[#14100a]">
            Save changes
          </button>
        </div>
      </main>
    </>
  );
}
