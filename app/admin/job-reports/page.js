'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Eye, X, FileText, CheckCircle2, Undo2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_ORIGIN = API_URL.replace('/api', '');

const TABS = [
  { key: 'awaiting_review', label: 'Awaiting Review' },
  { key: 'returned', label: 'Returned' },
  { key: 'approved', label: 'Approved' },
  { key: 'draft', label: 'Draft' },
  { key: '', label: 'All' },
];

export default function AdminJobReportsPage() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ draft: 0, awaiting_review: 0, approved: 0, returned: 0 });
  const [tab, setTab] = useState('awaiting_review');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  function load() {
    setLoading(true);
    const params = tab ? `?status=${tab}` : '';
    api.get(`/admin/job-reports${params}`)
      .then((data) => { setReports(data.reports); setStats(data.stats); })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [tab]);

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Assessor Reports" />
          <main className="p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <Count label="Awaiting Review" value={stats.awaiting_review} tone="blue" />
              <Count label="Returned" value={stats.returned} tone="red" />
              <Count label="Approved" value={stats.approved} tone="emerald" />
              <Count label="Draft" value={stats.draft} tone="orange" />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {TABS.map((t) => (
                <button key={t.label} onClick={() => setTab(t.key)} className={`text-sm font-semibold px-4 py-2 rounded-lg ${tab === t.key ? 'bg-navy text-white' : 'bg-white text-navy/60 border border-navy/10'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-navy/5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-navy/40 text-xs border-b border-navy/5 bg-navy/[0.02]">
                    <th className="text-left px-6 py-3 font-medium">Job</th>
                    <th className="text-left px-6 py-3 font-medium">Assessor</th>
                    <th className="text-left px-6 py-3 font-medium">Customer</th>
                    <th className="text-left px-6 py-3 font-medium">Job Date</th>
                    <th className="text-left px-6 py-3 font-medium">Submitted</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={7} className="text-center py-10 text-navy/40">Loading...</td></tr>}
                  {!loading && reports.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-navy/40">No reports found.</td></tr>}
                  {reports.map((r) => (
                    <tr key={r.id} className="border-b border-navy/5 last:border-0 hover:bg-navy/[0.02]">
                      <td className="px-6 py-3">
                        <p className="text-navy font-medium">#{r.appointment_id} · {r.service_name}</p>
                        <p className="text-navy/40 text-xs truncate max-w-[220px]">{r.property_address}</p>
                      </td>
                      <td className="px-6 py-3 text-navy/70">{r.assessor_name}</td>
                      <td className="px-6 py-3 text-navy/70">{r.customer_name}</td>
                      <td className="px-6 py-3 text-navy/70">{new Date(r.appointment_date + 'T00:00:00').toLocaleDateString('en-GB')}</td>
                      <td className="px-6 py-3 text-navy/70">{r.submitted_at ? new Date(r.submitted_at).toLocaleDateString('en-GB') : '—'}</td>
                      <td className="px-6 py-3"><ReportBadge status={r.status} /></td>
                      <td className="px-6 py-3">
                        <button onClick={() => setSelectedId(r.id)} className="text-navy/50 hover:text-navy"><Eye size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {selectedId && <ReviewModal id={selectedId} onClose={() => setSelectedId(null)} onChanged={() => { setSelectedId(null); load(); }} />}
    </AdminGuard>
  );
}

function ReviewModal({ id, onClose, onChanged }) {
  const [report, setReport] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showReturn, setShowReturn] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/admin/job-reports/${id}`).then((d) => setReport(d.report)).catch((e) => setError(e.message));
  }, [id]);

  async function approve() {
    setBusy(true);
    setError('');
    try {
      await api.patch(`/admin/job-reports/${id}/approve`);
      onChanged();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function sendBack(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.patch(`/admin/job-reports/${id}/return`, { feedback });
      onChanged();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl max-w-xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-navy/40 hover:text-navy"><X size={20} /></button>

        {!report && !error && <p className="text-navy/40">Loading...</p>}
        {!report && error && <p className="text-red-600 text-sm">{error}</p>}

        {report && (
          <>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-bold text-xl text-navy">Report · Job #{report.appointment_id}</h2>
              <ReportBadge status={report.status} />
            </div>
            <p className="text-navy/50 text-sm mb-6">{report.service_name} · by {report.assessor_name}</p>

            <div className="space-y-3 text-sm mb-6">
              <Row label="Customer" value={`${report.customer_name} · ${report.customer_email}`} />
              <Row label="Property" value={report.property_address} />
              <Row label="Job Date" value={`${new Date(report.appointment_date + 'T00:00:00').toLocaleDateString('en-GB')} · ${report.time_slot}`} />
              <Row label="Submitted" value={report.submitted_at ? new Date(report.submitted_at).toLocaleString('en-GB') : '—'} />
            </div>

            <div className="mb-5">
              <p className="text-navy text-xs font-bold tracking-wide mb-2">ASSESSOR NOTES</p>
              <p className="text-navy/80 text-sm bg-navy/5 rounded-lg p-4 whitespace-pre-wrap">{report.notes || 'No notes provided.'}</p>
            </div>

            {report.file_path && (
              <a href={`${BACKEND_ORIGIN}${report.file_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-navy font-semibold text-sm hover:underline mb-5">
                <FileText size={16} /> Open report file
              </a>
            )}

            {report.admin_feedback && (
              <div className="mb-5 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-xs font-bold mb-1">FEEDBACK SENT TO ASSESSOR</p>
                <p className="text-red-800 text-sm whitespace-pre-wrap">{report.admin_feedback}</p>
              </div>
            )}

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            {report.status === 'awaiting_review' && !showReturn && (
              <div className="flex gap-3">
                <button onClick={approve} disabled={busy} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-semibold py-3 rounded hover:bg-emerald-700 disabled:opacity-50">
                  <CheckCircle2 size={16} /> Approve
                </button>
                <button onClick={() => setShowReturn(true)} className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white text-sm font-semibold py-3 rounded hover:bg-red-600">
                  <Undo2 size={16} /> Return
                </button>
              </div>
            )}

            {showReturn && (
              <form onSubmit={sendBack} className="border-t border-navy/10 pt-5 space-y-3">
                <label className="block text-navy text-xs font-bold tracking-wide">WHAT NEEDS TO BE CORRECTED?</label>
                <textarea
                  required rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Explain clearly so the assessor can fix and resubmit..."
                  className="w-full border border-navy/15 rounded px-4 py-3 text-sm resize-none"
                />
                <button type="submit" disabled={busy} className="w-full bg-navy text-white font-bold text-sm py-3 rounded hover:bg-navy-light disabled:opacity-50">
                  {busy ? 'Sending...' : 'Return to Assessor'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Count({ label, value, tone }) {
  const tones = { blue: 'text-blue-600', red: 'text-red-600', emerald: 'text-emerald-600', orange: 'text-orange-600' };
  return (
    <div className="bg-white rounded-xl p-5 border border-navy/5">
      <p className={`text-3xl font-extrabold ${tones[tone]}`}>{value}</p>
      <p className="text-navy/50 text-xs mt-1">{label}</p>
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

function ReportBadge({ status }) {
  const config = {
    draft: ['bg-orange-100 text-orange-700', 'Draft'],
    awaiting_review: ['bg-blue-100 text-blue-700', 'Awaiting Review'],
    approved: ['bg-emerald-100 text-emerald-700', 'Approved'],
    returned: ['bg-red-100 text-red-700', 'Returned'],
  }[status] || ['bg-gray-100 text-gray-700', status];
  return <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${config[0]}`}>{config[1]}</span>;
}