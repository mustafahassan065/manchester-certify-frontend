'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Search, Plus, ToggleLeft, ToggleRight, Key, Trash2, X, Eye } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_ORIGIN = API_URL.replace('/api', '');

export default function AdminAssessorsPage() {
  const [assessors, setAssessors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    api.get(`/admin/assessors?${params.toString()}`)
      .then((data) => setAssessors(data.assessors))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [search]);

  async function toggleActive(id) {
    await api.patch(`/admin/assessors/${id}/toggle-active`);
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this assessor? This cannot be undone.')) return;
    await api.del(`/admin/assessors/${id}`);
    load();
  }

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Assessors" />
          <main className="p-8">
            <div className="flex flex-wrap gap-4 mb-6 justify-between">
              <div className="flex items-center gap-2 bg-white border border-navy/10 rounded-lg px-4 py-2.5 flex-1 min-w-[240px] max-w-md">
                <Search size={16} className="text-navy/40" />
                <input
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, specialization..."
                  className="text-sm outline-none w-full"
                />
              </div>
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-navy-light"
              >
                <Plus size={16} /> Add Assessor
              </button>
            </div>

            <div className="bg-white rounded-xl border border-navy/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-navy/40 text-xs border-b border-navy/5 bg-navy/[0.02]">
                    <th className="text-left px-6 py-3 font-medium">Name</th>
                    <th className="text-left px-6 py-3 font-medium">Contact</th>
                    <th className="text-left px-6 py-3 font-medium">Specialization</th>
                    <th className="text-left px-6 py-3 font-medium">Active Jobs</th>
                    <th className="text-left px-6 py-3 font-medium">Completed</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={7} className="text-center py-10 text-navy/40">Loading...</td></tr>}
                  {!loading && assessors.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-navy/40">No assessors found.</td></tr>}
                  {assessors.map((a) => (
                    <tr key={a.id} className="border-b border-navy/5 last:border-0 hover:bg-navy/[0.02]">
                      <td className="px-6 py-3 text-navy font-medium">{a.name}</td>
                      <td className="px-6 py-3 text-navy/70">{a.email}<br /><span className="text-xs text-navy/40">{a.phone || '—'}</span></td>
                      <td className="px-6 py-3 text-navy/70">{a.specialization || '—'}</td>
                      <td className="px-6 py-3 text-navy/70">{a.active_jobs}</td>
                      <td className="px-6 py-3 text-navy/70">{a.completed_jobs}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {a.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setSelectedId(a.id)} title="View jobs" className="text-navy/50 hover:text-navy">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => toggleActive(a.id)} title="Toggle active">
                            {a.is_active ? <ToggleRight size={20} className="text-emerald-600" /> : <ToggleLeft size={20} className="text-navy/40" />}
                          </button>
                          <button onClick={() => setResetTarget(a)} title="Reset password" className="text-navy/40 hover:text-navy">
                            <Key size={16} />
                          </button>
                          <button onClick={() => handleDelete(a.id)} title="Delete" className="text-red-400 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {showAdd && <AddAssessorModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />}
      {resetTarget && <ResetPasswordModal assessor={resetTarget} onClose={() => setResetTarget(null)} onSaved={() => setResetTarget(null)} />}
      {selectedId && <AssessorJobsModal id={selectedId} onClose={() => setSelectedId(null)} />}
    </AdminGuard>
  );
}

function AddAssessorModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', specialization: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/admin/assessors', form);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl max-w-md w-full p-8 relative space-y-4">
        <button type="button" onClick={onClose} className="absolute top-6 right-6 text-navy/40 hover:text-navy"><X size={20} /></button>
        <h2 className="font-bold text-xl text-navy mb-2">Add Assessor</h2>
        <p className="text-navy/40 text-xs -mt-2 mb-2">Login credentials will be emailed to this assessor automatically.</p>

        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        <input required type="password" placeholder="Password (min. 6 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        <select value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm">
          <option value="">Select specialization</option>
          <option value="EPC">EPC</option>
          <option value="EICR">EICR</option>
          <option value="Floor Plan">Floor Plan</option>
          <option value="Air Testing">Air Testing</option>
          <option value="General">General</option>
        </select>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={saving} className="w-full bg-navy text-white font-bold text-sm py-3 rounded hover:bg-navy-light disabled:opacity-50">
          {saving ? 'Creating...' : 'Add Assessor'}
        </button>
      </form>
    </div>
  );
}

function ResetPasswordModal({ assessor, onClose, onSaved }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.patch(`/admin/assessors/${assessor.id}/password`, { password });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl max-w-sm w-full p-8 relative space-y-4">
        <button type="button" onClick={onClose} className="absolute top-6 right-6 text-navy/40 hover:text-navy"><X size={20} /></button>
        <h2 className="font-bold text-xl text-navy mb-2">Reset Password</h2>
        <p className="text-navy/50 text-sm mb-2">For {assessor.name} — new password will be emailed to them.</p>
        <input required type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={saving} className="w-full bg-navy text-white font-bold text-sm py-3 rounded hover:bg-navy-light disabled:opacity-50">
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

function AssessorJobsModal({ id, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/admin/assessors/${id}`).then(setData);
  }, [id]);

  const docStyle = {
    valid: 'bg-emerald-100 text-emerald-700',
    expiring_soon: 'bg-yellow-100 text-yellow-700',
    expired: 'bg-red-100 text-red-700',
  };

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-navy/40 hover:text-navy"><X size={20} /></button>
        {!data ? <p className="text-navy/40">Loading...</p> : (
          <>
            <h2 className="font-bold text-xl text-navy mb-1">{data.assessor.name}</h2>
            <p className="text-navy/50 text-sm mb-1">{data.assessor.email} · {data.assessor.specialization || 'General'}</p>
            <p className="text-navy/40 text-xs mb-6">
              Areas: {data.assessor.postcode_areas ? data.assessor.postcode_areas.split(',').join(', ') : '—'} ·
              Max {data.assessor.max_distance_miles || 25} miles
              {data.assessor.standard_rate ? ` · Rate £${Number(data.assessor.standard_rate).toFixed(2)}` : ''}
            </p>

            <h3 className="font-bold text-navy text-sm mb-3">Qualifications &amp; Documents</h3>
            <div className="space-y-2 mb-6">
              {data.documents.length === 0 && <p className="text-navy/40 text-sm">No documents uploaded yet.</p>}
              {data.documents.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-3 border border-navy/10 rounded-lg p-3">
                  <div className="min-w-0">
                    <p className="text-navy font-medium text-sm truncate">{d.document_type}</p>
                    <p className="text-navy/40 text-xs">
                      {d.reference_number ? `Ref: ${d.reference_number} · ` : ''}
                      {d.expiry_date ? `Expires ${new Date(d.expiry_date + 'T00:00:00').toLocaleDateString('en-GB')}` : 'No expiry'}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${docStyle[d.status]}`}>{d.status.replace('_', ' ')}</span>
                  <a href={`${BACKEND_ORIGIN}${d.file_path}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-navy underline">View</a>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-navy text-sm mb-3">Job History</h3>
            <div className="space-y-2">
              {data.jobs.length === 0 && <p className="text-navy/40 text-sm">No jobs assigned yet.</p>}
              {data.jobs.map((j) => (
                <div key={j.id} className="border border-navy/10 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-navy font-medium text-sm">{j.service_name}</span>
                    <span className="text-xs font-semibold text-navy/50 capitalize">{j.status.replace('_', ' ')}</span>
                  </div>
                  <p className="text-navy/50 text-xs mt-1">{j.customer_name} — {new Date(j.appointment_date).toLocaleDateString('en-GB')} · {j.time_slot}</p>
                  <p className="text-navy/40 text-xs">{j.property_address}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}