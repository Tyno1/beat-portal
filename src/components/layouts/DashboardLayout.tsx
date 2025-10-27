import { PanelLeft } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Badge, IconButton, ThemeToggle } from "../atoms";
import { Card, CardContent, CardHeader } from "../molecules";

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
      <aside className="w-64 bg-sidebar border border-border flex flex-col m-4 rounded-4xl relative">

        <IconButton variant="ghost" size="sm" icon={<PanelLeft />} aria-label="Open menu" className="absolute top-4 right-4" />

        <nav className="flex-1 p-4 overflow-y-auto mt-10">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200
                      ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                          : "text-sidebar-foreground-muted hover:bg-sidebar-accent/30"
                      }
                    `}
                  >
                    <div
                      className={`rounded-lg p-1 ${
                        isActive
                          ? "bg-sidebar-foreground text-sidebar"
                          : "bg-sidebar-accent-foreground text-background"
                      } `}
                    >
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border flex flex-col gap-4 items-center">
          <Badge color="success" variant="outline" size="sm">
            Offline Mode
          </Badge>

          <Card size="sm">
            <CardHeader>Library Stats</CardHeader>
            <CardContent className="space-y-1 text-xs text-muted-foreground">
              <p>Total Tracks: 1,247</p>
              <p>Total Duration: 82h 15m</p>
              <p>Genres: 24</p>
            </CardContent>
          </Card>

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
