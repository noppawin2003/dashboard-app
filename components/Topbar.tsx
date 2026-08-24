import { Search } from "lucide-react";

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-bg">
      <h1 className="font-display font-semibold text-lg">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-muted">
          <Search className="h-3.5 w-3.5" />
          <span>Search…</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-surface-2 border border-border flex items-center justify-center font-mono text-xs text-text-muted">
          NT
        </div>
      </div>
    </header>
  );
}
