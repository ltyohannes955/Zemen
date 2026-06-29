'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '../../contexts/auth-context';
import { Calendar01Icon, GridIcon, Home01Icon, ListViewIcon, Logout01Icon, PlusSignIcon, Sun01Icon, Moon01Icon } from 'hugeicons-react';
import { NewTaskModal } from '../../components/NewTaskModal';
import { DatePill } from '../../components/DatePill';
import { useTheme } from '../theme-provider';

function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF5E6] dark:bg-[#0a0e17]">
        <div className="relative">
          <div className="absolute -inset-4 bg-emerald-500/20 blur-xl rounded-full"></div>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0B3D16] dark:border-emerald-400 relative z-10" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { href: '/app/today', label: 'Today', icon: Home01Icon },
    { href: '/app/upcoming', label: 'Upcoming', icon: Calendar01Icon },
    { href: '/app/month', label: 'Month', icon: GridIcon },
    { href: '/app/tasks', label: 'Tasks', icon: ListViewIcon },
  ];

  return (
    <div className="h-screen bg-[#FDF5E6] dark:bg-[#0a0e17] flex relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-emerald-200/40 dark:bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-orange-200/40 dark:bg-amber-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none"></div>

      {/* Premium Sidebar */}
      <aside className="w-[280px] flex-shrink-0 flex flex-col py-8 px-6 bg-white/40 dark:bg-[#111827]/60 backdrop-blur-2xl border-r border-white/60 dark:border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-10">
        
        {/* Logo Section */}
        <div className="mb-10 pl-2">
          <Link href="/app/today" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0B3D16] to-[#1a662e] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20 transform group-hover:scale-105 transition-transform duration-300">
              <Calendar01Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[28px] font-extrabold bg-gradient-to-br from-[#0B3D16] to-[#258a41] dark:from-emerald-300 dark:to-emerald-400 bg-clip-text text-transparent tracking-tight leading-none">
                Zemen
              </h1>
            </div>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-[13px] mt-3 leading-relaxed tracking-wide">
            Ethiopian &amp; Gregorian <br/> Calendar
          </p>
          <div className="mt-4">
            <DatePill />
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="w-full bg-gradient-to-b from-[#0B3D16] to-[#07290f] dark:from-emerald-600 dark:to-emerald-800 hover:from-[#0d4a1b] hover:to-[#093513] dark:hover:from-emerald-500 dark:hover:to-emerald-700 text-white rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2.5 font-semibold transition-all duration-300 mb-8 shadow-lg shadow-emerald-900/25 dark:shadow-emerald-900/50 hover:shadow-xl hover:shadow-emerald-900/40 hover:-translate-y-0.5 border border-white/10 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <PlusSignIcon className="w-5 h-5 relative z-10 transition-transform group-hover:rotate-90 duration-300" />
          <span className="relative z-10 tracking-wide">New Task</span>
        </button>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-4 px-4 py-3.5 text-[14.5px] font-semibold transition-all duration-300 relative overflow-hidden ${
                  active
                    ? 'text-[#0B3D16] dark:text-emerald-300 rounded-2xl bg-white/80 dark:bg-white/5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-emerald-500/5 border border-white/70 dark:border-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-white/5 rounded-2xl'
                }`}
              >
                {/* Active Indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#0B3D16] dark:bg-emerald-400 rounded-r-full shadow-[0_0_8px_rgba(11,61,22,0.4)] dark:shadow-[0_0_8px_rgba(52,211,153,0.3)]"></div>
                )}
                
                <Icon 
                  className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} 
                />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="pt-2 pb-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-white/5 rounded-2xl transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/60 dark:bg-white/5 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 border border-white/70 dark:border-white/10">
              {theme === 'dark' ? (
                <Sun01Icon className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon01Icon className="w-4 h-4 text-indigo-500" />
              )}
            </div>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        {/* User Profile Card */}
        <div className="pt-6">
          <div className="bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 backdrop-blur-md border border-white/70 dark:border-white/10 rounded-[24px] p-3 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-[#FDF4E5] dark:bg-emerald-900/30 flex items-center justify-center border-2 border-white dark:border-white/10 overflow-hidden shadow-sm">
                  {user.avatarUrl && user.avatarUrl.length > 0 ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#0B3D16] dark:text-emerald-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  )}
                </div>
                {/* Online Indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">
                  {user.name || 'Abbebe K.'}
                </p>
                <p className="text-[11px] font-bold tracking-wider text-[#0B3D16]/70 dark:text-emerald-400/70 uppercase">
                  Premium Plan
                </p>
              </div>
            </div>
            
            <button
              onClick={(e) => { e.stopPropagation(); logout(); router.push('/login'); }}
              className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300"
              title="Sign out"
            >
              <Logout01Icon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative z-10">
        {children}
      </main>

      <NewTaskModal 
        isOpen={isNewTaskModalOpen} 
        onClose={() => setIsNewTaskModalOpen(false)} 
      />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
