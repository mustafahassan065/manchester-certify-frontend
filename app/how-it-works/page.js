'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ArrowRight, CalendarCheck, ClipboardCheck, FileCheck2, Send, HelpCircle,
  Plus, Users, FileText, Building2, Award,
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
    <span ref={ref} className="text-3xl sm:text-4xl font-extrabold text-navy tabular-nums">
      {count}{suffix}
    </span>
  );
}

const steps = [
  { num: '01', title: 'Book Online in Minutes', Icon: CalendarCheck, desc: 'Choose your service — EPC, EICR, floor plan or full compliance package — and pick a date and time that suits you. No account needed, no long forms.' },
  { num: '02', title: 'Assessor Visits Your Property', Icon: ClipboardCheck, desc: 'A fully qualified, insured assessor arrives on time and carries out the assessment. Most visits take between 30 and 90 minutes depending on the service.' },
  { num: '03', title: 'Report Reviewed & Finalised', Icon: FileCheck2, desc: 'Every report is quality-checked before it goes out — no rushed jobs, no errors, no ambiguity about what your certificate means.' },
  { num: '04', title: 'Delivered Straight to Your Inbox', Icon: Send, desc: 'Your finished certificate or report is emailed as a digital PDF, typically within 24-48 hours, ready to use immediately.' },
];

const expect = [
  { q: 'Same-day appointments', a: 'Available in most areas for urgent EPC and EICR needs.' },
  { q: 'Fixed, upfront pricing', a: 'You\'ll know the exact cost before you book — no surprises on invoice day.' },
  { q: 'Fully accredited assessors', a: 'Every visit is carried out by a DEA, NICEIC or RICS-standard professional.' },
  { q: 'Ongoing support', a: 'Questions about your report? Our team is a phone call away.' },
];

const stats = [
  { value: 24, suffix: 'hrs', label: 'Average Report Turnaround', Icon: FileText },
  { value: 98, suffix: '%', label: 'Appointments On Time', Icon: ClipboardCheck },
  { value: 1000, suffix: '+', label: 'Bookings Completed', Icon: Users },
  { value: 4, suffix: '.9★', label: 'Average Client Rating', Icon: Award },
];

const faqs = [
  { q: 'How far in advance should I book?', a: 'Most areas offer next-day or same-day slots, but booking a few days ahead guarantees your preferred time.' },
  { q: 'Do I need to be home for the appointment?', a: 'For residential EPCs and EICRs, yes — access to the property is required. For commercial units, key holders can arrange access instead.' },
  { q: 'What if I need to reschedule?', a: 'No problem — contact us at least 24 hours ahead and we\'ll find a new slot at no extra charge.' },
  { q: 'How is the report delivered?', a: 'As a digital PDF sent straight to your email, usually within 24-48 hours of the appointment.' },
  { q: 'Can I book more than one service at once?', a: 'Yes — many clients bundle EPC, EICR and floor plan into a single visit through our compliance package.' },
];

export default function HowItWorksPage() {
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative bg-navy pt-32 pb-0 overflow-hidden min-h-[92vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1657700819262-18792be64208?fm=jpg&q=80&w=2600&auto=format&fit=crop"
              alt="Manchester skyline"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/65" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />
          </div>
          <div className="relative z-10 max-w-content mx-auto px-6 text-center">
            <p className={`text-gold text-sm font-bold tracking-[0.3em] mb-5 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              HOW IT WORKS
            </p>
            <h1 className={`font-sans text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              From Booking to Certificate<br /><span className="text-gold">in Four Simple Steps</span>
            </h1>
            <p className={`text-white/85 text-lg max-w-2xl mx-auto mb-9 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              No confusing processes, no chasing paperwork. Here's exactly what happens from the
              moment you book to the moment your certificate lands in your inbox.
            </p>
            <div className={`flex flex-wrap justify-center gap-4 mb-14 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Link href="/booking" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:bg-gold-light transition-colors duration-300">
                BOOK AN APPOINTMENT <ArrowRight size={16} />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:border-gold hover:text-gold transition-colors duration-300">
                VIEW OUR SERVICES
              </Link>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6 space-y-16">
            {steps.map((s) => (
              <div key={s.num} className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
                <div className="flex items-center gap-6">
                  <span className="font-sans text-6xl font-extrabold text-navy/10">{s.num}</span>
                  <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center shrink-0">
                    <s.Icon size={28} strokeWidth={1.6} className="text-gold-dark" />
                  </div>
                </div>
                <div>
                  <h3 className="text-navy font-bold text-2xl mb-3">{s.title}</h3>
                  <p className="text-navy/60 leading-relaxed max-w-2xl">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STATS — count-up on first view */}
        <section className="bg-white py-20 border-y border-navy/5">
          <div className="max-w-content mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map(({ value, suffix, label, Icon }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                  <Icon size={26} strokeWidth={1.8} className="text-gold-dark" />
                </div>
                <div>
                  <Counter value={value} suffix={suffix} />
                  <p className="text-navy/55 text-xs font-semibold tracking-wide mt-1">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT TO EXPECT */}
        <section className="bg-navy-dark py-24">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-gold text-sm font-bold tracking-[0.3em] mb-3">WHAT TO EXPECT</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-white">Service You Can Rely On</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {expect.map((item) => (
                <div key={item.q} className="flex gap-4 bg-white/[0.03] border border-white/10 rounded-xl p-6">
                  <HelpCircle size={24} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-bold mb-2">{item.q}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6 max-w-3xl">
            <div className="text-center mb-14">
              <p className="text-gold-dark text-sm font-bold tracking-[0.3em] mb-3">FAQS</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">Booking &amp; Process Questions</h2>
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
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Book your appointment now and have your certificate in hand within days.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/booking" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:bg-gold-light transition-colors duration-300">
                BOOK AN APPOINTMENT <ArrowRight size={16} />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:border-gold hover:text-gold transition-colors duration-300">
                VIEW ALL SERVICES
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}