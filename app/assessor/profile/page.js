'use client';

import { useEffect, useState } from 'react';
import AssessorShell from '@/components/assessor/AssessorShell';
import { api } from '@/lib/api';
import {
  Mail, Phone, FileText, Award, ShieldCheck, Plus, Trash2, X, Upload, Pencil, KeyRound, MapPin, Car, BadgeCheck,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_ORIGIN = API_URL.replace('/api', '');

const DISTANCES = [5, 10, 15, 25, 50, 100];

const SUGGESTIONS = {
  qualification: ['EPC (Domestic)', 'EPC (Commercial)', 'EICR', 'Floor Plans', 'Air Testing'],
  document: ['ID / Passport', 'Professional Indemnity Insurance', 'DBS Certificate', 'Public Liability Insurance'],
};

const inputCls = 'w-full border border-navy/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold';

function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AssessorProfilePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [addCategory, setAddCategory] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function load() {
    api.get('/assessor/profile').then(setData).catch((e) => setError(e.message));
  }
  useEffect(() => { load(); }, []);

  async function removeDoc(id) {
    if (!confirm('Delete this document?')) return;
    await api.del(`/assessor/documents/${id}`);
    load();
  }

  if (error) return <AssessorShell title="My Profile"><p className="text-red-600">{error}</p></AssessorShell>;
  if (!data) return <AssessorShell title="My Profile"><p className="text-navy/40">Loading...</p></AssessorShell>;

  const { profile, documents } = data;
  const qualifications = documents.filter((d) => d.category === 'qualification');
  const otherDocs = documents.filter((d) => d.category === 'document');
  const areas = (profile.postcode_areas || '').split(',').filter(Boolean);

  return (
    <AssessorShell title="My Profile">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-navy">My Profile</h2>
        <p className="text-navy/50 text-sm">Manage your profile, qualifications and availability.</p>
      </div>

      <div className="grid lg:grid-cols-[1.7fr_1fr] gap-6">
        <div className="space-y-6">
          {/* Header card */}
          <div className="bg-white rounded-xl border border-navy/5 p-6 flex flex-wrap items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-navy text-gold flex items-center justify-center text-2xl font-extrabold">
              {profile.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-extrabold text-navy">{profile.name}</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${profile.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {profile.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-navy/50 text-sm">Manchester Certify Assessor{profile.specialization ? ` · ${profile.specialization}` : ''}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-navy/60 text-sm mt-2">
                <span className="flex items-center gap-1.5"><Mail size={14} /> {profile.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={14} /> {profile.phone || 'No phone added'}</span>
              </div>
            </div>
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-sm font-semibold border border-navy/15 rounded-lg px-4 py-2.5 hover:border-navy/40">
              <Pencil size={14} /> Edit Profile
            </button>
          </div>

          {/* Qualifications */}
          <DocSection
            title="Qualifications" icon={Award} addLabel="Add Qualification" items={qualifications}
            emptyText="No qualifications added yet." onAdd={() => setAddCategory('qualification')} onRemove={removeDoc}
          />

          {/* Documents */}
          <DocSection
            title="Documents" icon={FileText} addLabel="Add Document" items={otherDocs}
            emptyText="No documents uploaded yet. Add your ID, insurance and DBS certificate." onAdd={() => setAddCategory('document')} onRemove={removeDoc}
          />
        </div>

        <div className="space-y-6 self-start">
          <div className="bg-white rounded-xl border border-navy/5 p-6">
            <h3 className="font-bold text-navy flex items-center gap-2 mb-4"><MapPin size={16} className="text-navy/50" /> Areas I Cover</h3>
            {areas.length === 0 ? (
              <p className="text-navy/40 text-sm">No postcode areas set. Use Edit Profile to add them.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {areas.map((a) => <span key={a} className="text-sm font-semibold text-navy bg-navy/5 rounded-lg px-3 py-1.5">{a}</span>)}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-navy/5 p-6">
            <h3 className="font-bold text-navy flex items-center gap-2 mb-3"><Car size={16} className="text-navy/50" /> Max Travel Distance</h3>
            <p className="text-3xl font-extrabold text-navy">{profile.max_distance_miles || 25} <span className="text-base font-semibold text-navy/50">miles</span></p>
            {profile.standard_rate && (
              <p className="text-navy/50 text-sm mt-4 pt-4 border-t border-navy/5">
                Standard rate: <strong className="text-navy">£{Number(profile.standard_rate).toFixed(2)}</strong>
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-navy/5 p-6">
            <h3 className="font-bold text-navy flex items-center gap-2 mb-3"><ShieldCheck size={16} className="text-navy/50" /> Security</h3>
            <button onClick={() => setShowPassword(true)} className="w-full flex items-center justify-center gap-2 border border-navy/15 rounded-lg px-4 py-3 text-sm font-semibold text-navy hover:border-navy/40">
              <KeyRound size={16} /> Change Password
            </button>
          </div>
        </div>
      </div>

      {addCategory && <AddDocumentModal category={addCategory} onClose={() => setAddCategory(null)} onSaved={() => { setAddCategory(null); load(); }} />}
      {editing && <EditProfileModal profile={profile} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); load(); }} />}
      {showPassword && <PasswordModal onClose={() => setShowPassword(false)} />}
    </AssessorShell>
  );
}

function DocSection({ title, icon: Icon, addLabel, items, emptyText, onAdd, onRemove }) {
  return (
    <div className="bg-white rounded-xl border border-navy/5 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-navy flex items-center gap-2"><Icon size={16} className="text-navy/50" /> {title}</h3>
        <button onClick={onAdd} className="flex items-center gap-1.5 text-xs font-bold text-gold-dark hover:underline">
          <Plus size={14} /> {addLabel}
        </button>
      </div>

      {items.length === 0 && <p className="text-navy/40 text-sm">{emptyText}</p>}

      <div className="divide-y divide-navy/5">
        {items.map((d) => (
          <div key={d.id} className="py-4 flex flex-wrap items-center gap-4 first:pt-0 last:pb-0">
            <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
              <BadgeCheck size={18} className="text-navy/50" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-navy font-semibold text-sm">{d.document_type}</p>
              <p className="text-navy/40 text-xs">
                {d.reference_number ? `Ref: ${d.reference_number}` : ''}
                {d.reference_number && d.expiry_date ? ' · ' : ''}
                {d.expiry_date ? `Valid until ${fmtDate(d.expiry_date)}` : ''}
                {!d.reference_number && !d.expiry_date ? 'No expiry date' : ''}
              </p>
            </div>
            <DocStatus status={d.status} />
            <a href={`${BACKEND_ORIGIN}${d.file_path}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-navy/60 hover:text-navy underline">View</a>
            <button onClick={() => onRemove(d.id)} className="text-red-400 hover:text-red-600" title="Delete"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocStatus({ status }) {
  const config = {
    valid: ['bg-emerald-100 text-emerald-700', 'Valid'],
    expiring_soon: ['bg-yellow-100 text-yellow-700', 'Expiring soon'],
    expired: ['bg-red-100 text-red-700', 'Expired'],
  }[status] || ['bg-gray-100 text-gray-700', status];
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${config[0]}`}>{config[1]}</span>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 text-navy/40 hover:text-navy"><X size={20} /></button>
        <h2 className="font-bold text-xl text-navy mb-5">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function AddDocumentModal({ category, onClose, onSaved }) {
  const [documentType, setDocumentType] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!file) return setError('Please choose a file to upload.');
    setSaving(true);
    try {
      const form = new FormData();
      form.append('category', category);
      form.append('documentType', documentType);
      form.append('referenceNumber', referenceNumber);
      form.append('expiryDate', expiryDate);
      form.append('file', file);
      await api.postForm('/assessor/documents', form);
      onSaved();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  const listId = `suggestions-${category}`;

  return (
    <Modal title={category === 'qualification' ? 'Add Qualification' : 'Add Document'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">{category === 'qualification' ? 'QUALIFICATION' : 'DOCUMENT'} NAME</label>
          <input required list={listId} value={documentType} onChange={(e) => setDocumentType(e.target.value)} placeholder="Choose or type a name" className={inputCls} />
          <datalist id={listId}>{SUGGESTIONS[category].map((s) => <option key={s} value={s} />)}</datalist>
        </div>

        {category === 'qualification' && (
          <div>
            <label className="block text-navy text-xs font-bold tracking-wide mb-2">ACCREDITATION / REFERENCE NUMBER (optional)</label>
            <input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} className={inputCls} />
          </div>
        )}

        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">EXPIRY DATE (optional)</label>
          <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className={inputCls} />
        </div>

        <label className="flex items-center gap-3 border border-dashed border-navy/25 rounded-lg px-4 py-4 cursor-pointer hover:border-gold transition-colors">
          <Upload size={18} className="text-navy/40 shrink-0" />
          <span className="text-sm text-navy/60 truncate">{file ? file.name : 'Click to upload (PDF, Word, JPG, PNG — max 10MB)'}</span>
          <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files[0] || null)} className="hidden" />
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={saving} className="w-full bg-navy text-white font-bold text-sm py-3 rounded-lg hover:bg-navy-light disabled:opacity-50">
          {saving ? 'Uploading...' : 'Save'}
        </button>
      </form>
    </Modal>
  );
}

function EditProfileModal({ profile, onClose, onSaved }) {
  const [phone, setPhone] = useState(profile.phone || '');
  const [postcodeAreas, setPostcodeAreas] = useState(profile.postcode_areas || '');
  const [maxDistanceMiles, setMaxDistanceMiles] = useState(profile.max_distance_miles || 25);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put('/assessor/profile', { phone, postcodeAreas, maxDistanceMiles });
      onSaved();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">PHONE</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">POSTCODE AREAS I COVER</label>
          <input value={postcodeAreas} onChange={(e) => setPostcodeAreas(e.target.value)} placeholder="e.g. M, BL, SK, OL" className={inputCls} />
          <p className="text-navy/40 text-xs mt-1.5">Prefix codes separated by commas.</p>
        </div>
        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">MAX TRAVEL DISTANCE</label>
          <select value={maxDistanceMiles} onChange={(e) => setMaxDistanceMiles(Number(e.target.value))} className={inputCls}>
            {[...new Set([...DISTANCES, Number(maxDistanceMiles)])].sort((a, b) => a - b).map((d) => <option key={d} value={d}>{d} miles</option>)}
          </select>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={saving} className="w-full bg-navy text-white font-bold text-sm py-3 rounded-lg hover:bg-navy-light disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </Modal>
  );
}

function PasswordModal({ onClose }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.newPassword !== form.confirm) return setError('New passwords do not match.');
    setSaving(true);
    try {
      await api.patch('/assessor/profile/password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Change Password" onClose={onClose}>
      {done ? (
        <div className="text-center py-4">
          <p className="text-emerald-700 font-semibold mb-4">Your password has been updated.</p>
          <button onClick={onClose} className="bg-navy text-white font-bold text-sm px-8 py-3 rounded-lg hover:bg-navy-light">Done</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="password" placeholder="Current password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} className={inputCls} />
          <input required type="password" placeholder="New password (min. 6 characters)" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} className={inputCls} />
          <input required type="password" placeholder="Confirm new password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={inputCls} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={saving} className="w-full bg-navy text-white font-bold text-sm py-3 rounded-lg hover:bg-navy-light disabled:opacity-50">
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </Modal>
  );
}