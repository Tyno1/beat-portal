import { PanelLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import useResize from "../../hooks/useResize";
import { Badge, IconButton, ThemeToggle } from "../atoms";
import { Card, CardContent } from "../molecules";

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
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [mode, _setMode] = useState<"online" | "offline">("online");
  const { breakpoint, size} = useResize();
  console.log(breakpoint, size);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (breakpoint === "md" || size < 1045) {
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(true);
    }
  }, [breakpoint, size]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <aside
        className={`bg-sidebar border border-border flex flex-col m-4 rounded-4xl ${
          isMenuOpen ? "w-64" : "w-20"
        }`}
      >
        <nav className="flex-1 p-4">
          <ul className={`${isMenuOpen ? "space-y-0" : "space-y-2"}`}>
            <li
              className={`mb-4 flex ${
                isMenuOpen ? "justify-end" : "justify-center"
              }`}
            >
              <IconButton
                onClick={handleToggleMenu}
                variant="plain"
                color="secondary"
                size="sm"
                icon={<PanelLeft />}
                aria-label="Open menu"
                className="text-sidebar-foreground hover:text-sidebar-accent"
              />
            </li>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              if (isMenuOpen)
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200
                      ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/30"
                      }
                    `}
                    >
                      <div
                        className={`rounded-lg p-1 ${
                          isActive
                            ? "bg-sidebar-accent-foreground text-sidebar-foreground-muted"
                            : "bg-sidebar-foreground text-background"
                        } `}
                      >
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              else
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "bg-sidebar-foreground-muted text-sidebar"
                      }`}
                    >
                      {item.icon}
                    </Link>
                  </li>
                );
            })}
          </ul>
        </nav>

        <div className="p-4 w-full border-t border-border flex flex-col gap-2 items-center">
          {isMenuOpen && (
            <Card
              size="xs"
              className="bg-background"
              variant="flat"
              header={{ title: "Library Stats" }}
            >
              <CardContent className="text-xs text-muted-foreground">
                <p>Total Tracks: 1,247</p>
                <p>Total Duration: 82h 15m</p>
                <p>Genres: 24</p>
              </CardContent>
            </Card>
          )}
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <Badge
              color={mode === "online" ? "success" : "destructive"}
              variant="outline"
              size="sm"
            >
              {mode === "online" ? "Online" : "Offline"}
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden ">
        <Outlet />
      </main>
    </div>
  );
}
