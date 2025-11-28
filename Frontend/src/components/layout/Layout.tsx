import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, MessageSquareWarning, Menu, Settings, LogOut, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';
import { DashboardProvider } from '@/context/DashboardContext';
import { SidebarEpidemicControl } from '@/components/dashboard/SidebarEpidemicControl';
import { SidebarResourceTrend } from '@/components/dashboard/SidebarResourceTrend';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Action Hub', path: '/actions', icon: Activity },
  { label: 'Advisory Console', path: '/advisory', icon: MessageSquareWarning },
  { label: 'Raw Data', path: '/raw-data', icon: Database },
];

export function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full bg-[#09090b] text-white border-r border-[#27272a] overflow-y-auto custom-scrollbar">
      <div className="p-6 border-b border-[#27272a] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight font-grotesk">SurgeGuard</h1>
            <p className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase font-mono">Autonomous Ops</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-6">
        <div className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden font-grotesk",
                  isActive
                    ? "bg-white/5 text-white shadow-sm border border-white/10"
                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                )
              }
              onClick={() => setIsMobileOpen(false)}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-white/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-white")} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="h-px bg-zinc-800" />
        
        <SidebarEpidemicControl />
        
        <div className="h-px bg-zinc-800" />
        
        <SidebarResourceTrend />
      </nav>

      <div className="p-4 border-t border-[#27272a] space-y-4 shrink-0">
        <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-[#27272a] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 blur-2xl rounded-full -mr-10 -mt-10" />
          <p className="text-xs text-zinc-500 mb-1 font-mono uppercase tracking-wider">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-400 font-mono">Online</span>
          </div>
          {import.meta.env.VITE_DEMO_MODE === 'true' && (
            <div className="mt-2 flex items-center gap-2 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide font-mono">Demo Mode</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between px-2">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardProvider>
      <div className="flex h-screen bg-[#09090b] text-[#ededed] font-grotesk selection:bg-emerald-500/30">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-72 h-full shadow-2xl z-50">
          <NavContent />
        </div>

        {/* Mobile Sidebar */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="bg-black/80 backdrop-blur border-[#27272a]">
                <Menu className="w-5 h-5 text-zinc-400" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 border-r-0">
              <NavContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-[#09090b] relative">
          <div className="absolute inset-0 glass-grit pointer-events-none mix-blend-overlay z-0" />
          <div className="relative z-10 min-h-full">
            <Outlet />
          </div>
        </main>
        <Toaster />
      </div>
    </DashboardProvider>
  );
}
