import Topbar from "@/components/Topbar";
import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <>
      <Topbar title="Users" />
      <main className="flex-1 p-6">
        <div className="rounded-lg border border-dashed border-border bg-surface p-10 flex flex-col items-center text-center">
          <div className="h-10 w-10 rounded-full bg-surface-2 flex items-center justify-center mb-4">
            <Users className="h-5 w-5 text-text-muted" />
          </div>
          <p className="font-display font-semibold text-sm">
            No user data connected yet
          </p>
          <p className="text-xs text-text-muted mt-1.5 max-w-sm">
            This page is ready for a users table. Connect your database or
            auth provider and list your team here.
          </p>
        </div>
      </main>
    </>
  );
}
