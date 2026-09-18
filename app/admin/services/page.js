'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [subModal, setSubModal] = useState(null); // { serviceId, sub? }
  const [pricingModal, setPricingModal] = useState(null); // { subServiceId, tier? }

  function load() {
    setLoading(true);
    api.get('/admin/services').then((data) => setServices(data.services)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function toggleExpand(id) {
    setExpanded((e) => ({ ...e, [id]: !e[id] }));
  }

  async function toggleService(id) { await api.patch(`/admin/services/${id}/toggle-active`); load(); }
  async function toggleSub(id) { await api.patch(`/admin/services/sub-services/${id}/toggle-active`); load(); }
  async function deleteSub(id) {
    if (!confirm('Delete this sub-service and all its pricing tiers?')) return;
    await api.del(`/admin/services/sub-services/${id}`); load();
  }
  async function togglePricing(id) { await api.patch(`/admin/services/pricing/${id}/toggle-active`); load(); }
  async function deletePricing(id) {
    if (!confirm('Delete this pricing tier?')) return;
    await api.del(`/admin/services/pricing/${id}`); load();
  }

  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-[#F7F8FA]">
          <AdminHeader title="Services & Pricing" />
          <main className="p-8">
            <p className="text-navy/50 text-sm mb-6">
              Our four core services are fixed. Add sub-service types and pricing tiers under each — these drive the booking form.
            </p>

            {loading && <p className="text-navy/40">Loading...</p>}

            <div className="space-y-5">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl border border-navy/5 overflow-hidden">
                  <button onClick={() => toggleExpand(service.id)} className="w-full flex items-center justify-between p-6 border-b border-navy/5 text-left">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-navy">{service.name}</h3>
                        <span className="text-xs font-bold text-gold-dark bg-gold/10 px-2 py-0.5 rounded">{service.code}</span>
                        {!service.is_active && <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">Inactive</span>}
                        <span className="text-xs text-navy/40">{service.subServices.length} type{service.subServices.length !== 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-navy/50 text-sm mt-1">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span onClick={(e) => { e.stopPropagation(); toggleService(service.id); }} className="text-navy/50 hover:text-navy cursor-pointer" title="Toggle active">
                        {service.is_active ? <ToggleRight size={24} className="text-emerald-600" /> : <ToggleLeft size={24} />}
                      </span>
                      {expanded[service.id] ? <ChevronUp size={18} className="text-navy/40" /> : <ChevronDown size={18} className="text-navy/40" />}
                    </div>
                  </button>

                  {expanded[service.id] && (
                    <div className="p-6 space-y-5">
                      <div className="flex justify-between items-center">
                        <p className="text-navy text-sm font-semibold">Sub-Services / Types</p>
                        <button onClick={() => setSubModal({ serviceId: service.id })} className="text-xs font-semibold text-gold-dark hover:underline flex items-center gap-1">
                          <Plus size={14} /> Add Type
                        </button>
                      </div>

                      {service.subServices.length === 0 && <p className="text-navy/30 text-sm">No sub-services yet — add one above.</p>}

                      {service.subServices.map((sub) => (
                        <div key={sub.id} className="border border-navy/10 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-navy text-sm">{sub.name}</p>
                              {!sub.is_active && <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">Inactive</span>}
                            </div>
                            <div className="flex items-center gap-3">
                              <button onClick={() => setSubModal({ serviceId: service.id, sub })} className="text-navy/40 hover:text-navy"><Pencil size={14} /></button>
                              <button onClick={() => toggleSub(sub.id)} className="text-navy/40 hover:text-navy">
                                {sub.is_active ? <ToggleRight size={18} className="text-emerald-600" /> : <ToggleLeft size={18} />}
                              </button>
                              <button onClick={() => deleteSub(sub.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-2">
                            <p className="text-navy/50 text-xs font-semibold">Pricing Tiers</p>
                            <button onClick={() => setPricingModal({ subServiceId: sub.id })} className="text-xs font-semibold text-gold-dark hover:underline">+ Add Tier</button>
                          </div>

                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {sub.pricing.map((tier) => (
                              <div key={tier.id} className={`border rounded-lg p-3 flex items-center justify-between ${tier.is_active ? 'border-navy/10' : 'border-red-100 bg-red-50/30'}`}>
                                <div>
                                  <p className="text-navy text-sm font-medium">{tier.label}</p>
                                  <p className="text-gold-dark font-bold">£{tier.price}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => setPricingModal({ subServiceId: sub.id, tier })} className="text-navy/40 hover:text-navy"><Pencil size={14} /></button>
                                  <button onClick={() => togglePricing(tier.id)} className="text-navy/40 hover:text-navy">
                                    {tier.is_active ? <ToggleRight size={18} className="text-emerald-600" /> : <ToggleLeft size={18} />}
                                  </button>
                                  <button onClick={() => deletePricing(tier.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                </div>
                              </div>
                            ))}
                            {sub.pricing.length === 0 && <p className="text-navy/30 text-xs">No pricing tiers yet.</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {subModal && <SubServiceModal data={subModal} onClose={() => setSubModal(null)} onSaved={() => { setSubModal(null); load(); }} />}
      {pricingModal && <PricingModal data={pricingModal} onClose={() => setPricingModal(null)} onSaved={() => { setPricingModal(null); load(); }} />}
    </AdminGuard>
  );
}

function SubServiceModal({ data, onClose, onSaved }) {
  const isEdit = !!data.sub;
  const [form, setForm] = useState({ name: data.sub?.name || '', description: data.sub?.description || '', displayOrder: data.sub?.display_order || 0 });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (isEdit) await api.put(`/admin/services/sub-services/${data.sub.id}`, form);
      else await api.post(`/admin/services/${data.serviceId}/sub-services`, form);
      onSaved();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl max-w-md w-full p-8 relative space-y-4">
        <button type="button" onClick={onClose} className="absolute top-6 right-6 text-navy/40 hover:text-navy"><X size={20} /></button>
        <h2 className="font-bold text-xl text-navy mb-2">{isEdit ? 'Edit Type' : 'Add Type'}</h2>
        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">NAME</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Domestic EPC" className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">DESCRIPTION</label>
          <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-navy/15 rounded px-4 py-3 text-sm resize-none" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={saving} className="w-full bg-navy text-white font-bold text-sm py-3 rounded hover:bg-navy-light disabled:opacity-50">
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Type'}
        </button>
      </form>
    </div>
  );
}

function PricingModal({ data, onClose, onSaved }) {
  const isEdit = !!data.tier;
  const [form, setForm] = useState({ label: data.tier?.label || '', price: data.tier?.price || '', displayOrder: data.tier?.display_order || 0 });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (isEdit) await api.put(`/admin/services/pricing/${data.tier.id}`, form);
      else await api.post(`/admin/services/sub-services/${data.subServiceId}/pricing`, form);
      onSaved();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl max-w-sm w-full p-8 relative space-y-4">
        <button type="button" onClick={onClose} className="absolute top-6 right-6 text-navy/40 hover:text-navy"><X size={20} /></button>
        <h2 className="font-bold text-xl text-navy mb-2">{isEdit ? 'Edit Pricing Tier' : 'Add Pricing Tier'}</h2>
        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">LABEL</label>
          <input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. 3 Bedrooms" className="w-full border border-navy/15 rounded px-4 py-3 text-sm" />
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