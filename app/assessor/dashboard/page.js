'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AssessorShell from '@/components/assessor/AssessorShell';
import { api } from '@/lib/api';
import { getAssessorUser } from '@/lib/auth';
import { Calendar, CalendarCheck, FileText, Wallet, MapPin, Navigation, ArrowRight, Briefcase } from 'lucide-react';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function mapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default function AssessorDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const user = getAssessorUser();
    setName(user?.name?.split(' ')[0] || '');
    api.get('/assessor/dashboard').then(setData).catch((err) => setError(err.message));
  }, []);

  return (
    <AssessorShell title="Dashboard">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-navy">{greeting()}, {name}</h2>
          <p className="text-navy/50 text-sm">Here&apos;s what&apos;s happening with your Manchester Certify work today.</p>
        </div>
        <Link href="/assessor/job-board" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm px-5 py-3 rounded-lg hover:bg-gold-light transition-colors">
          <Briefcase size={16} /> View Available Jobs
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!data && !error && <p className="text-navy/40">Loading...</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            <StatCard icon={Calendar} label="Today" value={data.stats.todayCount} sub="Appointments" />
            <StatCard icon={CalendarCheck} label="This Week" value={data.stats.weekCount} sub="Appointments" />
            <StatCard icon={FileText} label="Pending Reports" value={data.stats.pendingReports} sub="Reports" />
            <StatCard icon={Wallet} label="Earnings (This Month)" value={`£${data.stats.earningsThisMonth.toLocaleString()}`} sub="Completed jobs" />
          </div>

          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
            {/* Today's appointments */}
            <div className="bg-white rounded-xl border border-navy/5">
              <div className="flex items-center justify-between p-6 border-b border-navy/5">
                <div>
                  <h3 className="font-bold text-navy">Today&apos;s Appointments</h3>
                  <p className="text-navy/40 text-xs mt-0.5">{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <Link href="/assessor/calendar" className="text-xs font-semibold text-navy/60 hover:text-navy flex items-center gap-1">
                  View Calendar <ArrowRight size={12} />
                </Link>
              </div>

              {data.todayAppointments.length === 0 && (
                <p className="text-navy/40 text-sm p-6">No appointments scheduled for today.</p>
              )}

              <div className="divide-y divide-navy/5">
                {data.todayAppointments.map((a) => (
                  <div key={a.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <p className="text-navy font-bold w-16 shrink-0">{a.time_slot}</p>
                    <div className="flex-1 min-w-0">
                      <p className="text-navy font-semibold text-sm truncate">{a.property_address}</p>
                      <p className="text-navy/40 text-xs">{a.service_name}</p>
                    </div>
                    <StatusBadge status={a.status} />
                    <p className="text-navy font-semibold text-sm w-12">£{a.price}</p>
                    <div className="flex gap-2">
                      <Link href="/assessor/appointments" className="text-xs font-semibold border border-navy/15 rounded px-3 py-2 hover:border-navy/40">
                        View Job
                      </Link>
                      <a href={mapsUrl(a.property_address)} target="_blank" rel="noreferrer" className="text-xs font-semibold border border-navy/15 rounded px-3 py-2 hover:border-navy/40 flex items-center gap-1">
                        <Navigation size={12} /> Navigate
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available jobs widget */}
            <div className="bg-white rounded-xl border border-navy/5">
              <div className="flex items-center justify-between p-6 border-b border-navy/5">
                <h3 className="font-bold text-navy">Available Jobs Near You</h3>
                <Link href="/assessor/job-board" className="text-xs font-semibold text-navy/60 hover:text-navy flex items-center gap-1">
                  View Job Board <ArrowRight size={12} />
                </Link>
              </div>

              {data.availableOffers.length === 0 && (
                <p className="text-navy/40 text-sm p-6">No jobs available right now.</p>
              )}

              <div className="divide-y divide-navy/5">
                {data.availableOffers.map((o) => (
                  <div key={o.offer_id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-navy font-bold text-sm">{o.service_code}</p>
                        <p className="text-navy/50 text-xs truncate flex items-center gap-1"><MapPin size={11} /> {o.property_address}</p>
                        <p className="text-navy/40 text-xs mt-1">{new Date(o.appointment_date).toLocaleDateString('en-GB')} · {o.time_slot}</p>
                        <p className="text-gold-dark font-bold text-sm mt-1">£{o.price}</p>
                      </div>
                      <Link href={`/assessor/job-board/${o.offer_id}`} className="text-xs font-bold bg-gold text-navy rounded px-4 py-2 hover:bg-gold-light shrink-0">
                        Accept
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AssessorShell>
  );
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-navy/5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className="text-navy/60" />
        <p className="text-navy/50 text-xs font-medium">{label}</p>
      </div>
      <p className="text-3xl font-extrabold text-navy">{value}</p>
      <p className="text-navy/40 text-xs mt-1">{sub}</p>
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
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {labels[status] || status.replace('_', ' ')}
    </span>
  );
}