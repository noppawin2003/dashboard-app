"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Boxes,
  Users,
  Settings,
  Radio,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/modules", label: "Modules", icon: Boxes },
  { href: "/dashboard/data-sheet", label: "Data Sheet", icon: Radio },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border">
        <Radio className="h-5 w-5 text-accent" strokeWidth={2.2} />
        <span className="font-display font-semibold text-[15px] tracking-tight">
          Control Panel
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-surface-2 text-text"
                  : "text-text-muted hover:bg-surface-2 hover:text-text"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <p className="font-mono text-[11px] text-text-muted">
          starter build · v0.1.0
        </p>
      </div>
    </aside>
  );
}
