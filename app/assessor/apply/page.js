'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, Upload, UserPlus } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AssessorApplyPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', specialization: '',
    experienceYears: '', qualifications: '', message: '',
  });
  const [cvFile, setCvFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.email || !form.phone) {
      setError('Please fill in your name, email and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (cvFile) formData.append('cv', cvFile);

      const res = await fetch(`${API_URL}/assessor-requests`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong.');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <>
        <Navbar />
        <main className="bg-white min-h-screen pt-40 pb-24">
          <div className="max-w-lg mx-auto px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-gold-dark" />
            </div>
            <h1 className="font-sans text-3xl font-extrabold text-navy mb-4">Application Submitted</h1>
            <p className="text-navy/60 leading-relaxed">
              Thank you for applying to become an assessor with Manchester Certify. Our team will
              review your application and get back to you via email.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <section className="relative bg-navy pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1657700819262-18792be64208?fm=jpg&q=80&w=2600&auto=format&fit=crop"
              alt="Manchester skyline"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/75" />
          </div>
          <div className="relative z-10 max-w-content mx-auto px-6 text-center">
            <p className="text-gold text-sm font-bold tracking-[0.3em] mb-4">JOIN OUR TEAM</p>
            <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-white">Become an Assessor</h1>
            <p className="text-white/70 mt-3 max-w-xl mx-auto">
              Join our network of qualified assessors across Greater Manchester. Fill in the form below to apply.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-2xl mx-auto px-6">
            <form onSubmit={handleSubmit} className="border border-navy/10 rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center shrink-0">
                  <UserPlus size={18} className="text-gold" />
                </div>
                <h2 className="font-bold text-navy text-lg">Your Details</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Full Name" required>
                  <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                </Field>
                <Field label="Email Address" required>
                  <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                </Field>
                <Field label="Phone Number" required>
                  <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                </Field>
                <Field label="Specialization">
                  <select value={form.specialization} onChange={(e) => update('specialization', e.target.value)} className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                    <option value="">Select specialization</option>
                    <option value="EPC">EPC</option>
                    <option value="EICR">EICR</option>
                    <option value="Floor Plan">Floor Plan</option>
                    <option value="Air Testing">Air Testing</option>
                    <option value="General">General</option>
                  </select>
                </Field>
                <Field label="Years of Experience">
                  <input type="number" min="0" value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                </Field>
              </div>

              <Field label="Qualifications & Accreditations">
                <textarea rows={3} value={form.qualifications} onChange={(e) => update('qualifications', e.target.value)} placeholder="e.g. DEA accredited, NICEIC registered..." className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none" />
              </Field>

              <Field label="Anything Else We Should Know?">
                <textarea rows={3} value={form.message} onChange={(e) => update('message', e.target.value)} className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none" />
              </Field>

              <div>
                <label className="block text-navy text-xs font-bold tracking-wide mb-2">CV / CERTIFICATES (PDF, DOC — max 5MB)</label>
                <label className="flex items-center gap-3 border border-dashed border-navy/25 rounded-lg px-4 py-4 cursor-pointer hover:border-gold transition-colors">
                  <Upload size={18} className="text-navy/40" />
                  <span className="text-sm text-navy/60">{cvFile ? cvFile.name : 'Click to upload a file'}</span>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files[0])} className="hidden" />
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">{error}</div>
              )}

              <button type="submit" disabled={submitting} className="w-full bg-navy text-white font-bold text-sm tracking-wide py-4 rounded-md hover:bg-navy-light transition-colors duration-300 disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-navy text-xs font-bold tracking-wide mb-2">
        {label} {required && <span className="text-gold-dark">*</span>}
      </label>
      {children}
    </div>
  );
}