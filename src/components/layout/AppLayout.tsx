import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PenTool, Share2, Workflow, Settings, Sparkles, Moon, Sun } from "lucide-react";
import { cn } from "@/utils/cn";

const navItems = [
  { icon: LayoutDashboard, label: "控制台", href: "/" },
  { icon: PenTool, label: "创作与发布", href: "/editor" },
  { icon: Share2, label: "平台管理", href: "/platforms" },
  { icon: Workflow, label: "工作流规范", href: "/workflows" },
  { icon: Settings, label: "系统设置", href: "/settings" },
];

export function AppLayout({ children, isDark, toggleTheme }: { children: ReactNode, isDark?: boolean, toggleTheme?: () => void }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[var(--layout-bg)] text-foreground overflow-hidden font-sans selection:bg-primary/30 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--layout-border)] bg-[var(--sidebar-bg)] flex-col hidden md:flex relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-colors duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(124,58,237,0.15)]">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)] transition-colors duration-300">
              PubAgent
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">
              Workspace
            </p>
          </div>
          {toggleTheme && (
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--sidebar-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
                            (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group relative",
                  isActive
                    ? "text-[var(--text-primary)] bg-[var(--sidebar-hover)] border border-[var(--layout-border)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] dark:bg-white/[0.04] dark:border-white/[0.05]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--sidebar-hover)] dark:hover:bg-white/[0.02]"
                )}
              >
                {isActive && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                )}
                <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 m-3 rounded-xl border border-[var(--layout-border)] bg-[var(--sidebar-hover)] dark:bg-white/[0.02] dark:border-white/[0.05] overflow-hidden relative transition-colors duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-purple-700 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] border border-white/10">
              AI
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-[var(--text-primary)] transition-colors duration-300">Agent Status</p>
              <p className="text-[11px] text-primary flex items-center gap-1.5 mt-0.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                Online & Ready
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[var(--layout-bg)] transition-colors duration-300">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px] pointer-events-none transition-colors duration-300" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] pointer-events-none transition-colors duration-300" />

        {/* Top header for mobile */}
        <header className="md:hidden h-14 border-b border-[var(--layout-border)] flex items-center px-4 justify-between bg-[var(--sidebar-bg)]/80 backdrop-blur-md z-20 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <h1 className="font-bold text-[var(--text-primary)] transition-colors duration-300">PubAgent</h1>
          </div>
          {toggleTheme && (
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--text-secondary)]"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth relative z-10">
          <div className="max-w-5xl mx-auto animate-fade-in relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
