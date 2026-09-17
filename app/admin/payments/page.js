'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Search, Plus, X, Banknote } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    api.get(`/admin/payments?${params.toString()}`)
      .then((data) => { setPayments(data.payments); setTotalCollected(data.totalCollected); })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [search, statusFilter]);

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Payments" />
          <main className="p-8">
            <div className="bg-navy rounded-xl p-6 mb-6 flex items-center justify-between text-white">
              <div>
                <p className="text-white/50 text-xs mb-1">Total Collected</p>
                <p className="text-3xl font-extrabold text-gold">£{totalCollected.toLocaleString()}</p>
              </div>
              <Banknote size={40} className="text-gold/40" />
            </div>

            <div className="flex flex-wrap gap-4 mb-6 justify-between">
              <div className="flex flex-wrap gap-4 flex-1">
                <div className="flex items-center gap-2 bg-white border border-navy/10 rounded-lg px-4 py-2.5 flex-1 min-w-[240px]">
                  <Search size={16} className="text-navy/40" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoice #, customer..." className="text-sm outline-none w-full" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-navy/10 rounded-lg px-4 py-2.5 text-sm">
                  <option value="">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-navy-light">
                <Plus size={16} /> Record Payment
              </button>
            </div>

            <div className="bg-white rounded-xl border border-navy/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-navy/40 text-xs border-b border-navy/5 bg-navy/[0.02]">
                    <th className="text-left px-6 py-3 font-medium">Invoice #</th>
                    <th className="text-left px-6 py-3 font-medium">Customer</th>
                    <th className="text-left px-6 py-3 font-medium">Amount</th>
                    <th className="text-left px-6 py-3 font-medium">Method</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={6} className="text-center py-10 text-navy/40">Loading...</td></tr>}
                  {!loading && payments.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-navy/40">No payments found.</td></tr>}
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-navy/5 last:border-0 hover:bg-navy/[0.02]">
                      <td className="px-6 py-3 text-navy font-semibold">{p.invoice_number}</td>
                      <td className="px-6 py-3 text-navy/70">{p.customer_name}</td>
                      <td className="px-6 py-3 text-navy font-semibold">£{p.amount}</td>
                      <td className="px-6 py-3 text-navy/70 capitalize">{p.method.replace('_', ' ')}</td>
                      <td className="px-6 py-3"><PaymentStatusBadge status={p.status} /></td>
                      <td className="px-6 py-3 text-navy/70">{p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-GB') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {showAdd && <RecordPaymentModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />}
    </AdminGuard>
  );
}

function RecordPaymentModal({ onClose, onSaved }) {
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({ invoiceId: '', amount: '', method: 'cash', transactionReference: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/invoices?status=pending&limit=100').then((data) => setInvoices(data.invoices));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/admin/payments', form);
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
        <h2 className="font-bold text-xl text-navy mb-2">Record Payment</h2>

        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">INVOICE</label>
          <select required value={form.invoiceId} onChange={(e) => {
            const inv = invoices.find((i) => String(i.id) === e.target.value);
            setForm({ ...form, invoiceId: e.target.value, amount: inv ? inv.total : '' });
          }} className="w-full border border-navy/15 rounded px-4 py-3 text-sm">
            <option value="">Select an unpaid invoice</option>
            {invoices.map((inv) => (
              <option key={inv.id} value={inv.id}>{inv.invoice_number} — {inv.customer_name} — £{inv.total}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">AMOUNT</label>
          <input required type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        </div>

        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">METHOD</label>
          <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm">
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="card">Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">REFERENCE (optional)</label>
          <input value={form.transactionReference} onChange={(e) => setForm({ ...form, transactionReference: e.target.value })} placeholder="Transaction ID / reference" className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={saving} className="w-full bg-navy text-white font-bold text-sm py-3 rounded hover:bg-navy-light disabled:opacity-50">
          {saving ? 'Saving...' : 'Record Payment'}
        </button>
      </form>
    </div>
  );
}

function PaymentStatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
  };
  return <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || ''}`}>{status}</span>;
}