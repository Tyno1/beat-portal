import { Link, Outlet, useLocation } from "react-router-dom";
import { ThemeToggle } from "../atoms";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  navItems: NavItem[];
}

export default function DashboardLayout({ navItems }: DashboardLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-border flex flex-col">
        {/* Logo/Title */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Beat Portal
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200
                      ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/30"
                      }
                    `}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border space-y-4">
          {/* Offline Status */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-success/10 text-success">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span className="text-sm font-medium">Offline Mode</span>
          </div>

          {/* Library Stats */}
          <div className="p-3 rounded-md bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Library Stats
            </h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Total Tracks: 1,247</p>
              <p>Total Duration: 82h 15m</p>
              <p>Genres: 24</p>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

