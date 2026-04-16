import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, MessageSquare, User, Bell, ClipboardCheck, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface WorkerLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
}

export function WorkerLayout({ children, title, showHeader = true }: WorkerLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { signOut } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", href: "/worker/home" },
    { icon: Search, label: "Search", href: "/worker/search" },
    { icon: ClipboardCheck, label: "Attendance", href: "/worker/attendance" },
    { icon: MessageSquare, label: "Messages", href: "/worker/messages" },
    { icon: User, label: "Profile", href: "/worker/profile" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {showHeader && (
        <header className="bg-primary text-primary-foreground px-4 pt-8 pb-4 flex items-center justify-between">
          <Link to="/worker/home" className="text-xl font-black tracking-tight">
            HZLR<span className="text-seafoam">.</span>
          </Link>
          <div className="flex items-center gap-3">
            {title && <span className="text-sm font-medium">{title}</span>}
            <Link to="/worker/notifications" className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full" />
            </Link>
            <Button variant="ghost" size="icon" onClick={() => { signOut(); navigate('/login'); }} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10" title="Sign Out">
                 <LogOut size={18} />
            </Button>
          </div>
        </header>
      )}

      {children}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 flex items-center justify-around z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href || 
            (item.href === "/worker/home" && currentPath === "/worker");
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={20} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
