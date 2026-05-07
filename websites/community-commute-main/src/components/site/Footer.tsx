export function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl glass-strong p-8 sm:p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute -inset-x-20 -top-32 h-64 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
          <h3 className="font-display text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight">
            Build a commute your <span className="text-gradient-primary">neighborhood trusts</span>.
          </h3>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Get early access to Omni-Commute and start your first verified Circle this week.
          </p>
          <form className="mt-8 mx-auto max-w-md flex flex-col sm:flex-row gap-2 sm:gap-0 sm:glass sm:rounded-xl sm:p-1.5">
            <input
              type="email"
              placeholder="you@neighborhood.com"
              className="bg-white/[0.03] sm:bg-transparent border border-white/10 sm:border-0 rounded-xl sm:rounded-lg outline-none text-sm px-3 py-2.5 w-full sm:flex-1 placeholder:text-muted-foreground"
            />
            <button className="px-4 py-2.5 sm:py-2 rounded-xl sm:rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium glow-primary whitespace-nowrap">
              Request access
            </button>
          </form>
        </div>
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
          <div>© 2026 Omni-Commute Labs · Built for neighborhoods</div>
          <div className="font-mono">v0.1 · private beta</div>
        </div>
      </div>
    </footer>
  );
}
