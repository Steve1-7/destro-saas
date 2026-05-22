import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Shield,
  LayoutDashboard,
  Users,
  FileSignature,
  AlertTriangle,
  MessageSquare,
  LogOut,
  Settings,
  Car,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Dashboard — Omni-Commute" }] }),
  component: AppLayout,
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/driver", label: "Driver", icon: Car },
  { to: "/app/circles", label: "Circles", icon: Users },
  { to: "/app/contracts", label: "Contracts", icon: FileSignature },
  { to: "/app/safety", label: "Safety", icon: AlertTriangle },
  { to: "/app/messages", label: "Messages", icon: MessageSquare },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

function AppLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { redirect: location.pathname } as { redirect: string } });
    }
  }, [user, loading, navigate, location]);

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-muted-foreground font-mono">Authenticating…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-surface-1/60 backdrop-blur-xl sticky top-0 h-screen">
        <div className="p-5 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center glow-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold tracking-tight">
              Omni<span className="text-primary">Commute</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to as string}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  active
                    ? "bg-primary/10 text-foreground border border-primary/30 glow-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/5">
          <div className="px-3 py-2 mb-2">
            <div className="text-xs text-muted-foreground">Signed in as</div>
            <div className="text-sm font-medium truncate">{user.email}</div>
          </div>
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 glass border-b border-white/5">
        <div className="flex items-center justify-between p-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-primary grid place-items-center">
              <Shield className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-sm">OmniCommute</span>
          </Link>
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
            className="text-xs text-muted-foreground"
          >
            Sign out
          </button>
        </div>
        <div className="flex overflow-x-auto px-2 pb-2 gap-1 scrollbar-none">
          {nav.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to as string}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${
                  active
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground border border-transparent"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="flex-1 pt-28 md:pt-0 min-w-0">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
