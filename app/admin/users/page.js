'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Plus, ToggleLeft, ToggleRight, Key, Trash2, X } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);

  function load() {
    api.get('/admin/users').then((data) => setUsers(data.users));
  }

  useEffect(() => { load(); }, []);

  async function toggleActive(id) {
    try {
      await api.patch(`/admin/users/${id}/toggle-active`);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this admin account?')) return;
    try {
      await api.del(`/admin/users/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Admin Users" />
          <main className="p-8">
            <div className="flex justify-between items-center mb-6">
              <p className="text-navy/50 text-sm">Manage who has administrator access to this portal.</p>
              <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-navy-light">
                <Plus size={16} /> Add Admin
              </button>
            </div>

            <div className="bg-white rounded-xl border border-navy/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-navy/40 text-xs border-b border-navy/5 bg-navy/[0.02]">
                    <th className="text-left px-6 py-3 font-medium">Name</th>
                    <th className="text-left px-6 py-3 font-medium">Email</th>
                    <th className="text-left px-6 py-3 font-medium">Role</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-navy/5 last:border-0">
                      <td className="px-6 py-3 text-navy font-medium">{u.name}</td>
                      <td className="px-6 py-3 text-navy/70">{u.email}</td>
                      <td className="px-6 py-3">
                        <span className="text-xs font-bold text-gold-dark bg-gold/10 px-2 py-1 rounded capitalize">{u.role.replace('_', ' ')}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggleActive(u.id)} title="Toggle active">
                            {u.is_active ? <ToggleRight size={20} className="text-emerald-600" /> : <ToggleLeft size={20} className="text-navy/40" />}
                          </button>
                          <button onClick={() => setResetTarget(u)} title="Reset password" className="text-navy/40 hover:text-navy">
                            <Key size={16} />
                          </button>
                          <button onClick={() => handleDelete(u.id)} title="Delete" className="text-red-400 hover:text-red-600">
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

      {showAdd && <AddAdminModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />}
      {resetTarget && <ResetPasswordModal user={resetTarget} onClose={() => setResetTarget(null)} onSaved={() => setResetTarget(null)} />}
    </AdminGuard>
  );
}

function AddAdminModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/admin/users', form);
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
        <h2 className="font-bold text-xl text-navy mb-2">Add Admin User</h2>

        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm">
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={saving} className="w-full bg-navy text-white font-bold text-sm py-3 rounded hover:bg-navy-light disabled:opacity-50">
          {saving ? 'Creating...' : 'Create Admin'}
        </button>
      </form>
    </div>
  );
}

function ResetPasswordModal({ user, onClose, onSaved }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.patch(`/admin/users/${user.id}/password`, { password });
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
        <p className="text-navy/50 text-sm mb-2">For {user.name}</p>
        <input required type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={saving} className="w-full bg-navy text-white font-bold text-sm py-3 rounded hover:bg-navy-light disabled:opacity-50">
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}