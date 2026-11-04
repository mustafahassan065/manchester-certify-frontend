'use client';

import { useEffect, useState } from 'react';
import AssessorShell from '@/components/assessor/AssessorShell';
import { api } from '@/lib/api';
import { FileEdit, Hourglass, CheckCircle2, Undo2, X, Upload, FileText, MessageSquareWarning } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_ORIGIN = API_URL.replace('/api', '');

const TABS = [
  { key: '', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'awaiting_review', label: 'Awaiting Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'returned', label: 'Returned' },
];

export default function AssessorReportsPage() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ draft: 0, awaiting_review: 0, approved: 0, returned: 0 });
  const [tab, setTab] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  function load() {
    setLoading(true);
    api.get('/assessor/reports')
      .then((data) => { setReports(data.reports); setStats(data.stats); })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const filtered = tab ? reports.filter((r) => r.report_status === tab) : reports;

  return (
    <AssessorShell title="My Reports">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-navy">My Reports</h2>
        <p className="text-navy/50 text-sm">View and manage your submitted reports. Reports are created for jobs you have started or completed.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        <Stat icon={FileEdit} tone="orange" label="Draft" value={stats.draft} />
        <Stat icon={Hourglass} tone="blue" label="Awaiting Review" value={stats.awaiting_review} />
        <Stat icon={CheckCircle2} tone="emerald" label="Approved" value={stats.approved} />
        <Stat icon={Undo2} tone="red" label="Returned" value={stats.returned} />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
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
              <th className="text-left px-6 py-3 font-medium">Job / Address</th>
              <th className="text-left px-6 py-3 font-medium">Type</th>
              <th className="text-left px-6 py-3 font-medium">Date</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
              <th className="text-left px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="text-center py-10 text-navy/40">Loading...</td></tr>}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-navy/40">No reports here yet. Start a job to create its report.</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.appointment_id} className="border-b border-navy/5 last:border-0 hover:bg-navy/[0.02]">
                <td className="px-6 py-3 text-navy font-medium">{r.property_address}</td>
                <td className="px-6 py-3 text-navy/70">{r.service_code}</td>
                <td className="px-6 py-3 text-navy/70">{new Date(r.appointment_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="px-6 py-3"><ReportBadge status={r.report_status} /></td>
                <td className="px-6 py-3">
                  <button onClick={() => setSelectedId(r.appointment_id)} className="text-xs font-semibold border border-navy/15 rounded px-4 py-2 hover:border-navy/40">
                    {['draft', 'returned'].includes(r.report_status) ? 'Edit Report' : 'View'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedId && <ReportModal appointmentId={selectedId} onClose={() => setSelectedId(null)} onChanged={load} />}
    </AssessorShell>
  );
}

function ReportModal({ appointmentId, onClose, onChanged }) {
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/assessor/reports/${appointmentId}`)
      .then((d) => { setData(d); setNotes(d.report?.notes || ''); })
      .catch((e) => setError(e.message));
  }, [appointmentId]);

  const status = data?.report?.status || 'draft';
  const editable = ['draft', 'returned'].includes(status);

  async function save(submit) {
    if (submit && !confirm('Submit this report for review? You will not be able to edit it until it is reviewed.')) return;
    setBusy(true);
    setError('');
    try {
      const form = new FormData();
      form.append('notes', notes);
      form.append('submit', submit ? 'true' : 'false');
      if (file) form.append('file', file);
      await api.putForm(`/assessor/reports/${appointmentId}`, form);
      onChanged();
      onClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 text-navy/40 hover:text-navy"><X size={20} /></button>

        {!data && !error && <p className="text-navy/40">Loading...</p>}
        {!data && error && <p className="text-red-600 text-sm">{error}</p>}

        {data && (
          <>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-bold text-xl text-navy">Report · Job #{data.job.appointment_id}</h2>
              <ReportBadge status={status} />
            </div>
            <p className="text-navy/50 text-sm mb-1">{data.job.service_name}</p>
            <p className="text-navy/40 text-xs mb-6">{data.job.property_address} · {new Date(data.job.appointment_date + 'T00:00:00').toLocaleDateString('en-GB')}</p>

            {status === 'returned' && data.report?.admin_feedback && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
                <p className="text-red-700 text-xs font-bold flex items-center gap-1.5 mb-1"><MessageSquareWarning size={14} /> RETURNED BY OFFICE — PLEASE FIX</p>
                <p className="text-red-800 text-sm whitespace-pre-wrap">{data.report.admin_feedback}</p>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-navy text-xs font-bold tracking-wide mb-2">REPORT NOTES / FINDINGS</label>
              <textarea
                rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!editable}
                placeholder="Describe the inspection, findings and anything the office should know..."
                className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none disabled:bg-navy/5"
              />
            </div>

            <div className="mb-6">
              <label className="block text-navy text-xs font-bold tracking-wide mb-2">REPORT FILE (PDF, Word, JPG, PNG — max 10MB)</label>
              {data.report?.file_path && (
                <a href={`${BACKEND_ORIGIN}${data.report.file_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-navy font-semibold text-sm hover:underline mb-3">
                  <FileText size={16} /> View uploaded file
                </a>
              )}
              {editable && (
                <label className="flex items-center gap-3 border border-dashed border-navy/25 rounded-lg px-4 py-4 cursor-pointer hover:border-gold transition-colors">
                  <Upload size={18} className="text-navy/40" />
                  <span className="text-sm text-navy/60">{file ? file.name : data.report?.file_path ? 'Click to replace the file' : 'Click to upload a file'}</span>
                  <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
                </label>
              )}
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}

            {editable ? (
              <div className="flex flex-wrap gap-3">
                <button onClick={() => save(false)} disabled={busy} className="flex-1 border border-navy/20 text-navy font-semibold text-sm px-5 py-3 rounded hover:border-navy/50 disabled:opacity-50">
                  Save Draft
                </button>
                <button onClick={() => save(true)} disabled={busy} className="flex-1 bg-gold text-navy font-bold text-sm px-5 py-3 rounded hover:bg-gold-light disabled:opacity-50">
                  {busy ? 'Saving...' : 'Submit for Review'}
                </button>
              </div>
            ) : (
              <p className="text-navy/50 text-sm bg-navy/5 rounded-lg p-4">
                {status === 'approved' ? 'This report has been approved.' : 'This report is awaiting review by the office.'}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }) {
  const tones = {
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    red: 'bg-red-100 text-red-600',
  };
  return (
    <div className="bg-white rounded-xl p-5 border border-navy/5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${tones[tone]}`}><Icon size={18} /></div>
      <p className="text-navy/50 text-xs mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-navy">{value}</p>
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