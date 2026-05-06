import { useEffect, useState } from 'react';
import { BriefcaseMedical, FileStack, HeartPulse, Inbox, LayoutDashboard, LogOut, Menu, NotebookPen, ScrollText, Settings, X } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '@/features/auth/api/auth-api';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { showToast } from '@/shared/feedback/toast';
import { useAppShellStore } from '@/state/use-app-shell-store';
import { useSessionStore } from '@/state/session-store';
import { cn } from '@/lib/utils';

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/medical-records', label: 'Rekam Medis', icon: NotebookPen },
  { to: '/ems-services', label: 'EMS Services', icon: BriefcaseMedical },
  { to: '/pharmacy-recap', label: 'Rekap Farmasi', icon: FileStack },
  { to: '/secretary', label: 'Secretary', icon: ScrollText },
  { to: '/account', label: 'Setting Akun', icon: Settings },
];

export function AppShellLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const mutation = useLogoutMutation();
  const clearSession = useSessionStore((state) => state.clearSession);
  const user = useSessionStore((state) => state.user);
  const { sidebarOpen, toggleSidebar, closeSidebar } = useAppShellStore();
  const [now, setNow] = useState(() => new Date());
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  async function handleLogout() {
    await mutation.mutateAsync();
    clearSession();
    showToast('success', 'Anda telah logout.');
    navigate('/login');
  }

  return (
    <div className="h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[rgba(17,24,39,0.92)] backdrop-blur">
        <div className="mx-auto flex h-15 max-w-[1600px] items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[var(--color-accent)]">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">Medical Service</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{pageTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-right">
            <div>
              <p className="text-[11px] font-semibold text-white">{formatWibDate(now)}</p>
              <p className="mt-0.5 text-[11px] text-white/70">{formatWibTime(now)} WIB</p>
            </div>
            <div className="grid h-8 w-8 place-items-center rounded-xl border border-white/15 bg-white/5 text-white/80">
              <Inbox className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto h-screen max-w-[1600px] px-4 pt-[76px]">
        {sidebarOpen ? <button type="button" className="fixed inset-0 z-20 bg-slate-950/34 backdrop-blur-[2px]" onClick={closeSidebar} /> : null}

        <aside
          className={cn(
            'fixed bottom-4 left-4 top-[76px] z-30 w-[286px] -translate-x-[120%] transition duration-300',
            sidebarOpen && 'translate-x-0',
          )}
        >
          <Card className="flex h-full flex-col overflow-hidden bg-[linear-gradient(180deg,#111827,#1f2937)] p-0 text-white">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">{user?.fullName ?? 'Michael Moore'}</p>
                <p className="mt-1 text-sm font-semibold text-white">{user?.division ?? 'Medis Roxwood'}</p>
                <p className="mt-1 text-[11px] text-white/65">{user?.position ?? 'Kepala Unit'} · {user?.role ?? 'Admin'} · Batch 04</p>
                <p className="mt-1 text-[11px] text-white/50">Lama bergabung 6 tahun</p>
              </div>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-xl border border-white/12 bg-white/6 text-white transition hover:bg-white/10"
                onClick={closeSidebar}
                aria-label="Tutup sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="medical-scrollbar flex-1 space-y-2 overflow-y-auto px-3 py-4">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                        isActive ? 'bg-white/14 text-white' : 'text-white/75 hover:bg-white/8 hover:text-white',
                      )
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
            <div className="border-t border-white/10 p-3">
              <Button type="button" variant="ghost" className="w-full justify-start border-white/10 text-white hover:border-white/15 hover:bg-white/10 hover:text-white" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </Card>
        </aside>

        <main className="h-[calc(100vh-92px)] overflow-hidden">
          <div className="medical-scrollbar h-full overflow-y-auto pr-1">
            <div className="min-w-0 space-y-6 pb-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function formatWibDate(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

function formatWibTime(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

function getPageTitle(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return 'Dashboard';
  }

  if (pathname === '/medical-records') {
    return 'Rekap Rekam Medis';
  }

  if (pathname.startsWith('/medical-records/') && pathname.endsWith('/edit')) {
    return 'Edit Rekam Medis';
  }

  if (pathname === '/medical-records/new') {
    return 'Tambah Rekam Medis';
  }

  const dictionary: Record<string, string> = {
    account: 'Setting Akun',
    'ems-services': 'EMS Services',
    'pharmacy-recap': 'Rekap Farmasi',
    secretary: 'Secretary',
  };

  return dictionary[segments[0]] ?? 'Medical Service';
}
