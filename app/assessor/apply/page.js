'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, Upload, LogIn, ArrowRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const BODIES = [
  'Elmhurst Energy', 'Stroma Certification', 'Quidos', 'ECMK', 'Sterling Accreditation',
  'NICEIC', 'NAPIT', 'Certsure', 'RICS', 'Other',
];

const inputCls = 'w-full border border-navy/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-white';

export default function AssessorApplyPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    accreditationBody: '', otherBody: '', accreditationNumber: '',
    postcodeAreas: '', standardRate: '', experienceYears: '', message: '',
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [certificate, setCertificate] = useState(null);
  const [cv, setCv] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/services`)
      .then((r) => r.json())
      .then((d) => setServices(d.services || []))
      .catch(() => {});
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  }

  function toggleService(name) {
    setSelectedServices((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const body = form.accreditationBody === 'Other' ? form.otherBody.trim() : form.accreditationBody;

    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) return setError('Please fill in your name, email and phone number.');
    if (selectedServices.length === 0) return setError('Please select at least one service you can carry out.');
    if (!body || !form.accreditationNumber.trim()) return setError('Please provide your accreditation body and number.');
    if (!certificate) return setError('Please upload your accreditation certificate.');
    if (!form.postcodeAreas.trim()) return setError('Please enter the postcode areas you cover.');
    if (form.standardRate === '') return setError('Please enter your standard rate.');
    if (!agreed) return setError('Please agree to the terms to continue.');

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('fullName', form.fullName);
      data.append('email', form.email);
      data.append('phone', form.phone);
      data.append('servicesApplied', selectedServices.join(', '));
      data.append('accreditationBody', body);
      data.append('accreditationNumber', form.accreditationNumber);
      data.append('postcodeAreas', form.postcodeAreas);
      data.append('standardRate', form.standardRate);
      data.append('experienceYears', form.experienceYears);
      data.append('message', form.message);
      data.append('accreditationCertificate', certificate);
      if (cv) data.append('cv', cv);

      const res = await fetch(`${API_URL}/assessor-requests`, { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Something went wrong.');
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
            <p className="text-navy/60 leading-relaxed mb-8">
              Thank you for applying to join Manchester Certify. We review every application within
              2 working days and will email you the outcome.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 bg-navy text-white font-bold text-sm px-7 py-3.5 rounded hover:bg-navy-light">
              Back to Home <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F8FA]">
        <section className="relative bg-navy pt-32 pb-14 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1657700819262-18792be64208?fm=jpg&q=80&w=2600&auto=format&fit=crop" alt="Manchester skyline" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-navy/80" />
          </div>
          <div className="relative z-10 max-w-content mx-auto px-6 text-center">
            <p className="text-gold text-sm font-bold tracking-[0.3em] mb-4">JOIN OUR TEAM</p>
            <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-white">Become an Assessor</h1>
            <p className="text-white/70 mt-3 max-w-xl mx-auto">
              Join our network of accredited assessors and receive jobs in your area.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-2xl mx-auto px-6">
            <div className="bg-white rounded-xl border border-navy/10 p-5 mb-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-navy font-bold">Already a Manchester Certify assessor?</p>
                <p className="text-navy/50 text-sm">Access your jobs, portal and account settings.</p>
              </div>
              <Link href="/assessor/login" className="inline-flex items-center gap-2 bg-navy text-white font-bold text-sm px-6 py-3 rounded-lg hover:bg-navy-light">
                <LogIn size={16} /> Log in
              </Link>
            </div>

            <div className="text-center mb-8">
              <h2 className="font-sans text-3xl font-extrabold text-navy">Apply to join</h2>
              <p className="text-navy/60 mt-2">Complete the form below and upload your documents. We&apos;ll review your application within 2 working days.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-navy/10 p-6 sm:p-8 space-y-8">
              {/* Personal details */}
              <div>
                <h3 className="font-bold text-navy mb-4">Personal details</h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full name" required>
                    <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Email address" required>
                    <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Phone number" required>
                    <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Years of experience">
                    <input type="number" min="0" value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} className={inputCls} />
                  </Field>
                </div>
              </div>

              <hr className="border-navy/10" />

              {/* Services */}
              <div>
                <h3 className="font-bold text-navy mb-1">Services you can carry out <span className="text-gold-dark">*</span></h3>
                <p className="text-navy/50 text-xs mb-4">Select every service you are qualified to provide.</p>
                {services.length === 0 && <p className="text-navy/40 text-sm">Loading services...</p>}
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((s) => {
                    const on = selectedServices.includes(s.name);
                    return (
                      <label key={s.id} className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${on ? 'border-gold bg-gold/5' : 'border-navy/15 hover:border-navy/30'}`}>
                        <input type="checkbox" checked={on} onChange={() => toggleService(s.name)} className="accent-navy w-4 h-4" />
                        <span className="text-sm text-navy font-medium">{s.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <hr className="border-navy/10" />

              {/* Accreditation */}
              <div>
                <h3 className="font-bold text-navy mb-4">Accreditation</h3>
                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <Field label="Accreditation body" required>
                    <select value={form.accreditationBody} onChange={(e) => update('accreditationBody', e.target.value)} className={inputCls}>
                      <option value="">Select...</option>
                      {BODIES.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </Field>
                  <Field label="Accreditation number" required>
                    <input value={form.accreditationNumber} onChange={(e) => update('accreditationNumber', e.target.value)} placeholder="e.g. EL123456" className={inputCls} />
                  </Field>
                  {form.accreditationBody === 'Other' && (
                    <div className="sm:col-span-2">
                      <Field label="Accreditation body name" required>
                        <input value={form.otherBody} onChange={(e) => update('otherBody', e.target.value)} className={inputCls} />
                      </Field>
                    </div>
                  )}
                </div>

                <UploadBox label="Accreditation certificate" required file={certificate} onChange={setCertificate} hint="PDF, image, or Word document — current year" />
                <div className="mt-5">
                  <UploadBox label="CV (optional)" file={cv} onChange={setCv} hint="PDF or Word document" />
                </div>
              </div>

              <hr className="border-navy/10" />

              {/* Coverage and rate */}
              <div>
                <h3 className="font-bold text-navy mb-4">Coverage and rate</h3>
                <div className="space-y-5">
                  <Field label="Postcode areas covered" required>
                    <input value={form.postcodeAreas} onChange={(e) => update('postcodeAreas', e.target.value)} placeholder="e.g. M, BL, SK, OL, WA" className={inputCls} />
                    <p className="text-navy/50 text-xs mt-2">Enter prefix codes separated by commas. You can update these after joining.</p>
                  </Field>
                  <div className="sm:w-1/2">
                    <Field label="Standard rate per property (£)" required>
                      <div className="flex items-center border border-navy/15 rounded-lg px-4 focus-within:ring-2 focus-within:ring-gold">
                        <span className="text-navy/40 text-sm mr-2">£</span>
                        <input type="number" min="0" step="0.01" value={form.standardRate} onChange={(e) => update('standardRate', e.target.value)} placeholder="e.g. 50" className="w-full py-3 text-sm outline-none" />
                      </div>
                    </Field>
                    <p className="text-navy/50 text-xs mt-2">Your typical rate for a standard property.</p>
                  </div>
                </div>
              </div>

              <hr className="border-navy/10" />

              <Field label="Additional notes (optional)">
                <textarea rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Anything else we should know — other accreditations, languages spoken, commercial experience" className={`${inputCls} resize-none`} />
              </Field>

              <label className="flex items-start gap-3 bg-navy/5 rounded-lg p-4 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setError(''); }} className="accent-navy w-4 h-4 mt-0.5" />
                <span className="text-navy/70 text-xs leading-relaxed">
                  I agree to Manchester Certify&apos;s Assessor Terms &amp; Conditions and Privacy Policy. I understand that
                  Manchester Certify will process my personal data to manage my assessor account and distribute job offers.
                </span>
              </label>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">{error}</div>}

              <button type="submit" disabled={submitting} className="w-full bg-navy text-white font-bold text-sm tracking-wide py-4 rounded-lg hover:bg-navy-light transition-colors duration-300 disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit application'}
              </button>
              <p className="text-navy/40 text-xs text-center">We review every application within 2 working days and will email you the outcome.</p>
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

function UploadBox({ label, required, file, onChange, hint }) {
  return (
    <div>
      <label className="block text-navy text-xs font-bold tracking-wide mb-2">
        {label} {required && <span className="text-gold-dark">*</span>}
      </label>
      <label className="flex items-center gap-4 border border-dashed border-navy/25 rounded-lg px-4 py-4 cursor-pointer hover:border-gold transition-colors">
        <Upload size={20} className="text-navy/40 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm text-navy font-medium truncate">{file ? file.name : 'Click to upload'}</p>
          <p className="text-xs text-navy/50">{hint} · max 10MB</p>
        </div>
        <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => onChange(e.target.files[0] || null)} className="hidden" />
      </label>
    </div>
  );
}