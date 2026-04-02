import { Link, useLocation } from "react-router-dom";
import { Home, Plus, Users, MessageSquare, FileText, Bell, UserCheck, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmployerLayoutProps {
  children: React.ReactNode;
  title?: string;
  companyName?: string;
}

export function EmployerLayout({ children, title, companyName = "HZLR Business" }: EmployerLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/employer/home" },
    { icon: Plus, label: "Post Job", href: "/employer/post" },
    { icon: Users, label: "Postings", href: "/employer/postings" },
    { icon: ClipboardCheck, label: "Attendance", href: "/employer/attendance" },
    { icon: UserCheck, label: "Employees", href: "/employer/employees" },
    { icon: MessageSquare, label: "Messages", href: "/employer/messages" },
    { icon: FileText, label: "Invoices", href: "/employer/invoices" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Navigation */}
      <header className="bg-primary text-primary-foreground px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-black tracking-tight">
              HZLR<span className="text-seafoam">.</span>
            </Link>
            
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href || 
                  (item.href === "/employer/home" && currentPath === "/employer");
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary-foreground/10 text-primary-foreground" 
                        : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5"
                    )}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/employer/notifications" className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full" />
            </Link>
            <Button variant="hero" size="sm" asChild className="hidden md:flex">
              <Link to="/employer/post">
                <Plus size={16} />
                Post Job
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {title && (
        <div className="border-b border-border bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 py-2 flex items-center justify-around z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href || 
            (item.href === "/employer/home" && currentPath === "/employer");
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-2 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={18} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
