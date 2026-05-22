import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center glow-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold tracking-tight">
              Omni<span className="text-primary">Commute</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#engine" className="hover:text-foreground transition">
              Agreement Engine
            </a>
            <a href="#safety" className="hover:text-foreground transition">
              Safety Suite
            </a>
            <a href="#logistics" className="hover:text-foreground transition">
              Logistics
            </a>
            <a href="#dashboard" className="hover:text-foreground transition">
              Dashboard
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              className="text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground glow-primary hover:opacity-95 transition whitespace-nowrap"
            >
              Start a Circle
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
