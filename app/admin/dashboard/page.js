'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import {
  Calendar, CalendarCheck, CheckCircle2, FileText, Banknote, TrendingUp,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#032046', '#D69C4D', '#0A3466', '#B8B8B8'];

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Dashboard" />
          <main className="p-8">
            <p className="text-navy/50 mb-6">Here's what's happening with your business today.</p>

            {error && <p className="text-red-600 mb-4">{error}</p>}
            {!data && !error && <p className="text-navy/40">Loading...</p>}

            {data && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                  <StatCard icon={Calendar} label="Total Appointments" value={data.stats.totalAppointments} color="navy" />
                  <StatCard icon={CalendarCheck} label="Upcoming Appointments" value={data.stats.upcomingAppointments} color="gold" />
                  <StatCard icon={CheckCircle2} label="Completed" value={data.stats.completedAppointments} color="green" />
                  <StatCard icon={Banknote} label="Total Revenue" value={`£${data.stats.totalRevenue.toLocaleString()}`} color="navy" />
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-navy/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-navy">Revenue Overview</h3>
                      <TrendingUp size={18} className="text-gold-dark" />
                    </div>
                    {data.revenueOverview.length === 0 ? (
                      <p className="text-navy/40 text-sm py-16 text-center">No revenue data yet.</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={data.revenueOverview}>
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="amount" stroke="#032046" strokeWidth={2} dot={{ fill: '#D69C4D' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-navy/5">
                    <h3 className="font-bold text-navy mb-4">Appointments by Service</h3>
                    {data.appointmentsByService.length === 0 ? (
                      <p className="text-navy/40 text-sm py-16 text-center">No data yet.</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={data.appointmentsByService} dataKey="count" nameKey="name" innerRadius={50} outerRadius={80}>
                            {data.appointmentsByService.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-xl border border-navy/5 overflow-hidden">
                    <div className="p-6 border-b border-navy/5">
                      <h3 className="font-bold text-navy">Recent Appointments</h3>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-navy/40 text-xs border-b border-navy/5">
                          <th className="text-left px-6 py-3 font-medium">Customer</th>
                          <th className="text-left px-6 py-3 font-medium">Service</th>
                          <th className="text-left px-6 py-3 font-medium">Date</th>
                          <th className="text-left px-6 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentAppointments.map((a) => (
                          <tr key={a.id} className="border-b border-navy/5 last:border-0">
                            <td className="px-6 py-3">
                              <p className="text-navy font-medium">{a.customer_name}</p>
                              <p className="text-navy/40 text-xs">{a.customer_email}</p>
                            </td>
                            <td className="px-6 py-3 text-navy/70">{a.service_name}</td>
                            <td className="px-6 py-3 text-navy/70">{a.appointment_date}</td>
                            <td className="px-6 py-3"><StatusBadge status={a.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-navy/5">
                    <h3 className="font-bold text-navy mb-4">Invoice Summary</h3>
                    <div className="space-y-3 text-sm">
                      <SummaryLine label="Total Invoices" value={data.stats.invoiceSummary.total} />
                      <SummaryLine label="Paid" value={`${data.stats.invoiceSummary.paid.count} · £${data.stats.invoiceSummary.paid.total}`} color="green" />
                      <SummaryLine label="Pending" value={`${data.stats.invoiceSummary.pending.count} · £${data.stats.invoiceSummary.pending.total}`} color="gold" />
                      <SummaryLine label="Overdue" value={`${data.stats.invoiceSummary.overdue.count} · £${data.stats.invoiceSummary.overdue.total}`} color="red" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const bg = { navy: 'bg-navy', gold: 'bg-gold', green: 'bg-emerald-600' }[color] || 'bg-navy';
  return (
    <div className="bg-white rounded-xl p-5 border border-navy/5">
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4`}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="text-2xl font-extrabold text-navy">{value}</p>
      <p className="text-navy/50 text-xs mt-1">{label}</p>
    </div>
  );
}

function SummaryLine({ label, value, color }) {
  const textColor = { green: 'text-emerald-600', gold: 'text-gold-dark', red: 'text-red-600' }[color] || 'text-navy';
  return (
    <div className="flex items-center justify-between">
      <span className="text-navy/60">{label}</span>
      <span className={`font-semibold ${textColor}`}>{value}</span>
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