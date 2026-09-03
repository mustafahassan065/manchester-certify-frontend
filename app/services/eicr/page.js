'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  CheckCircle2, ArrowRight, Zap, ShieldAlert, Home, Building2,
  Plus, Users, FileCheck, Clock,
} from 'lucide-react';

function Counter({ value, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1500;
            const start = performance.now();
            const step = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(eased * value));
              if (progress < 1) requestAnimationFrame(step);
              else setCount(value);
            };
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
      {count}{suffix}
    </span>
  );
}

const included = [
  'Full inspection of the property\'s fixed electrical installation',
  'Testing of sockets, switches, wiring, consumer unit and earthing',
  'Classification of any faults (C1, C2, C3 or FI)',
  'Clear, jargon-free report explaining any remedial work needed',
  'Valid for 5 years for rental properties, 10 years for owner-occupied',
];

const whoNeeds = [
  { title: 'Landlords', desc: 'A legal requirement under the Electrical Safety Standards regulations for every tenancy.', Icon: Home },
  { title: 'Homeowners', desc: 'Recommended every 10 years to catch faults before they become dangerous or costly.', Icon: ShieldAlert },
  { title: 'Commercial Property', desc: 'Required for insurance compliance and workplace electrical safety obligations.', Icon: Building2 },
];

const faultCodes = [
  { code: 'C1', desc: 'Danger present — risk of injury. Immediate remedial action required.' },
  { code: 'C2', desc: 'Potentially dangerous — urgent remedial action required.' },
  { code: 'C3', desc: 'Improvement recommended — not a safety risk but worth addressing.' },
];

const steps = [
  { title: 'Book Your Slot', desc: 'Schedule an appointment online — same-day slots often available.' },
  { title: 'Electrician Inspects', desc: 'A qualified NICEIC electrician tests every circuit in the property.' },
  { title: 'Certificate Issued', desc: 'Your EICR is delivered digitally within 24-48 hours of the inspection.' },
];

const stats = [
  { value: 2500, suffix: '+', label: 'EICRs Completed', Icon: FileCheck },
  { value: 24, suffix: 'hrs', label: 'Average Turnaround', Icon: Clock },
  { value: 800, suffix: '+', label: 'Landlords Served', Icon: Users },
  { value: 100, suffix: '%', label: 'NICEIC Registered', Icon: ShieldAlert },
];

const faqs = [
  { q: 'How often do I need an EICR?', a: 'Rental properties require a new EICR every 5 years or at each change of tenancy. Owner-occupied homes are recommended every 10 years.' },
  { q: 'What if faults are found?', a: 'We\'ll clearly explain any C1/C2 issues and can arrange remedial electrical work through our trusted partners.' },
  { q: 'Is this the same as PAT testing?', a: 'No — EICR covers the fixed wiring and installation, while PAT testing covers portable appliances separately.' },
  { q: 'What\'s the difference between C1, C2 and C3?', a: 'C1 means immediate danger, C2 means urgent action needed, and C3 is simply a recommended improvement — not a safety risk.' },
  { q: 'Do I need an EICR to sell a house?', a: 'It isn\'t legally required to sell, but many buyers and mortgage lenders now expect one as part of due diligence.' },
];

export default function EicrPage() {
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
<section className="relative bg-navy pt-32 pb-0 overflow-hidden min-h-[92vh] flex flex-col">
  <div className="absolute inset-0 z-0">
    <img
      src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?fm=jpg&q=80&w=2600&auto=format&fit=crop"
      alt="Electrician installing wiring"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-navy/65" />
    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />
  </div>

  <div className="relative z-10 flex-1 flex items-center max-w-content mx-auto px-6 w-full">
    <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center w-full">
      <div>
        <p className={`text-gold text-sm font-bold tracking-[0.3em] mb-5 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          EICR REPORTS
        </p>
        <h1 className={`font-sans text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Electrical Safety
          <br />
          <span className="text-gold">You Can Certify</span>
        </h1>
        <p className={`text-white/85 text-lg max-w-xl mb-9 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Full Electrical Installation Condition Reports from NICEIC-registered electricians —
          protecting tenants, homeowners and properties alike.
        </p>

        <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <Link href="/booking" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:bg-gold-light transition-colors duration-300">
            BOOK AN APPOINTMENT <ArrowRight size={16} />
          </Link>
          <Link href="/quote" className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:border-gold hover:text-gold transition-colors duration-300">
            GET A QUOTE
          </Link>
        </div>
      </div>

      <div className={`hidden lg:flex justify-center transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <div className="w-56 h-56 rounded-full border-2 border-gold/60 flex items-center justify-center bg-white/5 animate-float">
          <Zap size={90} strokeWidth={1.3} className="text-gold" />
        </div>
      </div>
    </div>
  </div>

  {/* Feature strip — plain, dominant icon + text, no card background */}
  <div className="relative z-10 max-w-content mx-auto px-6 pb-14">
    <div
      className={`grid sm:grid-cols-3 gap-8 transition-all duration-700 delay-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {[
        { label: 'Full Circuit Testing', desc: 'Sockets, wiring, consumer unit and earthing', Icon: ShieldAlert },
        { label: '5-10 Year Validity', desc: 'Rental vs. owner-occupied cover', Icon: Home },
        { label: '24-48hr Delivery', desc: 'Digital certificate straight to your inbox', Icon: Building2 },
      ].map(({ label, desc, Icon }) => (
        <div key={label} className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center shrink-0 bg-gold/5">
            <Icon size={26} strokeWidth={1.8} className="text-gold" />
          </div>
          <div>
            <p className="text-white font-bold text-base">{label}</p>
            <p className="text-white/60 text-sm">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* WHAT'S INCLUDED */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">WHAT'S INCLUDED</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy leading-tight mb-6">
                A Complete Electrical Health Check
              </h2>
              <div className="space-y-4">
                {included.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={22} className="text-gold-dark shrink-0 mt-0.5" />
                    <p className="text-navy/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-navy-dark rounded-2xl p-10">
              <Zap size={32} className="text-gold mb-4" />
              <h3 className="text-white font-bold text-2xl mb-3">Fast-Tracked for Landlords</h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                Facing a tenancy deadline? We offer priority booking to keep you legally compliant on time.
              </p>
              <Link href="/booking" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-6 py-3.5 rounded hover:bg-gold-light transition-colors duration-200">
                BOOK NOW <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* FAULT CODES */}
        <section className="bg-white py-24 border-t border-navy/5">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">UNDERSTANDING YOUR REPORT</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">What the Fault Codes Mean</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {faultCodes.map((f) => (
                <div key={f.code} className="border border-navy/10 rounded-xl p-7 text-center">
                  <p className="text-4xl font-extrabold text-gold-dark mb-3">{f.code}</p>
                  <p className="text-navy/60 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO NEEDS IT */}
        <section className="bg-navy-dark py-24">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-gold text-sm font-bold tracking-[0.3em] mb-3">WHO NEEDS AN EICR</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-white">Is This Certificate For You?</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {whoNeeds.map(({ title, desc, Icon }) => (
                <div key={title} className="bg-white/[0.03] border border-white/10 rounded-xl p-7">
                  <Icon size={30} strokeWidth={1.6} className="text-gold mb-5" />
                  <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        

        {/* PROCESS */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">THE PROCESS</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">Three Simple Steps</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <div key={s.title} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-navy text-gold font-extrabold text-xl flex items-center justify-center mx-auto mb-5">
                    {i + 1}
                  </div>
                  <h3 className="text-navy font-bold text-lg mb-3">{s.title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
                <section className="bg-navy-dark py-20 border-y border-white/10">
                  <div className="max-w-content mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-10">
                    {stats.map(({ value, suffix, label, Icon }) => (
                      <div key={label} className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                          <Icon size={26} strokeWidth={1.8} className="text-gold-dark" />
                        </div>
                        <div>
                          <Counter value={value} suffix={suffix} />
                          <p className="text-white/55 text-xs font-semibold tracking-wide mt-1">{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
        
                {/* FAQ */}
                <section className="bg-white py-24">
                          <div className="max-w-content mx-auto px-6 max-w-3xl">
                            <div className="text-center mb-14">
                              <p className="text-gold-dark text-sm font-bold tracking-[0.3em] mb-3">FAQS</p>
                              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">EICR Questions Answered</h2>
                            </div>
                            <div className="space-y-3">
                              {faqs.map((item, i) => {
                                const isOpen = openFaq === i;
                                return (
                                  <div key={item.q} className={`border rounded-lg overflow-hidden transition-colors duration-300 ${isOpen ? 'border-gold/50 bg-gold/[0.03]' : 'border-navy/10'}`}>
                                    <button onClick={() => setOpenFaq(isOpen ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={isOpen}>
                                      <span className="font-bold text-navy text-sm sm:text-base">{item.q}</span>
                                      <span className={`shrink-0 w-7 h-7 rounded-full border border-gold flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-45 bg-gold' : ''}`}>
                                        <Plus size={14} className={isOpen ? 'text-white' : 'text-gold'} />
                                      </span>
                                    </button>
                                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                      <div className="overflow-hidden">
                                        <p className="px-6 pb-5 text-navy/60 text-sm leading-relaxed">{item.a}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </section>
        

        {/* CTA BANNER */}
        <section className="bg-navy py-20">
          <div className="max-w-content mx-auto px-6 text-center">
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Stay Electrically Compliant
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Book a certified electrician for your EICR inspection today.
            </p>
            <Link href="/booking" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:bg-gold-light transition-colors duration-300">
              BOOK AN APPOINTMENT <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}