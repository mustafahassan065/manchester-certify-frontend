'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import {
  User, Mail, Phone, MapPin, Home, Calendar, Clock, Lock,
  Banknote, CreditCard, Building2, CheckCircle2, ShieldCheck,
} from 'lucide-react';

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', sub: 'Pay on arrival', Icon: Banknote },
  { value: 'card', label: 'Bank Card', sub: 'Visa / Mastercard', Icon: CreditCard },
  { value: 'paypal', label: 'PayPal', sub: 'Pay via PayPal', Icon: CreditCard },
  { value: 'bank_transfer', label: 'Bank Transfer', sub: 'Pay via invoice', Icon: Building2 },
];

function todayISO() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export default function BookingPage() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', propertyPostcode: '',
    serviceId: '', pricingId: '', propertyAddress: '', additionalNotes: '',
    appointmentDate: '', timeSlot: '', paymentMethod: 'cash',
  });

  const [slots, setSlots] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    api.get('/services')
      .then((data) => setServices(data.services))
      .catch(() => setError('Could not load services. Please refresh the page.'))
      .finally(() => setLoadingServices(false));
  }, []);

  useEffect(() => {
    if (!form.appointmentDate) {
      setSlots(null);
      return;
    }
    setLoadingSlots(true);
    setForm((f) => ({ ...f, timeSlot: '' }));
    api.get(`/appointments/available-slots?date=${form.appointmentDate}`)
      .then((data) => setSlots(data))
      .catch(() => setError('Could not load time slots for this date.'))
      .finally(() => setLoadingSlots(false));
  }, [form.appointmentDate]);

  const selectedService = services.find((s) => String(s.id) === String(form.serviceId));
  const selectedPricing = selectedService?.pricing.find((p) => String(p.id) === String(form.pricingId));

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.email || !form.phone || !form.serviceId || !form.pricingId ||
        !form.propertyAddress || !form.appointmentDate || !form.timeSlot || !form.paymentMethod) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.post('/appointments', form);

      if (data.requiresPayment && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setSuccess({ appointmentId: data.appointmentId, status: data.status });
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
            <h1 className="font-sans text-3xl font-extrabold text-navy mb-4">Booking Confirmed</h1>
            <p className="text-navy/60 mb-2">
              Thank you, {form.fullName.split(' ')[0]}. Your appointment reference is:
            </p>
            <p className="text-2xl font-extrabold text-gold-dark mb-6">#{success.appointmentId}</p>
            <p className="text-navy/60 leading-relaxed">
              A confirmation email is on its way to <strong>{form.email}</strong>. One of our
              certified assessors will be in touch if anything changes.
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
        {/* HERO */}
        <section className="relative bg-navy pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1657700819262-18792be64208?fm=jpg&q=80&w=2600&auto=format&fit=crop"
              alt="Manchester skyline"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/75" />
          </div>
          <div className="relative z-10 max-w-content mx-auto px-6">
            
            <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-white">
              Book Your Appointment
            </h1>
            <p className="text-white/70 mt-2">Fill in your details below to schedule your assessment.</p>
          </div>
        </section>

        {/* FORM */}
        <section className="py-16">
          <div className="max-w-content mx-auto px-6 grid lg:grid-cols-[1.4fr_1fr] gap-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Your Details */}
              <div className="border border-navy/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center shrink-0">
                    <User size={18} className="text-gold" />
                  </div>
                  <div>
                    <h2 className="font-bold text-navy text-lg">Your Details</h2>
                    <p className="text-navy/50 text-xs">Please provide your information to book your appointment.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full Name" required>
                    <input
                      type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </Field>
                  <Field label="Email Address" required>
                    <input
                      type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </Field>
                  <Field label="Phone Number" required>
                    <input
                      type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                      placeholder="+44 7123 456789"
                      className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </Field>
                  <Field label="Property Postcode" required>
                    <input
                      type="text" value={form.propertyPostcode} onChange={(e) => update('propertyPostcode', e.target.value)}
                      placeholder="e.g. M1 1AB"
                      className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </Field>
                </div>
              </div>

              {/* Service Details */}
              <div className="border border-navy/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center shrink-0">
                    <Home size={18} className="text-gold" />
                  </div>
                  <h2 className="font-bold text-navy text-lg">Service Details</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <Field label="Service Type" required>
                    <select
                      value={form.serviceId}
                      onChange={(e) => { update('serviceId', e.target.value); update('pricingId', ''); }}
                      className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      disabled={loadingServices}
                    >
                      <option value="">{loadingServices ? 'Loading...' : 'Select a service'}</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Pricing Tier" required>
                    <select
                      value={form.pricingId}
                      onChange={(e) => update('pricingId', e.target.value)}
                      className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      disabled={!selectedService}
                    >
                      <option value="">Select an option</option>
                      {selectedService?.pricing.map((p) => (
                        <option key={p.id} value={p.id}>{p.label} — £{p.price}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Property Address" required>
                  <input
                    type="text" value={form.propertyAddress} onChange={(e) => update('propertyAddress', e.target.value)}
                    placeholder="Full address including street and city"
                    className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </Field>

                <div className="mt-5">
                  <Field label="Additional Notes (optional)">
                    <textarea
                      rows={3} value={form.additionalNotes} onChange={(e) => update('additionalNotes', e.target.value)}
                      placeholder="Any special instructions or questions..."
                      className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    />
                  </Field>
                </div>
              </div>

              {/* Date & Time */}
              <div className="border border-navy/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-gold" />
                  </div>
                  <div>
                    <h2 className="font-bold text-navy text-lg">Choose Date &amp; Time</h2>
                    <p className="text-navy/50 text-xs">Select a convenient date and time for your appointment.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label="Select Date" required>
                    <input
                      type="date" min={todayISO()} value={form.appointmentDate}
                      onChange={(e) => update('appointmentDate', e.target.value)}
                      className="w-full border border-navy/15 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </Field>

                  <div>
                    <label className="block text-navy text-xs font-bold tracking-wide mb-2">
                      Select Time Slot <span className="text-gold-dark">*</span>
                    </label>
                    {!form.appointmentDate && (
                      <p className="text-navy/40 text-sm">Pick a date first.</p>
                    )}
                    {loadingSlots && <p className="text-navy/40 text-sm">Loading slots...</p>}
                    {slots && !slots.isWorkingDay && (
                      <p className="text-red-600 text-sm">Not available on this date{slots.reason ? ` — ${slots.reason}` : ''}.</p>
                    )}
                    {slots?.isWorkingDay && (
                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                        {slots.slots.map((s) => (
                          <button
                            key={s.time} type="button" disabled={!s.available}
                            onClick={() => update('timeSlot', s.time)}
                            className={`text-xs font-semibold py-2.5 rounded border transition-colors ${
                              form.timeSlot === s.time
                                ? 'bg-navy text-white border-navy'
                                : s.available
                                  ? 'border-navy/15 text-navy hover:border-gold'
                                  : 'border-navy/5 text-navy/25 line-through cursor-not-allowed'
                            }`}
                          >
                            {s.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border border-navy/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center shrink-0">
                    <Lock size={18} className="text-gold" />
                  </div>
                  <div>
                    <h2 className="font-bold text-navy text-lg">Payment Method</h2>
                    <p className="text-navy/50 text-xs">Choose your preferred payment method.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PAYMENT_METHODS.map(({ value, label, sub, Icon }) => (
                    <button
                      key={value} type="button"
                      onClick={() => update('paymentMethod', value)}
                      className={`flex flex-col items-center gap-2 border rounded-lg p-4 text-center transition-colors ${
                        form.paymentMethod === value ? 'border-gold bg-gold/5' : 'border-navy/10 hover:border-navy/30'
                      }`}
                    >
                      <Icon size={22} className={form.paymentMethod === value ? 'text-gold-dark' : 'text-navy/50'} />
                      <div>
                        <p className="text-navy font-semibold text-sm">{label}</p>
                        <p className="text-navy/40 text-xs">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-start gap-2 bg-navy/5 rounded-lg p-4 mt-6">
                  <ShieldCheck size={18} className="text-navy/50 shrink-0 mt-0.5" />
                  <p className="text-navy/60 text-xs leading-relaxed">
                    Your information is safe with us and will only be used for your appointment.
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">
                  {error}
                </div>
              )}

              <button
                type="submit" disabled={submitting}
                className="w-full bg-navy text-white font-bold text-sm tracking-wide py-4 rounded-md hover:bg-navy-light transition-colors duration-300 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Confirm Appointment'}
              </button>
              <p className="text-navy/40 text-xs text-center">
                By confirming, you agree to our Terms &amp; Conditions and Privacy Policy.
              </p>
            </form>

            {/* Appointment Summary sidebar */}
            <aside className="lg:sticky lg:top-28 self-start space-y-6">
              <div className="border border-navy/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-gold" />
                  </div>
                  <h3 className="font-bold text-navy">Appointment Summary</h3>
                </div>

                {form.appointmentDate && form.timeSlot ? (
                  <div className="bg-navy/5 rounded-lg p-4 mb-4">
                    <p className="text-navy/50 text-xs mb-1">Selected Appointment</p>
                    <p className="text-navy font-bold">{form.appointmentDate}</p>
                    <p className="text-navy/60 text-sm">{form.timeSlot}</p>
                  </div>
                ) : (
                  <p className="text-navy/40 text-sm mb-4">No date/time selected yet.</p>
                )}

                <div className="space-y-3 border-t border-navy/10 pt-4">
                  <SummaryRow icon={Home} label="Service" value={selectedService?.name || '—'} />
                  <SummaryRow icon={Clock} label="Pricing Tier" value={selectedPricing?.label || '—'} />
                  <SummaryRow icon={MapPin} label="Price" value={selectedPricing ? `£${selectedPricing.price}` : '—'} bold />
                </div>

                <div className="bg-navy text-white rounded-lg p-4 mt-5 flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-xl font-extrabold text-gold">
                    {selectedPricing ? `£${selectedPricing.price}` : '£0.00'}
                  </span>
                </div>
              </div>

              <div className="bg-navy-dark rounded-2xl p-6 text-white">
                <p className="text-gold font-bold text-sm mb-3">Why Choose Manchester Certify?</p>
                <p className="text-white/60 text-sm leading-relaxed">
                  We provide professional and reliable certification services across Greater Manchester.
                </p>
              </div>
            </aside>
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

function SummaryRow({ icon: Icon, label, value, bold }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={16} className="text-gold-dark shrink-0 mt-0.5" />
      <div>
        <p className="text-navy/50 text-xs">{label}</p>
        <p className={`text-navy text-sm ${bold ? 'font-bold' : ''}`}>{value}</p>
      </div>
    </div>
  );
}