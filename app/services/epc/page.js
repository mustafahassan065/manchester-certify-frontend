'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  CheckCircle2, ArrowRight, Home, FileCheck, Scale, PoundSterling,
  Plus, TrendingUp, Users, Clock,
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
  'Full internal and external property assessment',
  'Energy efficiency rating from A (best) to G (worst)',
  'Recommendations report to improve your rating',
  'Valid for 10 years, accepted by all UK lettings and sales portals',
  'Digital PDF delivered straight to your inbox',
];

const whoNeeds = [
  { title: 'Selling a Property', desc: 'Legally required before you can market your home for sale.', Icon: Scale },
  { title: 'Letting a Property', desc: 'Landlords must provide a valid EPC to tenants before move-in.', Icon: Home },
  { title: 'New Builds', desc: 'Required for building regulations completion on any new construction.', Icon: FileCheck },
];

const steps = [
  { title: 'Book Your Slot', desc: 'Choose a convenient appointment time online in under two minutes.' },
  { title: 'Assessor Visits', desc: 'A DEA-accredited assessor surveys the property — takes 30-60 minutes.' },
  { title: 'Report Delivered', desc: 'Your EPC lands in your inbox within 24-48 hours, ready to use.' },
];

const ratingBands = [
  { band: 'A-B', desc: 'Highly efficient — top-tier rating, often seen in new builds.' },
  { band: 'C-D', desc: 'The most common range for existing UK housing stock.' },
  { band: 'E-G', desc: 'Below the minimum standard required to legally let a property.' },
];

const stats = [
  { value: 3000, suffix: '+', label: 'EPCs Issued', Icon: FileCheck },
  { value: 24, suffix: 'hrs', label: 'Average Turnaround', Icon: Clock },
  { value: 1000, suffix: '+', label: 'Landlords Served', Icon: Users },
  { value: 15, suffix: '%', label: 'Avg. Rating Improvement Possible', Icon: TrendingUp },
];

const faqs = [
  { q: 'How long is an EPC valid for?', a: 'An EPC is valid for 10 years from the date of assessment.' },
  { q: 'What happens if I don\'t have one?', a: 'Selling or letting without a valid EPC can result in a fine of up to £5,000 from Trading Standards.' },
  { q: 'Can a low rating be improved?', a: 'Yes — your report includes tailored recommendations to boost your rating and reduce running costs.' },
  { q: 'What is the minimum rating to let a property?', a: 'Rental properties in England and Wales must currently have a minimum EPC rating of E, with proposed changes tightening this further.' },
  { q: 'Do I need a new EPC if I already have one?', a: 'Only if your current EPC has expired (over 10 years old) or you\'ve made significant changes to the property since it was issued.' },
];

export default function EpcPage() {
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <Navbar />
      <main>
       {/* HERO */}
<section className="relative bg-navy pt-28 sm:pt-32 pb-0 overflow-hidden min-h-screen sm:min-h-[92vh] flex flex-col">
  <div className="absolute inset-0 z-0">
    <img
      src="https://images.unsplash.com/photo-1513584684374-8bab748fbf90?fm=jpg&q=80&w=2600&auto=format&fit=crop"
      alt="Modern residential property"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-navy/65" />
    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />
  </div>

  <div className="relative z-10 flex-1 flex items-center max-w-content mx-auto px-6 pt-8 sm:pt-0 w-full">
    <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center w-full">
      <div>
        <p className={`text-gold text-xs sm:text-sm font-bold tracking-[0.3em] mb-4 sm:mb-5 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          EPC CERTIFICATES
        </p>
        <h1 className={`font-sans text-3xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-white mb-5 sm:mb-6 leading-[1.15] sm:leading-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Energy Performance
          <br />
          <span className="text-gold">Certificates, Done Right</span>
        </h1>
        <p className={`text-white/85 text-base sm:text-lg max-w-xl mb-7 sm:mb-9 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          A legal requirement for every sale and letting. Fast, accurate assessments from fully
          accredited domestic energy assessors, with clear recommendations to improve your rating.
        </p>

        <div className={`flex flex-wrap gap-3 sm:gap-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <Link href="/booking" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-6 py-3.5 sm:px-8 sm:py-4 rounded-md hover:bg-gold-light transition-colors duration-300">
            BOOK AN APPOINTMENT <ArrowRight size={16} />
          </Link>
          <Link href="/quote" className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-bold text-sm tracking-wide px-6 py-3.5 sm:px-8 sm:py-4 rounded-md hover:border-gold hover:text-gold transition-colors duration-300">
            GET A QUOTE
          </Link>
        </div>
      </div>

      <div className={`hidden lg:flex justify-center transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <div className="w-56 h-56 rounded-full border-2 border-gold/60 flex items-center justify-center bg-white/5 animate-float">
          <Home size={90} strokeWidth={1.3} className="text-gold" />
        </div>
      </div>
    </div>
  </div>

  {/* Feature strip */}
  <div className="relative z-10 max-w-content mx-auto px-6 pb-10 sm:pb-14">
    <div
      className={`grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 transition-all duration-700 delay-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {[
        { label: 'A-G Rating', desc: 'Full efficiency scale assessment', Icon: Scale },
        { label: '10-Year Validity', desc: 'Accepted across all UK portals', Icon: FileCheck },
        { label: '24-48hr Delivery', desc: 'Digital PDF straight to your inbox', Icon: PoundSterling },
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


        {/* UNDERSTANDING YOUR RATING */}
        <section className="bg-white py-16 border-t border-navy/5">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">UNDERSTANDING YOUR RATING</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">What the Letters Mean</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {ratingBands.map((r) => (
                <div key={r.band} className="border border-navy/10 rounded-xl p-7 text-center">
                  <p className="text-4xl font-extrabold text-gold-dark mb-3">{r.band}</p>
                  <p className="text-navy/60 text-sm leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO NEEDS IT */}
        <section className="bg-navy-dark py-24">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-gold text-sm font-bold tracking-[0.3em] mb-3">WHO NEEDS AN EPC</p>
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
                      <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">EPC Questions Answered</h2>
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
              Book Your EPC Assessment Today
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Same-day and next-day appointments available across Greater Manchester.
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