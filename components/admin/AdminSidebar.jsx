'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Calendar, Users, FileText, CreditCard, Tag,
  UserCog, BarChart3, CalendarDays, Settings, ShieldCheck, LogOut,UserPlus,Wallet,FileCheck,
} from 'lucide-react';
import { clearAdminSession } from '@/lib/auth';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', Icon: LayoutDashboard },
  { label: 'Appointments', href: '/admin/appointments', Icon: Calendar },
  { label: 'Customers', href: '/admin/customers', Icon: Users },
  { label: 'Invoices', href: '/admin/invoices', Icon: FileText },
  { label: 'Payments', href: '/admin/payments', Icon: CreditCard },
  { label: 'Services & Pricing', href: '/admin/services', Icon: Tag },
  { label: 'Assessors', href: '/admin/assessors', Icon: UserCog },
  { label: 'Assessor Requests', href: '/admin/assessor-requests', Icon: UserPlus },
  { label: 'Assessor Payouts', href: '/admin/payouts', Icon: Wallet },
  { label: 'Assessor Reports', href: '/admin/job-reports', Icon: FileCheck },
  { label: 'Reports', href: '/admin/reports', Icon: BarChart3 },
  { label: 'Calendar', href: '/admin/calendar', Icon: CalendarDays },
  { label: 'Settings', href: '/admin/settings', Icon: Settings },
  { label: 'Admin Users', href: '/admin/users', Icon: ShieldCheck },
  
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearAdminSession();
    router.push('/admin/login');
  }

  return (
    <aside className="w-64 shrink-0 bg-navy min-h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
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
        {navItems.map(({ label, href, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                active ? 'bg-gold/10 text-gold border-r-2 border-gold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 border-2 border-gold text-gold font-bold text-sm py-2.5 rounded hover:bg-gold hover:text-navy transition-colors duration-200"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}