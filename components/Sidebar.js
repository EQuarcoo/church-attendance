'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const links = [
  { href: '/', label: 'Overview' },
  { href: '/register', label: 'Register' },
  { href: '/members', label: 'Members' },
  { href: '/checkin', label: 'Check In' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/followup', label: 'Follow-Up' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 md:fixed md:inset-y-0 md:left-0 z-20 md:p-4">
      <div className="h-full flex md:flex-col bg-[#0B0E14]/90 backdrop-blur-xl border border-white/10 md:rounded-2xl overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-2 border-b border-white/10">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-400 to-green-600" />
          <span className="font-semibold text-white">Shepherd</span>
        </div>

        <nav className="flex md:flex-col flex-1 overflow-x-auto md:overflow-visible px-2 py-2 md:py-3 gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-green-500/15 text-green-300 border border-green-500/30'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-3 border-t border-white/10 flex flex-col gap-1">
          <ThemeToggle />
          <Link href="/login" className="px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white">
            Staff Login
          </Link>
        </div>
      </div>
    </aside>
  );
}