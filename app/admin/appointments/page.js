'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Search, Eye, X } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'pending_payment', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [assessors, setAssessors] = useState([]);

  function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    api.get(`/admin/appointments?${params.toString()}`)
      .then((data) => setAppointments(data.appointments))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [search, statusFilter]);

  useEffect(() => {
    api.get('/admin/assessors').then((data) => setAssessors(data.assessors)).catch(() => {});
  }, []);

  async function updateStatus(id, status) {
    await api.patch(`/admin/appointments/${id}/status`, { status });
    load();
    setSelected(null);
  }

  async function assignAssessor(id, assessorId) {
    await api.patch(`/admin/appointments/${id}/assign`, { assessorId });
    load();
    setSelected(null);
  }

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Appointments" />
          <main className="p-8">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white border border-navy/10 rounded-lg px-4 py-2.5 flex-1 min-w-[240px]">
                <Search size={16} className="text-navy/40" />
                <input
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customer, address..."
                  className="text-sm outline-none w-full"
                />
              </div>
              <select
                value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-navy/10 rounded-lg px-4 py-2.5 text-sm"
              >
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-xl border border-navy/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-navy/40 text-xs border-b border-navy/5 bg-navy/[0.02]">
                    <th className="text-left px-6 py-3 font-medium">Customer</th>
                    <th className="text-left px-6 py-3 font-medium">Service</th>
                    <th className="text-left px-6 py-3 font-medium">Date & Time</th>
                    <th className="text-left px-6 py-3 font-medium">Assessor</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Price</th>
                    <th className="text-left px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={7} className="text-center py-10 text-navy/40">Loading...</td></tr>
                  )}
                  {!loading && appointments.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-10 text-navy/40">No appointments found.</td></tr>
                  )}
                  {appointments.map((a) => (
                    <tr key={a.id} className="border-b border-navy/5 last:border-0 hover:bg-navy/[0.02]">
                      <td className="px-6 py-3">
                        <p className="text-navy font-medium">{a.customer_name}</p>
                        <p className="text-navy/40 text-xs">{a.customer_email}</p>
                      </td>
                      <td className="px-6 py-3 text-navy/70">{a.service_name}</td>
                      <td className="px-6 py-3 text-navy/70">{a.appointment_date}<br /><span className="text-xs text-navy/40">{a.time_slot}</span></td>
                      <td className="px-6 py-3 text-navy/70">{a.assessor_name || <span className="text-navy/30">Unassigned</span>}</td>
                      <td className="px-6 py-3"><StatusBadge status={a.status} /></td>
                      <td className="px-6 py-3 text-navy font-semibold">£{a.price}</td>
                      <td className="px-6 py-3">
                        <button onClick={() => setSelected(a)} className="text-navy/50 hover:text-navy">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {selected && (
        <AppointmentModal
          appointment={selected}
          assessors={assessors}
          onClose={() => setSelected(null)}
          onUpdateStatus={updateStatus}
          onAssign={assignAssessor}
        />
      )}
    </AdminGuard>
  );
}

function AppointmentModal({ appointment, assessors, onClose, onUpdateStatus, onAssign }) {
  const [status, setStatus] = useState(appointment.status);
  const [assessorId, setAssessorId] = useState(appointment.assessor_id || '');

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-navy/40 hover:text-navy">
          <X size={20} />
        </button>
        <h2 className="font-bold text-xl text-navy mb-1">Appointment #{appointment.id}</h2>
        <p className="text-navy/50 text-sm mb-6">{appointment.customer_name} · {appointment.customer_email}</p>

        <div className="space-y-3 text-sm mb-6">
          <Row label="Service" value={appointment.service_name} />
          <Row label="Date" value={`${appointment.appointment_date} · ${appointment.time_slot}`} />
          <Row label="Property" value={appointment.property_address} />
          <Row label="Price" value={`£${appointment.price}`} />
        </div>

        <div className="mb-4">
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">STATUS</label>
          <div className="flex gap-2">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex-1 border border-navy/15 rounded px-3 py-2.5 text-sm">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <button onClick={() => onUpdateStatus(appointment.id, status)} className="bg-navy text-white text-sm font-semibold px-4 rounded hover:bg-navy-light">
              Update
            </button>
          </div>
        </div>

        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">ASSIGN ASSESSOR</label>
          <div className="flex gap-2">
            <select value={assessorId} onChange={(e) => setAssessorId(e.target.value)} className="flex-1 border border-navy/15 rounded px-3 py-2.5 text-sm">
              <option value="">Select assessor</option>
              {assessors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <button
              onClick={() => assessorId && onAssign(appointment.id, assessorId)}
              className="bg-gold text-navy text-sm font-semibold px-4 rounded hover:bg-gold-light"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-navy/5 pb-2">
      <span className="text-navy/50">{label}</span>
      <span className="text-navy font-medium">{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    pending_payment: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    assigned: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}