'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { ChevronLeft, ChevronRight, Clock, User, MapPin, X } from 'lucide-react';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function pad(n) { return String(n).padStart(2, '0'); }

export default function AdminCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-12
  const [dayCounts, setDayCounts] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  function load() {
    api.get(`/admin/calendar/month?year=${year}&month=${month}`).then((data) => {
      const map = {};
      data.days.forEach((d) => {
        const dateKey = new Date(d.appointment_date).toISOString().split('T')[0];
        map[dateKey] = d;
      });
      setDayCounts(map);
    });
  }

  useEffect(() => { load(); }, [year, month]);

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(year - 1); } else setMonth(month - 1);
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(year + 1); } else setMonth(month + 1);
  }

  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Calendar" />
          <main className="p-8">
            <div className="bg-white rounded-xl border border-navy/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-navy text-lg">{MONTH_NAMES[month - 1]} {year}</h2>
                <div className="flex items-center gap-2">
                  <button onClick={prevMonth} className="w-9 h-9 rounded-lg border border-navy/10 flex items-center justify-center hover:bg-navy/5">
                    <ChevronLeft size={18} className="text-navy" />
                  </button>
                  <button onClick={nextMonth} className="w-9 h-9 rounded-lg border border-navy/10 flex items-center justify-center hover:bg-navy/5">
                    <ChevronRight size={18} className="text-navy" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="text-center text-navy/40 text-xs font-bold py-2">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {cells.map((d, i) => {
                  if (!d) return <div key={i} />;
                  const dateKey = `${year}-${pad(month)}-${pad(d)}`;
                  const info = dayCounts[dateKey];
                  const isToday = dateKey === today.toISOString().split('T')[0];
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(dateKey)}
                      className={`aspect-square rounded-lg border p-2 flex flex-col items-start justify-between text-left transition-colors ${
                        isToday ? 'border-gold bg-gold/5' : 'border-navy/10 hover:border-navy/30'
                      }`}
                    >
                      <span className={`text-sm font-semibold ${isToday ? 'text-gold-dark' : 'text-navy'}`}>{d}</span>
                      {info && (
                        <span className="text-xs font-bold bg-navy text-white rounded-full px-2 py-0.5">
                          {info.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>

      {selectedDate && <DayDetailModal date={selectedDate} onClose={() => setSelectedDate(null)} />}
    </AdminGuard>
  );
}

function DayDetailModal({ date, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/admin/calendar/day?date=${date}`).then(setData);
  }, [date]);

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-navy/40 hover:text-navy"><X size={20} /></button>
        <h2 className="font-bold text-xl text-navy mb-6">{new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2>

        {!data && <p className="text-navy/40">Loading...</p>}
        {data && data.appointments.length === 0 && <p className="text-navy/40">No appointments on this day.</p>}

        <div className="space-y-3">
          {data?.appointments.map((a) => (
            <div key={a.id} className="border border-navy/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-navy">{a.service_name}</p>
                <span className="text-xs font-bold text-gold-dark bg-gold/10 px-2 py-1 rounded">{a.time_slot}</span>
              </div>
              <div className="text-navy/60 text-sm space-y-1">
                <p className="flex items-center gap-2"><User size={14} /> {a.customer_name} · {a.customer_phone}</p>
                <p className="flex items-center gap-2"><MapPin size={14} /> {a.property_address}</p>
                <p className="flex items-center gap-2"><Clock size={14} /> {a.assessor_name || 'Unassigned'} · {a.status.replace('_', ' ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}