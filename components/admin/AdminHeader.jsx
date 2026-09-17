'use client';

import { Bell, Search, ChevronDown } from 'lucide-react';
import { getAdminUser } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function AdminHeader({ title }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getAdminUser());
  }, []);

  return (
    <header className="bg-white border-b border-navy/10 px-8 py-4 flex items-center justify-between">
      <h1 className="font-sans text-xl font-bold text-navy">{title}</h1>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 bg-navy/5 rounded-lg px-4 py-2 w-72">
          <Search size={16} className="text-navy/40" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-navy/40"
          />
        </div>

        <button className="relative text-navy/60 hover:text-navy">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-navy text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-sm">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-navy text-sm font-semibold leading-none">{user?.name || 'Admin'}</p>
            <p className="text-navy/40 text-xs leading-none mt-0.5">Administrator</p>
          </div>
          <ChevronDown size={16} className="text-navy/40" />
        </div>
      </div>
    </header>
  );
}