'use client';

import { useEffect, useState } from 'react';
import AssessorShell from '@/components/assessor/AssessorShell';
import { api } from '@/lib/api';
import { Search, Calendar, MapPin, Phone, Mail, Navigation, X, User } from 'lucide-react';

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All' },
];

function dateKey(d) {
  return String(d).slice(0, 10);
}

function timeValue(slot) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slot || '');
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') h += 12;
  return h * 60 + Number(m[2]);
}

function mapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default function AssessorAppointmentsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  function load() {
    setLoading(true);
    api.get('/assessor/appointments')
      .then((data) => setJobs(data.jobs))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const today = new Date().toISOString().slice(0, 10);

  const filtered = jobs
    .filter((j) => {
      if (j.status === 'cancelled') return false;
      if (tab === 'upcoming') return j.status !== 'completed' && dateKey(j.appointment_date) >= today;
      if (tab === 'completed') return j.status === 'completed';
      return true;
    })
    .filter((j) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return j.property_address.toLowerCase().includes(q) || j.customer_name.toLowerCase().includes(q) || j.service_name.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const d = dateKey(a.appointment_date).localeCompare(dateKey(b.appointment_date));
      const order = tab === 'completed' ? -1 : 1;
      return d !== 0 ? d * order : (timeValue(a.time_slot) - timeValue(b.time_slot)) * order;
    });

  return (
    <AssessorShell title="My Appointments">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-navy">My Appointments</h2>
        <p className="text-navy/50 text-sm">Jobs assigned to you.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key} onClick={() => setTab(t.key)}
              className={`text-sm font-semibold px-4 py-2 rounded-lg ${tab === t.key ? 'bg-navy text-white' : 'bg-white text-navy/60 border border-navy/10'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white border border-navy/10 rounded-lg px-4 py-2.5 w-full sm:w-72">
          <Search size={16} className="text-navy/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search address, customer..." className="text-sm outline-none w-full" />
        </div>
      </div>

      {loading && <p className="text-navy/40">Loading...</p>}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-navy/5 p-12 text-center">
          <Calendar size={32} className="text-navy/20 mx-auto mb-3" />
          <p className="text-navy/50 text-sm">No appointments found.</p>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((j) => (
          <div key={j.id} className="bg-white rounded-xl border border-navy/5 p-5 flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="w-28 shrink-0">
              <p className="text-navy font-bold">{new Date(j.appointment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
              <p className="text-navy/50 text-sm">{j.time_slot}</p>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gold-dark bg-gold/10 px-2 py-0.5 rounded">{j.service_code}</span>
                <p className="text-navy font-semibold text-sm">{j.service_name}</p>
              </div>
              <p className="text-navy/60 text-sm flex items-center gap-1.5 truncate"><MapPin size={13} /> {j.property_address}</p>
              <p className="text-navy/40 text-xs flex items-center gap-1.5 mt-1"><User size={12} /> {j.customer_name}</p>
            </div>
            <StatusBadge status={j.status} />
            <p className="text-navy font-extrabold w-16">£{j.price}</p>
            <div className="flex gap-2">
              <button onClick={() => setSelectedId(j.id)} className="text-xs font-semibold border border-navy/15 rounded px-4 py-2.5 hover:border-navy/40">
                View Job
              </button>
              <a href={mapsUrl(j.property_address)} target="_blank" rel="noreferrer" className="text-xs font-semibold border border-navy/15 rounded px-4 py-2.5 hover:border-navy/40 flex items-center gap-1">
                <Navigation size={12} /> Navigate
              </a>
            </div>
          </div>
        ))}
      </div>

      {selectedId && <JobModal id={selectedId} onClose={() => setSelectedId(null)} onChanged={load} />}
    </AssessorShell>
  );
}

function JobModal({ id, onClose, onChanged }) {
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function load() {
    api.get(`/assessor/appointments/${id}`).then((d) => setJob(d.job)).catch((e) => setError(e.message));
  }
  useEffect(() => { load(); }, [id]);

  async function setStatus(status) {
    setBusy(true);
    setError('');
    try {
      await api.patch(`/assessor/appointments/${id}/status`, { status });
      load();
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 text-navy/40 hover:text-navy"><X size={20} /></button>
        {!job && !error && <p className="text-navy/40">Loading...</p>}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {job && (
          <>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-bold text-xl text-navy">Job #{job.id}</h2>
              <StatusBadge status={job.status} />
            </div>
            <p className="text-navy/50 text-sm mb-6">{job.service_name}</p>

            <div className="space-y-3 text-sm mb-6">
              <Row label="Date" value={new Date(job.appointment_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
              <Row label="Time" value={job.time_slot} />
              <Row label="Property" value={job.property_address} />
              <Row label="Fee" value={`£${job.assessor_fee || job.price}`} />
              <Row label="Notes" value={job.additional_notes || '—'} />
            </div>

            <div className="border border-navy/10 rounded-lg p-4 mb-6">
              <p className="text-navy font-bold text-sm mb-3">Customer</p>
              <p className="text-navy text-sm mb-2">{job.customer_name}</p>
              <div className="flex flex-wrap gap-3">
                <a href={`tel:${job.customer_phone}`} className="flex items-center gap-2 text-xs font-semibold bg-navy text-white rounded px-3 py-2"><Phone size={13} /> {job.customer_phone}</a>
                <a href={`mailto:${job.customer_email}`} className="flex items-center gap-2 text-xs font-semibold border border-navy/20 rounded px-3 py-2"><Mail size={13} /> Email</a>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href={mapsUrl(job.property_address)} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold border border-navy/20 rounded px-4 py-3 hover:border-navy/50">
                <Navigation size={14} /> Get Directions
              </a>
              {job.status === 'assigned' && (
                <button onClick={() => setStatus('in_progress')} disabled={busy} className="text-sm font-bold bg-blue-600 text-white rounded px-5 py-3 hover:bg-blue-700 disabled:opacity-50">
                  Start Job
                </button>
              )}
              {(job.status === 'assigned' || job.status === 'in_progress') && (
                <button onClick={() => setStatus('completed')} disabled={busy} className="text-sm font-bold bg-emerald-600 text-white rounded px-5 py-3 hover:bg-emerald-700 disabled:opacity-50">
                  Mark Completed
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-navy/5 pb-2">
      <span className="text-navy/50 shrink-0">{label}</span>
      <span className="text-navy font-medium text-right">{value}</span>
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