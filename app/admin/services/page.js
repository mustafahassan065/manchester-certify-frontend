'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddService, setShowAddService] = useState(false);
  const [pricingModal, setPricingModal] = useState(null); // { serviceId, tier? }

  function load() {
    setLoading(true);
    api.get('/admin/services').then((data) => setServices(data.services)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function toggleService(id) {
    await api.patch(`/admin/services/${id}/toggle-active`);
    load();
  }

  async function deleteService(id) {
    if (!confirm('Delete this service and all its pricing tiers?')) return;
    await api.del(`/admin/services/${id}`);
    load();
  }

  async function togglePricing(pricingId) {
    await api.patch(`/admin/services/pricing/${pricingId}/toggle-active`);
    load();
  }

  async function deletePricing(pricingId) {
    if (!confirm('Delete this pricing tier?')) return;
    await api.del(`/admin/services/pricing/${pricingId}`);
    load();
  }

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Services & Pricing" />
          <main className="p-8">
            <div className="flex justify-between items-center mb-6">
              <p className="text-navy/50 text-sm">Manage the services and pricing shown on the booking form.</p>
              <button onClick={() => setShowAddService(true)} className="flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-navy-light">
                <Plus size={16} /> Add Service
              </button>
            </div>

            {loading && <p className="text-navy/40">Loading...</p>}

            <div className="space-y-5">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl border border-navy/5 overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-navy/5">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-navy">{service.name}</h3>
                        <span className="text-xs font-bold text-gold-dark bg-gold/10 px-2 py-0.5 rounded">{service.code}</span>
                        {!service.is_active && <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">Inactive</span>}
                      </div>
                      <p className="text-navy/50 text-sm mt-1">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleService(service.id)} className="text-navy/50 hover:text-navy" title="Toggle active">
                        {service.is_active ? <ToggleRight size={26} className="text-emerald-600" /> : <ToggleLeft size={26} />}
                      </button>
                      <button onClick={() => deleteService(service.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-navy text-sm font-semibold">Pricing Tiers</p>
                      <button
                        onClick={() => setPricingModal({ serviceId: service.id })}
                        className="text-xs font-semibold text-gold-dark hover:underline"
                      >
                        + Add Tier
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {service.pricing.map((tier) => (
                        <div key={tier.id} className={`border rounded-lg p-3 flex items-center justify-between ${tier.is_active ? 'border-navy/10' : 'border-red-100 bg-red-50/30'}`}>
                          <div>
                            <p className="text-navy text-sm font-medium">{tier.label}</p>
                            <p className="text-gold-dark font-bold">£{tier.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setPricingModal({ serviceId: service.id, tier })} className="text-navy/40 hover:text-navy">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => togglePricing(tier.id)} className="text-navy/40 hover:text-navy">
                              {tier.is_active ? <ToggleRight size={18} className="text-emerald-600" /> : <ToggleLeft size={18} />}
                            </button>
                            <button onClick={() => deletePricing(tier.id)} className="text-red-400 hover:text-red-600">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {service.pricing.length === 0 && <p className="text-navy/30 text-sm">No pricing tiers yet.</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {showAddService && <AddServiceModal onClose={() => setShowAddService(false)} onSaved={() => { setShowAddService(false); load(); }} />}
      {pricingModal && <PricingModal data={pricingModal} onClose={() => setPricingModal(null)} onSaved={() => { setPricingModal(null); load(); }} />}
    </AdminGuard>
  );
}

function AddServiceModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', code: '', description: '', displayOrder: 0 });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/admin/services', form);
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
        <h2 className="font-bold text-xl text-navy mb-2">Add Service</h2>

        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">SERVICE NAME</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Legionella Risk Assessment" className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">CODE</label>
          <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. LEGIONELLA" className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">DESCRIPTION</label>
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm resize-none" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={saving} className="w-full bg-navy text-white font-bold text-sm py-3 rounded hover:bg-navy-light disabled:opacity-50">
          {saving ? 'Saving...' : 'Add Service'}
        </button>
      </form>
    </div>
  );
}

function PricingModal({ data, onClose, onSaved }) {
  const isEdit = !!data.tier;
  const [form, setForm] = useState({
    label: data.tier?.label || '',
    price: data.tier?.price || '',
    displayOrder: data.tier?.display_order || 0,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await api.put(`/admin/services/pricing/${data.tier.id}`, form);
      } else {
        await api.post(`/admin/services/${data.serviceId}/pricing`, form);
      }
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
        <h2 className="font-bold text-xl text-navy mb-2">{isEdit ? 'Edit Pricing Tier' : 'Add Pricing Tier'}</h2>

        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">LABEL</label>
          <input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. 3 Bedrooms / Standard" className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">PRICE (£)</label>
          <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={saving} className="w-full bg-navy text-white font-bold text-sm py-3 rounded hover:bg-navy-light disabled:opacity-50">
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Tier'}
        </button>
      </form>
    </div>
  );
}