'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Save, Plus, Trash2 } from 'lucide-react';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AdminSettingsPage() {
  const [form, setForm] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlock, setNewBlock] = useState({ date: '', reason: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function load() {
    api.get('/admin/settings').then((data) => {
      setForm({
        workingDays: data.settings.working_days,
        startTime: data.settings.start_time,
        endTime: data.settings.end_time,
        slotDurationMinutes: data.settings.slot_duration_minutes,
        businessName: data.settings.business_name,
        businessEmail: data.settings.business_email,
        businessPhone: data.settings.business_phone,
      });
      setBlockedDates(data.blockedDates);
    });
  }

  useEffect(() => { load(); }, []);

  function toggleDay(day) {
    const days = form.workingDays.split(',').filter(Boolean);
    const updated = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    setForm({ ...form, workingDays: updated.join(',') });
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await api.put('/admin/settings', form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleAddBlock() {
    if (!newBlock.date) return;
    await api.post('/admin/settings/blocked-dates', newBlock);
    setNewBlock({ date: '', reason: '' });
    load();
  }

  async function handleRemoveBlock(id) {
    await api.del(`/admin/settings/blocked-dates/${id}`);
    load();
  }

  if (!form) return null;

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Settings" />
          <main className="p-8 max-w-3xl space-y-6">
            {/* Business Info */}
            <div className="bg-white rounded-xl border border-navy/5 p-6">
              <h3 className="font-bold text-navy mb-5">Business Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-navy text-xs font-bold tracking-wide mb-2">BUSINESS NAME</label>
                  <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-navy text-xs font-bold tracking-wide mb-2">PHONE</label>
                  <input value={form.businessPhone} onChange={(e) => setForm({ ...form, businessPhone: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-2.5 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-navy text-xs font-bold tracking-wide mb-2">EMAIL</label>
                  <input value={form.businessEmail} onChange={(e) => setForm({ ...form, businessEmail: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-2.5 text-sm" />
                </div>
              </div>
            </div>

            {/* Working Hours — drives auto-generated slots */}
            <div className="bg-white rounded-xl border border-navy/5 p-6">
              <h3 className="font-bold text-navy mb-1">Working Hours</h3>
              <p className="text-navy/40 text-xs mb-5">These settings control the appointment slots shown on the booking page.</p>

              <div className="mb-5">
                <label className="block text-navy text-xs font-bold tracking-wide mb-2">WORKING DAYS</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_DAYS.map((day) => {
                    const active = form.workingDays.split(',').includes(day);
                    return (
                      <button
                        key={day} onClick={() => toggleDay(day)}
                        className={`text-sm font-semibold px-4 py-2 rounded-lg border ${active ? 'bg-navy text-white border-navy' : 'text-navy/50 border-navy/15'}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-navy text-xs font-bold tracking-wide mb-2">START TIME</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-navy text-xs font-bold tracking-wide mb-2">END TIME</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-navy text-xs font-bold tracking-wide mb-2">SLOT LENGTH (MIN)</label>
                  <select value={form.slotDurationMinutes} onChange={(e) => setForm({ ...form, slotDurationMinutes: Number(e.target.value) })} className="w-full border border-navy/15 rounded px-4 py-2.5 text-sm">
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Blocked Dates */}
            <div className="bg-white rounded-xl border border-navy/5 p-6">
              <h3 className="font-bold text-navy mb-1">Blocked Dates</h3>
              <p className="text-navy/40 text-xs mb-5">Block specific dates (holidays, leave) to remove them from booking availability.</p>

              <div className="flex gap-2 mb-5">
                <input type="date" value={newBlock.date} onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })} className="border border-navy/15 rounded px-4 py-2.5 text-sm" />
                <input value={newBlock.reason} onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })} placeholder="Reason (optional)" className="flex-1 border border-navy/15 rounded px-4 py-2.5 text-sm" />
                <button onClick={handleAddBlock} className="flex items-center gap-2 bg-navy text-white text-sm font-semibold px-4 rounded-lg hover:bg-navy-light">
                  <Plus size={16} /> Block
                </button>
              </div>

              <div className="space-y-2">
                {blockedDates.length === 0 && <p className="text-navy/40 text-sm">No blocked dates.</p>}
                {blockedDates.map((b) => (
                  <div key={b.id} className="flex items-center justify-between border border-navy/10 rounded-lg px-4 py-2.5">
                    <div>
                      <span className="text-navy font-medium text-sm">{new Date(b.blocked_date).toLocaleDateString('en-GB')}</span>
                      {b.reason && <span className="text-navy/40 text-xs ml-2">— {b.reason}</span>}
                    </div>
                    <button onClick={() => handleRemoveBlock(b.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-gold text-navy font-bold text-sm px-6 py-3 rounded-lg hover:bg-gold-light disabled:opacity-50"
            >
              <Save size={16} /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
            </button>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}