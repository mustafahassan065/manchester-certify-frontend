'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AssessorShell from '@/components/assessor/AssessorShell';
import { api } from '@/lib/api';
import { ArrowLeft, Calendar, MapPin, Home, ClipboardCheck, Navigation, CheckCircle2, Square, CheckSquare } from 'lucide-react';

const CHECKLIST = [
  'Appointment confirmed',
  'Customer contacted',
  'Inspection completed',
  'Evidence uploaded',
  'Report completed',
  'Certificate issued',
];

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    api.get(`/assessor/job-offers/${id}`)
      .then((data) => setOffer(data.offer))
      .catch((err) => setError(err.message));
  }, [id]);

  async function accept() {
    setBusy(true);
    setError('');
    try {
      await api.post(`/assessor/job-offers/${id}/accept`);
      router.push('/assessor/dashboard');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function decline() {
    if (!confirm('Decline this job?')) return;
    setBusy(true);
    try {
      await api.post(`/assessor/job-offers/${id}/decline`);
      router.push('/assessor/job-board');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  function toggle(item) {
    setChecked((c) => (c.includes(item) ? c.filter((x) => x !== item) : [...c, item]));
  }

  const available = offer && offer.offer_status === 'offered' && !offer.assessor_id;

  return (
    <AssessorShell title="Job Details">
      <Link href="/assessor/job-board" className="inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy mb-5">
        <ArrowLeft size={16} /> Back to Job Board
      </Link>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4 mb-5">{error}</div>}
      {!offer && !error && <p className="text-navy/40">Loading...</p>}

      {offer && (
        <div className="max-w-4xl">
          <div className="bg-white rounded-xl border border-navy/5 p-6 sm:p-8 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-navy/40 text-xs mb-1">Job #{offer.appointment_id}</p>
                <h2 className="text-2xl font-extrabold text-navy">{offer.service_name}</h2>
                <p className="text-navy/50 text-sm mt-1 flex items-center gap-1.5"><MapPin size={14} /> {offer.property_address}</p>
                {offer.sub_service_name && <p className="text-navy/50 text-sm flex items-center gap-1.5 mt-1"><Home size={14} /> {offer.sub_service_name}</p>}
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-navy">£{offer.price}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(offer.property_address)}`}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-3 bg-navy text-white text-sm font-semibold px-4 py-2.5 rounded hover:bg-navy-light"
                >
                  <Navigation size={14} /> View on Map
                </a>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-navy/5 p-6">
              <h3 className="font-bold text-navy flex items-center gap-2 mb-4"><Calendar size={16} className="text-navy/50" /> Appointment</h3>
              <div className="space-y-3 text-sm">
                <Row label="Date" value={new Date(offer.appointment_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
                <Row label="Time" value={offer.time_slot} />
                <Row label="Postcode" value={offer.property_postcode || '—'} />
                <Row label="Notes" value={offer.additional_notes || '—'} />
              </div>
              <p className="text-navy/40 text-xs mt-4">Customer contact details are shared once you accept this job.</p>
            </div>

            <div className="bg-white rounded-xl border border-navy/5 p-6">
              <h3 className="font-bold text-navy flex items-center gap-2 mb-4"><ClipboardCheck size={16} className="text-navy/50" /> Job Checklist</h3>
              <div className="space-y-2.5">
                {CHECKLIST.map((item) => {
                  const on = checked.includes(item);
                  return (
                    <button key={item} onClick={() => toggle(item)} className="w-full flex items-center gap-3 text-left text-sm text-navy/80 hover:text-navy">
                      {on ? <CheckSquare size={18} className="text-emerald-600" /> : <Square size={18} className="text-navy/30" />}
                      <span className={on ? 'line-through text-navy/40' : ''}>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {available ? (
            <div className="flex flex-wrap gap-3">
              <button onClick={accept} disabled={busy} className="flex items-center gap-2 bg-gold text-navy font-bold text-sm px-8 py-3.5 rounded-md hover:bg-gold-light disabled:opacity-50">
                <CheckCircle2 size={16} /> {busy ? 'Please wait...' : 'Accept Job'}
              </button>
              <button onClick={decline} disabled={busy} className="border border-navy/20 text-navy font-semibold text-sm px-8 py-3.5 rounded-md hover:border-navy/50 disabled:opacity-50">
                Decline
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-4">
              This job is no longer available. It has been accepted by another assessor or the offer has expired.
            </div>
          )}
        </div>
      )}
    </AssessorShell>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-navy/5 pb-2">
      <span className="text-navy/50">{label}</span>
      <span className="text-navy font-medium text-right">{value}</span>
    </div>
  );
}