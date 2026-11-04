'use client';

import { useEffect, useState } from 'react';
import AssessorShell from '@/components/assessor/AssessorShell';
import { api } from '@/lib/api';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const pad = (n) => String(n).padStart(2, '0');
const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function weekStart(d) {
  const x = new Date(d);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

export default function AssessorCalendarPage() {
  const now = new Date();
  const [view, setView] = useState('month');
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-11
  const [selected, setSelected] = useState(fmt(now));
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const from = fmt(addDays(first, -7));
    const to = fmt(addDays(last, 7));
    api.get(`/assessor/calendar?from=${from}&to=${to}`).then((d) => setJobs(d.jobs));
  }, [year, month]);

  const byDate = {};
  jobs.forEach((j) => { (byDate[j.appointment_date] ||= []).push(j); });

  function prev() {
    if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1);
  }
  function next() {
    if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1);
  }

  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayKey = fmt(now);
  const selectedJobs = byDate[selected] || [];

  const wkStart = weekStart(new Date(selected + 'T00:00:00'));
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(wkStart, i));

  const listJobs = jobs.filter((j) => j.appointment_date.startsWith(`${year}-${pad(month + 1)}`));

  return (
    <AssessorShell title="Calendar">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-navy">Calendar</h2>
          <p className="text-navy/50 text-sm">View your upcoming appointments and manage your schedule.</p>
        </div>
        <div className="flex bg-white border border-navy/10 rounded-lg overflow-hidden">
          {['list', 'week', 'month'].map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-5 py-2 text-sm font-semibold capitalize ${view === v ? 'bg-navy text-white' : 'text-navy/60 hover:bg-navy/5'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <button onClick={prev} className="w-9 h-9 rounded-lg border border-navy/10 bg-white flex items-center justify-center hover:bg-navy/5"><ChevronLeft size={18} className="text-navy" /></button>
        <h3 className="font-bold text-navy text-lg w-48 text-center">{MONTHS[month]} {year}</h3>
        <button onClick={next} className="w-9 h-9 rounded-lg border border-navy/10 bg-white flex items-center justify-center hover:bg-navy/5"><ChevronRight size={18} className="text-navy" /></button>
      </div>

      {view === 'month' && (
        <div className="grid lg:grid-cols-[1.7fr_1fr] gap-6">
          <div className="bg-white rounded-xl border border-navy/5 p-4 sm:p-6">
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {DAYS.map((d) => <div key={d} className="text-center text-navy/40 text-xs font-bold py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((d, i) => {
                if (!d) return <div key={i} />;
                const key = `${year}-${pad(month + 1)}-${pad(d)}`;
                const count = (byDate[key] || []).length;
                const isSel = key === selected;
                const isToday = key === todayKey;
                return (
                  <button
                    key={i} onClick={() => setSelected(key)}
                    className={`aspect-square rounded-lg border p-1.5 flex flex-col items-center justify-between transition-colors ${
                      isSel ? 'bg-navy border-navy' : isToday ? 'border-gold bg-gold/5' : 'border-navy/10 hover:border-navy/30'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${isSel ? 'text-white' : 'text-navy'}`}>{d}</span>
                    {count > 0 && (
                      <span className={`text-[11px] font-bold rounded-full px-2 ${isSel ? 'bg-gold text-navy' : 'bg-navy text-white'}`}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <DayPanel date={selected} jobs={selectedJobs} />
        </div>
      )}

      {view === 'week' && (
        <div className="bg-white rounded-xl border border-navy/5 p-4 sm:p-6 overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[760px]">
            {weekDays.map((d) => {
              const key = fmt(d);
              const dayJobs = byDate[key] || [];
              return (
                <div key={key} className={`rounded-lg border p-3 min-h-[200px] ${key === todayKey ? 'border-gold bg-gold/5' : 'border-navy/10'}`}>
                  <p className="text-navy/40 text-xs font-bold">{DAYS[(d.getDay() + 6) % 7]}</p>
                  <p className="text-navy font-bold mb-3">{d.getDate()}</p>
                  <div className="space-y-2">
                    {dayJobs.map((j) => (
                      <div key={j.id} className="bg-navy/5 rounded p-2">
                        <p className="text-navy text-xs font-bold">{j.time_slot}</p>
                        <p className="text-navy/60 text-[11px] truncate">{j.service_code} · {j.customer_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="bg-white rounded-xl border border-navy/5 divide-y divide-navy/5">
          {listJobs.length === 0 && <p className="text-navy/40 text-sm p-6">No appointments this month.</p>}
          {listJobs.map((j) => (
            <div key={j.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-32 shrink-0">
                <p className="text-navy font-bold text-sm">{new Date(j.appointment_date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                <p className="text-navy/50 text-xs">{j.time_slot}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-navy font-semibold text-sm">{j.service_name}</p>
                <p className="text-navy/50 text-xs truncate">{j.property_address}</p>
              </div>
              <StatusBadge status={j.status} />
            </div>
          ))}
        </div>
      )}
    </AssessorShell>
  );
}

function DayPanel({ date, jobs }) {
  return (
    <div className="bg-white rounded-xl border border-navy/5 p-6 self-start">
      <h3 className="font-bold text-navy mb-4">
        {new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </h3>
      {jobs.length === 0 && <p className="text-navy/40 text-sm">No appointments on this day.</p>}
      <div className="space-y-3">
        {jobs.map((j) => (
          <div key={j.id} className="border border-navy/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-navy font-bold text-sm flex items-center gap-1.5"><Clock size={13} /> {j.time_slot}</p>
              <StatusBadge status={j.status} />
            </div>
            <p className="text-navy/70 text-sm">{j.service_name}</p>
            <p className="text-navy/40 text-xs flex items-center gap-1 mt-1"><MapPin size={11} /> {j.property_address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    assigned: 'bg-emerald-100 text-emerald-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
  };
  const labels = { assigned: 'Confirmed', in_progress: 'In Progress', completed: 'Completed' };
  return (
    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {labels[status] || status.replace('_', ' ')}
    </span>
  );
}