'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getAssessorUser, clearAssessorSession } from '@/lib/auth';
import { Calendar, CheckCircle2, Clock, LogOut, MapPin, Phone, User } from 'lucide-react';

export default function AssessorDashboardPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('assessor_token');
    if (!token) {
      router.replace('/assessor/login');
      return;
    }
    setUser(getAssessorUser());
    setChecked(true);
  }, [router]);

  useEffect(() => {
    if (!checked) return;
    api.get('/assessor/dashboard').then(setDashboard);
    loadJobs();
  }, [checked]);

  function loadJobs() {
    const params = filter ? `?status=${filter}` : '';
    api.get(`/assessor/appointments${params}`).then((data) => setJobs(data.jobs));
  }

  useEffect(() => { if (checked) loadJobs(); }, [filter]);

  async function markStatus(id, status) {
    await api.patch(`/assessor/appointments/${id}/status`, { status });
    loadJobs();
  }

  function handleLogout() {
    clearAssessorSession();
    router.push('/assessor/login');
  }

  if (!checked) return <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-navy/40">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="bg-navy px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-white font-bold">Welcome back, {user?.name}</p>
          <p className="text-white/50 text-xs">{user?.specialization || 'Assessor'}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 border-2 border-gold text-gold font-bold text-sm px-4 py-2 rounded hover:bg-gold hover:text-navy transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </header>

      <main className="p-8">
        {dashboard && (
          <div className="grid grid-cols-3 gap-5 mb-8">
            <StatCard icon={Calendar} label="Today's Jobs" value={dashboard.stats.todayJobs} />
            <StatCard icon={Clock} label="Upcoming Jobs" value={dashboard.stats.upcomingJobs} />
            <StatCard icon={CheckCircle2} label="Completed" value={dashboard.stats.completedJobs} />
          </div>
        )}

        {dashboard?.nextJob && (
          <div className="bg-navy rounded-xl p-6 mb-8 text-white">
            <p className="text-gold text-xs font-bold tracking-wide mb-2">NEXT JOB</p>
            <p className="font-bold text-lg">{dashboard.nextJob.service_name}</p>
            <p className="text-white/60 text-sm mt-1">{dashboard.nextJob.appointment_date} · {dashboard.nextJob.time_slot}</p>
            <p className="text-white/60 text-sm">{dashboard.nextJob.customer_name} — {dashboard.nextJob.property_address}</p>
          </div>
        )}

        <div className="flex gap-3 mb-5">
          {['', 'assigned', 'in_progress', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm font-semibold px-4 py-2 rounded-lg ${filter === s ? 'bg-navy text-white' : 'bg-white text-navy/60 border border-navy/10'}`}
            >
              {s === '' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {jobs.length === 0 && <p className="text-navy/40 text-sm">No jobs found.</p>}
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl p-6 border border-navy/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-navy">{job.service_name}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-navy/60 text-sm mt-2">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {job.appointment_date} · {job.time_slot}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {job.customer_name}</span>
                  <span className="flex items-center gap-1"><Phone size={14} /> {job.customer_phone}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.property_address}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {job.status !== 'in_progress' && job.status !== 'completed' && (
                  <button onClick={() => markStatus(job.id, 'in_progress')} className="text-xs font-semibold px-4 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">
                    Start Job
                  </button>
                )}
                {job.status !== 'completed' && (
                  <button onClick={() => markStatus(job.id, 'completed')} className="text-xs font-semibold px-4 py-2 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                    Mark Completed
                  </button>
                )}
                {job.status === 'completed' && (
                  <span className="text-xs font-semibold px-4 py-2 rounded bg-emerald-100 text-emerald-700">Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-navy/5">
      <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center mb-4">
        <Icon size={18} className="text-gold" />
      </div>
      <p className="text-2xl font-extrabold text-navy">{value}</p>
      <p className="text-navy/50 text-xs mt-1">{label}</p>
    </div>
  );
}