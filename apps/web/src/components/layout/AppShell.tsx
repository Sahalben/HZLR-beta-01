import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell — Dual-tab vertical selector
 * HZLR tab: seafoam (gig labor)
 * Store tab: amber (commerce)
 *
 * Renders a persistent top strip on every authenticated page.
 * Individual layouts (WorkerLayout, EmployerLayout, StoreLayout) sit inside.
 */
export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const { user } = useAuth();

  // Determine active vertical from path
  const isStoreSide =
    location.pathname.startsWith('/store') ||
    location.pathname.startsWith('/merchant') ||
    location.pathname.startsWith('/worker/delivery');

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Vertical tab switcher pill */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-2 flex items-center gap-1">
          {/* HZLR Tab */}
          <Link
            to="/worker/home"
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300',
              !isStoreSide
                ? 'bg-foreground text-background shadow-md scale-[1.02]'
                : 'text-muted-foreground hover:bg-muted/60'
            )}
            id="tab-hzlr"
          >
            <Briefcase size={16} />
            <span className="tracking-wide">HZLR</span>
            {!isStoreSide && (
              <span className="ml-1 text-[10px] font-black tracking-widest uppercase text-seafoam">GIG</span>
            )}
          </Link>

          {/* Store Tab */}
          <Link
            to="/store"
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300',
              isStoreSide
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-[1.02]'
                : 'text-muted-foreground hover:bg-muted/60'
            )}
            id="tab-store"
          >
            <ShoppingBag size={16} />
            <span className="tracking-wide">Store</span>
            {isStoreSide && (
              <span className="ml-1 text-[10px] font-black tracking-widest uppercase text-white/80">QUICK</span>
            )}
          </Link>
        </div>
      </div>

      {/* Page content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default AppShell;
