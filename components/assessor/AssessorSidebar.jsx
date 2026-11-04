'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Calendar, Briefcase, CalendarDays, FileText,
  Wallet, User, LogOut, ClipboardList,
} from 'lucide-react';
import { clearAssessorSession } from '@/lib/auth';
import { api } from '@/lib/api';

const navItems = [
  { label: 'Dashboard', href: '/assessor/dashboard', Icon: LayoutDashboard },
  { label: 'My Appointments', href: '/assessor/appointments', Icon: ClipboardList },
  { label: 'Job Board', href: '/assessor/job-board', Icon: Briefcase, badgeKey: 'offers' },
  { label: 'Calendar', href: '/assessor/calendar', Icon: CalendarDays },
  { label: 'My Reports', href: '/assessor/reports', Icon: FileText },
  { label: 'Earnings', href: '/assessor/earnings', Icon: Wallet },
  { label: 'My Profile', href: '/assessor/profile', Icon: User },
];

export default function AssessorSidebar({ onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const [offerCount, setOfferCount] = useState(0);

  useEffect(() => {
    api.get('/assessor/job-offers')
      .then((data) => setOfferCount(data.offers.length))
      .catch(() => {});
  }, [pathname]);

  function handleLogout() {
    clearAssessorSession();
    router.push('/assessor/login');
  }

  return (
    <aside className="w-64 shrink-0 bg-navy h-full flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/assessor/dashboard" onClick={onNavigate} className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <path d="M4 36V16L12 10V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M12 36V6L20 2V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M20 36V10L28 4V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M28 36V14L36 8V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
            <line x1="2" y1="36" x2="38" y2="36" stroke="#D69C4D" strokeWidth="2.2" />
          </svg>
          <span>
            <span className="block text-white text-sm font-bold tracking-wide leading-none">MANCHESTER</span>
            <span className="block text-gold text-xs font-semibold tracking-[0.2em] leading-none mt-0.5">CERTIFY</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map(({ label, href, Icon, badgeKey }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          const badge = badgeKey === 'offers' ? offerCount : 0;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                active ? 'bg-gold/10 text-gold border-r-2 border-gold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="bg-gold text-navy text-[11px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 border-2 border-gold text-gold font-bold text-sm py-2.5 rounded hover:bg-gold hover:text-navy transition-colors duration-200"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
}