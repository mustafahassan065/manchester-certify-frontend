'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Banknote, Clock } from 'lucide-react';

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState([]);
  const [totals, setTotals] = useState({ unpaid: 0, paid: 0 });
  const [status, setStatus] = useState('unpaid');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    const params = status ? `?status=${status}` : '';
    api.get(`/admin/payouts${params}`)
      .then((data) => { setPayouts(data.payouts); setTotals(data.totals); })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [status]);

  async function mark(id, paid) {
    await api.patch(`/admin/payouts/${id}/${paid ? 'mark-paid' : 'mark-unpaid'}`);
    load();
  }

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Assessor Payouts" />
          <main className="p-8">
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              <div className="bg-white rounded-xl p-5 border border-navy/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center"><Clock size={20} className="text-orange-600" /></div>
                <div>
                  <p className="text-2xl font-extrabold text-navy">£{totals.unpaid.toLocaleString()}</p>
                  <p className="text-navy/50 text-xs">Owed to assessors (unpaid)</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-navy/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center"><Banknote size={20} className="text-emerald-600" /></div>
                <div>
                  <p className="text-2xl font-extrabold text-navy">£{totals.paid.toLocaleString()}</p>
                  <p className="text-navy/50 text-xs">Paid to assessors</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              {[['unpaid', 'Unpaid'], ['paid', 'Paid'], ['', 'All']].map(([key, label]) => (
                <button key={label} onClick={() => setStatus(key)} className={`text-sm font-semibold px-4 py-2 rounded-lg ${status === key ? 'bg-navy text-white' : 'bg-white text-navy/60 border border-navy/10'}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-navy/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-navy/40 text-xs border-b border-navy/5 bg-navy/[0.02]">
                    <th className="text-left px-6 py-3 font-medium">Job</th>
                    <th className="text-left px-6 py-3 font-medium">Assessor</th>
                    <th className="text-left px-6 py-3 font-medium">Customer</th>
                    <th className="text-left px-6 py-3 font-medium">Date</th>
                    <th className="text-left px-6 py-3 font-medium">Fee</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={7} className="text-center py-10 text-navy/40">Loading...</td></tr>}
                  {!loading && payouts.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-navy/40">No completed jobs found.</td></tr>}
                  {payouts.map((p) => (
                    <tr key={p.id} className="border-b border-navy/5 last:border-0 hover:bg-navy/[0.02]">
                      <td className="px-6 py-3 text-navy font-medium">#{p.id} · {p.service_name}</td>
                      <td className="px-6 py-3 text-navy/70">{p.assessor_name}</td>
                      <td className="px-6 py-3 text-navy/70">{p.customer_name}</td>
                      <td className="px-6 py-3 text-navy/70">{new Date(p.appointment_date + 'T00:00:00').toLocaleDateString('en-GB')}</td>
                      <td className="px-6 py-3 text-navy font-semibold">£{Number(p.fee).toFixed(2)}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.assessor_paid_at ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                          {p.assessor_paid_at ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {p.assessor_paid_at ? (
                          <button onClick={() => mark(p.id, false)} className="text-xs font-semibold text-navy/50 hover:text-navy underline">Mark unpaid</button>
                        ) : (
                          <button onClick={() => mark(p.id, true)} className="text-xs font-bold bg-gold text-navy rounded px-3 py-1.5 hover:bg-gold-light">Mark Paid</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}