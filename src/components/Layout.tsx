import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Search, BookOpen, LayoutDashboard, User } from 'lucide-react';
import TutorFab from './TutorFab';

const navItems = [
  { to: '/', icon: Search, label: '查词', exact: true },
  { to: '/wordbank', icon: BookOpen, label: '词库' },
  { to: '/learn', icon: LayoutDashboard, label: '学习' },
  { to: '/profile', icon: User, label: '我的' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface-secondary pb-20">
      {/* Minimal top bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-50 px-4 py-2">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-1.5">
            <span className="text-xl">🇫🇷</span>
            <span className="text-base font-bold text-[var(--color-primary)]">FrenchFlow</span>
          </NavLink>
          <span className="text-[10px] text-gray-400">随身法语助手</span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-4">
        <Outlet />
      </main>

      {/* AI Tutor floating button */}
      <TutorFab />

      {/* Bottom navigation — 4 tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-100">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5">
          {navItems.map(({ to, icon: Icon, label, exact }) => {
            const isActive = exact
              ? location.pathname === '/'
              : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors min-w-0 relative ${
                  isActive ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium leading-tight">{label}</span>
                {isActive && (
                  <div className="absolute -top-1.5 w-8 h-0.5 bg-[var(--color-primary)] rounded-full" />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
