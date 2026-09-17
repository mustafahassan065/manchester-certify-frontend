'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Download, TrendingUp, Calendar, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function defaultRange() {
  const to = new Date().toISOString().split('T')[0];
  const from = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  return { from, to };
}

export default function AdminReportsPage() {
  const [range, setRange] = useState(defaultRange());
  const [tab, setTab] = useState('revenue');
  const [revenue, setRevenue] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [invoices, setInvoices] = useState(null);

  useEffect(() => {
    api.get(`/admin/reports/revenue?from=${range.from}&to=${range.to}`).then(setRevenue);
    api.get(`/admin/reports/appointments?from=${range.from}&to=${range.to}`).then(setAppointments);
    api.get(`/admin/reports/invoices?from=${range.from}&to=${range.to}`).then(setInvoices);
  }, [range]);

  function exportCSV(type) {
    const token = localStorage.getItem('admin_token');
    window.open(`${API_URL}/admin/reports/export?type=${type}&from=${range.from}&to=${range.to}&token=${token}`, '_blank');
  }

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Reports" />
          <main className="p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 bg-white border border-navy/10 rounded-lg px-4 py-2.5">
                <Calendar size={16} className="text-navy/40" />
                <input type="date" value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} className="text-sm outline-none" />
                <span className="text-navy/30">to</span>
                <input type="date" value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} className="text-sm outline-none" />
              </div>

              <div className="flex gap-2">
                {['revenue', 'appointments', 'invoices'].map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`text-sm font-semibold px-4 py-2 rounded-lg capitalize ${tab === t ? 'bg-navy text-white' : 'bg-white text-navy/60 border border-navy/10'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {tab === 'revenue' && revenue && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <StatBox icon={TrendingUp} label="Total Revenue" value={`£${revenue.totalRevenue.toLocaleString()}`} />
                  <StatBox icon={FileText} label="Transactions" value={revenue.totalTransactions} />
                </div>
                <div className="bg-white rounded-xl p-6 border border-navy/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-navy">Revenue Over Time</h3>
                    <button onClick={() => exportCSV('revenue')} className="flex items-center gap-2 text-sm text-navy/60 hover:text-navy"><Download size={16} /> Export CSV</button>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={revenue.daily}>
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#032046" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl p-6 border border-navy/5">
                  <h3 className="font-bold text-navy mb-4">By Payment Method</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {revenue.byMethod.map((m) => (
                      <div key={m.method} className="border border-navy/10 rounded-lg p-4">
                        <p className="text-navy/50 text-xs capitalize">{m.method.replace('_', ' ')}</p>
                        <p className="text-xl font-bold text-navy">£{m.total}</p>
                        <p className="text-navy/40 text-xs">{m.count} transactions</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'appointments' && appointments && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <StatBox icon={Calendar} label="Total Appointments" value={appointments.completionRate.total} />
                  <StatBox icon={TrendingUp} label="Completed" value={appointments.completionRate.completed} />
                </div>
                <div className="bg-white rounded-xl p-6 border border-navy/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-navy">Appointments by Service</h3>
                    <button onClick={() => exportCSV('appointments')} className="flex items-center gap-2 text-sm text-navy/60 hover:text-navy"><Download size={16} /> Export CSV</button>
                  </div>
                  <div className="space-y-3">
                    {appointments.byService.map((s) => (
                      <div key={s.code} className="flex justify-between items-center border-b border-navy/5 pb-2">
                        <span className="text-navy">{s.name}</span>
                        <span className="text-navy/60 text-sm">{s.count} bookings · £{s.revenue}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-navy/5">
                  <h3 className="font-bold text-navy mb-4">By Status</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {appointments.byStatus.map((s) => (
                      <div key={s.status} className="border border-navy/10 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-navy">{s.count}</p>
                        <p className="text-navy/40 text-xs capitalize">{s.status.replace('_', ' ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'invoices' && invoices && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-navy/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-navy">Invoices by Status</h3>
                    <button onClick={() => exportCSV('invoices')} className="flex items-center gap-2 text-sm text-navy/60 hover:text-navy"><Download size={16} /> Export CSV</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {invoices.byStatus.map((s) => (
                      <div key={s.status} className="border border-navy/10 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-navy">£{s.total}</p>
                        <p className="text-navy/40 text-xs capitalize">{s.status} ({s.count})</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-navy/5">
                  <h3 className="font-bold text-navy mb-4">Overdue Invoices</h3>
                  {invoices.overdueList.length === 0 ? (
                    <p className="text-navy/40 text-sm">No overdue invoices in this period.</p>
                  ) : (
                    <div className="space-y-2">
                      {invoices.overdueList.map((inv) => (
                        <div key={inv.invoice_number} className="flex justify-between text-sm border-b border-navy/5 pb-2">
                          <span className="text-navy">{inv.invoice_number} — {inv.customer_name}</span>
                          <span className="text-red-600 font-semibold">£{inv.total} · Due {new Date(inv.due_date).toLocaleDateString('en-GB')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}

function StatBox({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-navy/5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-navy flex items-center justify-center">
        <Icon size={20} className="text-gold" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-navy">{value}</p>
        <p className="text-navy/50 text-xs">{label}</p>
      </div>
    </div>
  );
}