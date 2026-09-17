'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Search, Eye, X, Plus } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    api.get(`/admin/customers?${params.toString()}`)
      .then((data) => setCustomers(data.customers))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [search]);

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Customers" />
          <main className="p-8">
            <div className="flex flex-wrap gap-4 mb-6 justify-between">
              <div className="flex items-center gap-2 bg-white border border-navy/10 rounded-lg px-4 py-2.5 flex-1 min-w-[240px] max-w-md">
                <Search size={16} className="text-navy/40" />
                <input
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, phone..."
                  className="text-sm outline-none w-full"
                />
              </div>
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-navy-light"
              >
                <Plus size={16} /> Add Customer
              </button>
            </div>

            <div className="bg-white rounded-xl border border-navy/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-navy/40 text-xs border-b border-navy/5 bg-navy/[0.02]">
                    <th className="text-left px-6 py-3 font-medium">Name</th>
                    <th className="text-left px-6 py-3 font-medium">Contact</th>
                    <th className="text-left px-6 py-3 font-medium">Property</th>
                    <th className="text-left px-6 py-3 font-medium">Appointments</th>
                    <th className="text-left px-6 py-3 font-medium">Last Visit</th>
                    <th className="text-left px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={6} className="text-center py-10 text-navy/40">Loading...</td></tr>}
                  {!loading && customers.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-navy/40">No customers found.</td></tr>}
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b border-navy/5 last:border-0 hover:bg-navy/[0.02]">
                      <td className="px-6 py-3 text-navy font-medium">{c.full_name}</td>
                      <td className="px-6 py-3 text-navy/70">{c.email}<br /><span className="text-xs text-navy/40">{c.phone}</span></td>
                      <td className="px-6 py-3 text-navy/70">{c.property_address || '—'}</td>
                      <td className="px-6 py-3 text-navy/70">{c.appointment_count}</td>
                      <td className="px-6 py-3 text-navy/70">{c.last_appointment_date || '—'}</td>
                      <td className="px-6 py-3">
                        <button onClick={() => setSelectedId(c.id)} className="text-navy/50 hover:text-navy">
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

      {selectedId && <CustomerDetailModal id={selectedId} onClose={() => setSelectedId(null)} />}
      {showAdd && <AddCustomerModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />}
    </AdminGuard>
  );
}

function CustomerDetailModal({ id, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/admin/customers/${id}`).then(setData);
  }, [id]);

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl max-w-xl w-full p-8 relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-navy/40 hover:text-navy"><X size={20} /></button>
        {!data ? <p className="text-navy/40">Loading...</p> : (
          <>
            <h2 className="font-bold text-xl text-navy mb-1">{data.customer.full_name}</h2>
            <p className="text-navy/50 text-sm mb-6">{data.customer.email} · {data.customer.phone}</p>

            <h3 className="font-bold text-navy text-sm mb-3">Appointment History</h3>
            <div className="space-y-2 mb-6">
              {data.appointments.length === 0 && <p className="text-navy/40 text-sm">No appointments yet.</p>}
              {data.appointments.map((a) => (
                <div key={a.id} className="flex justify-between text-sm border-b border-navy/5 pb-2">
                  <span className="text-navy">{a.service_name} — {a.appointment_date}</span>
                  <span className="text-navy/50">£{a.price}</span>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-navy text-sm mb-3">Invoices</h3>
            <div className="space-y-2">
              {data.invoices.length === 0 && <p className="text-navy/40 text-sm">No invoices yet.</p>}
              {data.invoices.map((inv) => (
                <div key={inv.id} className="flex justify-between text-sm border-b border-navy/5 pb-2">
                  <span className="text-navy">{inv.invoice_number}</span>
                  <span className="text-navy/50">£{inv.total} · {inv.status}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AddCustomerModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', propertyAddress: '', propertyPostcode: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/admin/customers', form);
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
        <h2 className="font-bold text-xl text-navy mb-2">Add Customer</h2>

        {['fullName', 'email', 'phone', 'propertyAddress', 'propertyPostcode'].map((field) => (
          <input
            key={field}
            required={['fullName', 'email', 'phone'].includes(field)}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full border border-navy/15 rounded px-4 py-3 text-sm"
          />
        ))}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={saving} className="w-full bg-navy text-white font-bold text-sm py-3 rounded hover:bg-navy-light disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Customer'}
        </button>
      </form>
    </div>
  );
}