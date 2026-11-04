'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Bell } from 'lucide-react';
import AssessorSidebar from './AssessorSidebar';
import { getAssessorUser } from '@/lib/auth';

export default function AssessorShell({ title, children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('assessor_token');
    if (!token) {
      router.replace('/assessor/login');
      return;
    }
    setUser(getAssessorUser());
    setChecked(true);
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-navy/50 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <AssessorSidebar />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/60" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <AssessorSidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
          <button onClick={() => setDrawerOpen(false)} className="absolute top-4 right-4 text-white">
            <X size={24} />
          </button>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-navy/10 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-navy" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <h1 className="font-sans text-lg sm:text-xl font-bold text-navy">{title}</h1>
          </div>

          <div className="flex items-center gap-5">
            <Bell size={20} className="text-navy/50" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-sm">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-navy text-sm font-semibold leading-none">{user?.name || 'Assessor'}</p>
                <p className="text-navy/40 text-xs leading-none mt-0.5">Assessor</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}