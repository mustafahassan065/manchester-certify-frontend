'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AssessorShell from '@/components/assessor/AssessorShell';
import { api } from '@/lib/api';
import { Briefcase, Calendar, MapPin, Clock } from 'lucide-react';

export default function JobBoardPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceFilter, setServiceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [busyId, setBusyId] = useState(null);

  function load() {
    setLoading(true);
    api.get('/assessor/job-offers')
      .then((data) => setOffers(data.offers))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function accept(offerId) {
    setBusyId(offerId);
    setMessage({ type: '', text: '' });
    try {
      await api.post(`/assessor/job-offers/${offerId}/accept`);
      setMessage({ type: 'success', text: 'Job accepted. It now appears in your appointments.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBusyId(null);
      load();
    }
  }

  const serviceCodes = [...new Set(offers.map((o) => o.service_code))];
  const filtered = offers.filter((o) => {
    if (serviceFilter && o.service_code !== serviceFilter) return false;
    if (dateFilter && new Date(o.appointment_date).toISOString().split('T')[0] !== dateFilter) return false;
    return true;
  });

  return (
    <AssessorShell title="Job Board">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-navy">Available Jobs</h2>
        <p className="text-navy/50 text-sm">Jobs offered to you. The first assessor to accept gets the job.</p>
      </div>

      {message.text && (
        <div className={`mb-5 text-sm rounded-lg p-4 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-navy/5 p-4 mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-navy/50 text-xs mb-1">Service</label>
          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="border border-navy/15 rounded px-3 py-2 text-sm min-w-[160px]">
            <option value="">All</option>
            {serviceCodes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-navy/50 text-xs mb-1">Date</label>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="border border-navy/15 rounded px-3 py-2 text-sm" />
        </div>
        {(serviceFilter || dateFilter) && (
          <button onClick={() => { setServiceFilter(''); setDateFilter(''); }} className="self-end text-sm text-navy/60 hover:text-navy underline pb-2">
            Clear filters
          </button>
        )}
      </div>

      {loading && <p className="text-navy/40">Loading...</p>}

      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-navy/5 p-12 text-center">
          <Briefcase size={32} className="text-navy/20 mx-auto mb-3" />
          <p className="text-navy/50 text-sm">No jobs available right now. New offers will appear here.</p>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((o) => (
          <div key={o.offer_id} className="bg-white rounded-xl border border-navy/5 p-5 flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gold-dark bg-gold/10 px-2 py-0.5 rounded">{o.service_code}</span>
                <p className="text-navy font-bold">{o.service_name}</p>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-navy/60 text-sm mt-2">
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {o.property_address}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(o.appointment_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {o.time_slot}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-navy font-extrabold text-xl">£{o.price}</p>
              <Link href={`/assessor/job-board/${o.offer_id}`} className="text-sm font-semibold border border-navy/15 rounded px-4 py-2.5 hover:border-navy/40">
                View
              </Link>
              <button
                onClick={() => accept(o.offer_id)}
                disabled={busyId === o.offer_id}
                className="text-sm font-bold bg-gold text-navy rounded px-5 py-2.5 hover:bg-gold-light disabled:opacity-50"
              >
                {busyId === o.offer_id ? 'Accepting...' : 'Accept'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AssessorShell>
  );
}