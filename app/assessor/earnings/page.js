'use client';

import { useEffect, useState } from 'react';
import AssessorShell from '@/components/assessor/AssessorShell';
import { api } from '@/lib/api';
import { Wallet, CheckCircle2, Clock, BadgeCheck, Download } from 'lucide-react';

export default function AssessorEarningsPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/assessor/earnings?month=${month}`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [month]);

  function downloadStatement() {
    if (!data) return;
    const rows = [
      ['Date', 'Job', 'Amount (GBP)', 'Status'],
      ...data.transactions.map((t) => [t.appointment_date, t.service_name, Number(t.amount).toFixed(2), t.payment_status]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AssessorShell title="Earnings">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-navy">My Earnings</h2>
          <p className="text-navy/50 text-sm">Track your income, payments and pending earnings.</p>
        </div>
        <input
          type="month" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)}
          className="bg-white border border-navy/10 rounded-lg px-4 py-2.5 text-sm"
        />
      </div>

      {loading && !data && <p className="text-navy/40">Loading...</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            <Stat icon={Wallet} tone="emerald" label="Total Earned" value={`£${data.summary.totalEarned.toLocaleString()}`} />
            <Stat icon={CheckCircle2} tone="blue" label="Completed Jobs" value={data.summary.completedJobs} />
            <Stat icon={Clock} tone="orange" label="Pending" value={`£${data.summary.pending.toLocaleString()}`} />
            <Stat icon={BadgeCheck} tone="emerald" label="Paid" value={`£${data.summary.paid.toLocaleString()}`} />
          </div>

          <div className="grid lg:grid-cols-[1.8fr_1fr] gap-6">
            <div className="bg-white rounded-xl border border-navy/5 overflow-hidden">
              <div className="p-6 border-b border-navy/5">
                <h3 className="font-bold text-navy">Recent Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-navy/40 text-xs border-b border-navy/5 bg-navy/[0.02]">
                      <th className="text-left px-6 py-3 font-medium">Date</th>
                      <th className="text-left px-6 py-3 font-medium">Job Type</th>
                      <th className="text-left px-6 py-3 font-medium">Amount</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.length === 0 && (
                      <tr><td colSpan={4} className="text-center py-10 text-navy/40">No completed jobs in this period.</td></tr>
                    )}
                    {data.transactions.map((t) => (
                      <tr key={t.id} className="border-b border-navy/5 last:border-0">
                        <td className="px-6 py-3 text-navy/70">{new Date(t.appointment_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="px-6 py-3 text-navy font-medium">{t.service_name}</td>
                        <td className="px-6 py-3 text-navy font-semibold">£{Number(t.amount).toFixed(2)}</td>
                        <td className="px-6 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                            {t.payment_status === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-navy/5 p-6 self-start">
              <h3 className="font-bold text-navy mb-1">Payment History</h3>
              <p className="text-navy/40 text-xs mb-5">Download your earnings for the selected month.</p>
              <button onClick={downloadStatement} disabled={data.transactions.length === 0} className="w-full flex items-center justify-center gap-2 border border-navy/15 rounded-lg px-4 py-3 text-sm font-semibold text-navy hover:border-navy/40 disabled:opacity-40">
                <Download size={16} /> Download Statement (CSV)
              </button>
              <p className="text-navy/40 text-xs mt-4 leading-relaxed">
                Earnings show as <strong>Pending</strong> until the office marks the payment as paid.
              </p>
            </div>
          </div>
        </>
      )}
    </AssessorShell>
  );
}

function Stat({ icon: Icon, label, value, tone }) {
  const tones = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
  };
  return (
    <div className="bg-white rounded-xl p-5 border border-navy/5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${tones[tone]}`}>
        <Icon size={18} />
      </div>
      <p className="text-navy/50 text-xs mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-navy">{value}</p>
    </div>
  );
}