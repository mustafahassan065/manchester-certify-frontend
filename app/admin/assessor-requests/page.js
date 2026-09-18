'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Eye, X, CheckCircle2, XCircle, FileText } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_ORIGIN = API_URL.replace('/api', '');

export default function AssessorRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  function load() {
    setLoading(true);
    const params = statusFilter ? `?status=${statusFilter}` : '';
    api.get(`/assessor-requests/admin/all${params}`)
      .then((data) => setRequests(data.requests))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [statusFilter]);

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Assessor Requests" />
          <main className="p-8">
            <div className="flex gap-2 mb-6">
              {['pending', 'approved', 'rejected', ''].map((s) => (
                <button
                  key={s || 'all'}
                  onClick={() => setStatusFilter(s)}
                  className={`text-sm font-semibold px-4 py-2 rounded-lg capitalize ${statusFilter === s ? 'bg-navy text-white' : 'bg-white text-navy/60 border border-navy/10'}`}
                >
                  {s || 'All'}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-navy/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-navy/40 text-xs border-b border-navy/5 bg-navy/[0.02]">
                    <th className="text-left px-6 py-3 font-medium">Name</th>
                    <th className="text-left px-6 py-3 font-medium">Contact</th>
                    <th className="text-left px-6 py-3 font-medium">Specialization</th>
                    <th className="text-left px-6 py-3 font-medium">Experience</th>
                    <th className="text-left px-6 py-3 font-medium">Applied On</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={7} className="text-center py-10 text-navy/40">Loading...</td></tr>}
                  {!loading && requests.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-navy/40">No requests found.</td></tr>}
                  {requests.map((r) => (
                    <tr key={r.id} className="border-b border-navy/5 last:border-0 hover:bg-navy/[0.02]">
                      <td className="px-6 py-3 text-navy font-medium">{r.full_name}</td>
                      <td className="px-6 py-3 text-navy/70">{r.email}<br /><span className="text-xs text-navy/40">{r.phone}</span></td>
                      <td className="px-6 py-3 text-navy/70">{r.specialization || '—'}</td>
                      <td className="px-6 py-3 text-navy/70">{r.experience_years ? `${r.experience_years} yrs` : '—'}</td>
                      <td className="px-6 py-3 text-navy/70">{new Date(r.created_at).toLocaleDateString('en-GB')}</td>
                      <td className="px-6 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-6 py-3">
                        <button onClick={() => setSelected(r)} className="text-navy/50 hover:text-navy"><Eye size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {selected && <RequestDetailModal request={selected} onClose={() => setSelected(null)} onActioned={() => { setSelected(null); load(); }} />}
    </AdminGuard>
  );
}

function RequestDetailModal({ request, onClose, onActioned }) {
  const [showApprove, setShowApprove] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleApprove(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post(`/assessor-requests/admin/${request.id}/approve`, { password });
      onActioned();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleReject() {
    if (!confirm('Reject this application?')) return;
    await api.patch(`/assessor-requests/admin/${request.id}/reject`);
    onActioned();
  }

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-navy/40 hover:text-navy"><X size={20} /></button>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-xl text-navy">{request.full_name}</h2>
          <StatusBadge status={request.status} />
        </div>
        <p className="text-navy/50 text-sm mb-6">{request.email} · {request.phone}</p>

        <div className="space-y-3 text-sm mb-6">
          <Row label="Specialization" value={request.specialization || '—'} />
          <Row label="Experience" value={request.experience_years ? `${request.experience_years} years` : '—'} />
          <Row label="Qualifications" value={request.qualifications || '—'} />
          <Row label="Message" value={request.message || '—'} />
          <Row label="Applied On" value={new Date(request.created_at).toLocaleDateString('en-GB')} />
        </div>

        {request.cv_file_path && (
          <a
            href={`${BACKEND_ORIGIN}${request.cv_file_path}`}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 text-navy font-semibold text-sm hover:underline mb-6"
          >
            <FileText size={16} /> View Uploaded CV
          </a>
        )}

        {request.status === 'pending' && !showApprove && (
          <div className="flex gap-3">
            <button onClick={() => setShowApprove(true)} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-semibold py-3 rounded hover:bg-emerald-700">
              <CheckCircle2 size={16} /> Approve
            </button>
            <button onClick={handleReject} className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white text-sm font-semibold py-3 rounded hover:bg-red-600">
              <XCircle size={16} /> Reject
            </button>
          </div>
        )}

        {showApprove && (
          <form onSubmit={handleApprove} className="border-t border-navy/10 pt-5 space-y-3">
            <label className="block text-navy text-xs font-bold tracking-wide">SET LOGIN PASSWORD FOR THIS ASSESSOR</label>
            <input
              required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters" className="w-full border border-navy/15 rounded px-4 py-3 text-sm"
            />
            <p className="text-navy/40 text-xs">Login credentials will be emailed to {request.email}.</p>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={saving} className="w-full bg-navy text-white font-bold text-sm py-3 rounded hover:bg-navy-light disabled:opacity-50">
              {saving ? 'Approving...' : 'Confirm Approval & Create Account'}
            </button>
          </form>
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
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${styles[status] || ''}`}>{status}</span>;
}