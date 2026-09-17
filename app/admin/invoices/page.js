'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Search, Download, Mail, X, FileText, Banknote, Clock, AlertTriangle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    api.get(`/admin/invoices?${params.toString()}`)
      .then((data) => { setInvoices(data.invoices); setStats(data.stats); })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [search, statusFilter]);

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Invoices" />
          <main className="p-8">
            {stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                <StatCard icon={FileText} label="Total Invoices" value={stats.total} color="navy" />
                <StatCard icon={Banknote} label="Paid" value={`${stats.paid} · £${stats.paidAmount}`} color="green" />
                <StatCard icon={Clock} label="Unpaid" value={`${stats.unpaid} · £${stats.unpaidAmount}`} color="gold" />
                <StatCard icon={AlertTriangle} label="Overdue" value={`${stats.overdue} · £${stats.overdueAmount}`} color="red" />
              </div>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white border border-navy/10 rounded-lg px-4 py-2.5 flex-1 min-w-[240px]">
                <Search size={16} className="text-navy/40" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoice #, customer..." className="text-sm outline-none w-full" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-navy/10 rounded-lg px-4 py-2.5 text-sm">
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="bg-white rounded-xl border border-navy/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-navy/40 text-xs border-b border-navy/5 bg-navy/[0.02]">
                    <th className="text-left px-6 py-3 font-medium">Invoice #</th>
                    <th className="text-left px-6 py-3 font-medium">Customer</th>
                    <th className="text-left px-6 py-3 font-medium">Service</th>
                    <th className="text-left px-6 py-3 font-medium">Issue Date</th>
                    <th className="text-left px-6 py-3 font-medium">Due Date</th>
                    <th className="text-left px-6 py-3 font-medium">Amount</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={8} className="text-center py-10 text-navy/40">Loading...</td></tr>}
                  {!loading && invoices.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-navy/40">No invoices found.</td></tr>}
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-navy/5 last:border-0 hover:bg-navy/[0.02]">
                      <td className="px-6 py-3">
                        <button onClick={() => setSelectedId(inv.id)} className="text-navy font-semibold hover:underline">{inv.invoice_number}</button>
                      </td>
                      <td className="px-6 py-3 text-navy/70">{inv.customer_name}</td>
                      <td className="px-6 py-3 text-navy/70">{inv.service_code}</td>
                      <td className="px-6 py-3 text-navy/70">{new Date(inv.issue_date).toLocaleDateString('en-GB')}</td>
                      <td className="px-6 py-3 text-navy/70">{new Date(inv.due_date).toLocaleDateString('en-GB')}</td>
                      <td className="px-6 py-3 text-navy font-semibold">£{inv.total}</td>
                      <td className="px-6 py-3"><StatusBadge status={inv.status} /></td>
                      <td className="px-6 py-3">
                        <a href={`${API_URL}/admin/invoices/${inv.id}/pdf`} target="_blank" rel="noreferrer" className="text-navy/50 hover:text-navy">
                          <Download size={18} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {selectedId && <InvoiceDetailModal id={selectedId} onClose={() => setSelectedId(null)} onChanged={load} />}
    </AdminGuard>
  );
}

function InvoiceDetailModal({ id, onClose, onChanged }) {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    api.get(`/admin/invoices/${id}`).then((data) => setInvoice(data.invoice));
  }, [id]);

  async function markPaid() {
    await api.patch(`/admin/invoices/${id}/status`, { status: 'paid' });
    onChanged();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-navy/40 hover:text-navy"><X size={20} /></button>
        {!invoice ? <p className="text-navy/40">Loading...</p> : (
          <>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-xl text-navy">{invoice.invoice_number}</h2>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="text-navy/50 text-sm mb-6">{invoice.customer_name} · {invoice.customer_email}</p>

            <div className="space-y-2 text-sm mb-6">
              <Row label="Service" value={invoice.service_name} />
              <Row label="Appointment" value={`${new Date(invoice.appointment_date).toLocaleDateString('en-GB')} · ${invoice.time_slot}`} />
              <Row label="Subtotal" value={`£${invoice.subtotal}`} />
              <Row label="VAT" value={`£${invoice.vat_amount}`} />
              <Row label="Total" value={`£${invoice.total}`} bold />
              <Row label="Issue Date" value={new Date(invoice.issue_date).toLocaleDateString('en-GB')} />
              <Row label="Due Date" value={new Date(invoice.due_date).toLocaleDateString('en-GB')} />
            </div>

            <div className="flex gap-3">
              <a
                href={`${API_URL}/admin/invoices/${id}/pdf`} target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-navy text-white text-sm font-semibold py-3 rounded hover:bg-navy-light"
              >
                <Download size={16} /> Download PDF
              </a>
              {invoice.status !== 'paid' && (
                <button onClick={markPaid} className="flex-1 bg-gold text-navy text-sm font-semibold py-3 rounded hover:bg-gold-light">
                  Mark as Paid
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between border-b border-navy/5 pb-2">
      <span className="text-navy/50">{label}</span>
      <span className={`text-navy ${bold ? 'font-bold' : 'font-medium'}`}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-emerald-100 text-emerald-700',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-700',
  };
  return <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || ''}`}>{status}</span>;
}

function StatCard({ icon: Icon, label, value, color }) {
  const bg = { navy: 'bg-navy', gold: 'bg-gold', green: 'bg-emerald-600', red: 'bg-red-500' }[color] || 'bg-navy';
  return (
    <div className="bg-white rounded-xl p-5 border border-navy/5">
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4`}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="text-lg font-extrabold text-navy">{value}</p>
      <p className="text-navy/50 text-xs mt-1">{label}</p>
    </div>
  );
}
