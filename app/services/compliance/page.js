'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  CheckCircle2, ArrowRight, BadgeCheck, Home, Zap, LayoutGrid, ShieldCheck,
  Plus, Users, FileCheck, Building2,
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

const bundle = [
  { title: 'EPC Certificate', desc: 'Energy performance rating for sales and lettings.', Icon: Home },
  { title: 'EICR Report', desc: 'Full electrical safety inspection and certification.', Icon: Zap },
  { title: 'Floor Plan', desc: 'Professional, listing-ready floor plan of the property.', Icon: LayoutGrid },
  { title: 'Compliance Summary', desc: 'A single document confirming every certificate is in order.', Icon: BadgeCheck },
];

const benefits = [
  'One assessor visit covers everything — no scheduling multiple appointments',
  'Bundle pricing works out cheaper than booking services separately',
  'A single point of contact for all your compliance needs',
  'Ideal for landlords managing multiple properties or portfolios',
];

const idealFor = [
  { title: 'Portfolio Landlords', desc: 'Manage compliance across multiple properties with one trusted partner.', Icon: Building2 },
  { title: 'Letting Agents', desc: 'Keep every managed property fully compliant and audit-ready year round.', Icon: ShieldCheck },
  { title: 'New Landlords', desc: 'Get every certificate sorted in one go before your first tenancy begins.', Icon: Home },
];

const stats = [
  { value: 600, suffix: '+', label: 'Compliance Bundles Delivered', Icon: FileCheck },
  { value: 3, suffix: '-5', label: 'Days to Full Completion', Icon: BadgeCheck },
  { value: 300, suffix: '+', label: 'Landlords on Compliance Plans', Icon: Users },
  { value: 100, suffix: '%', label: 'Certificates Verified', Icon: ShieldCheck },
];

const faqs = [
  { q: 'Can I choose which certificates to include?', a: 'Yes — the compliance package is fully customisable to exactly what your property needs.' },
  { q: 'Do you offer portfolio discounts?', a: 'Landlords with multiple properties get preferential bundle rates — get in touch for a tailored quote.' },
  { q: 'How long does the full package take?', a: 'Most compliance packages are completed and delivered within 3-5 working days.' },
  { q: 'Is one assessor visit really enough?', a: 'For most properties, yes — our assessors are cross-trained to handle EPC, EICR and floor plan assessments in a single visit where possible.' },
  { q: 'Can I add compliance checks on a recurring basis?', a: 'Yes — we offer renewal reminders and recurring compliance plans so certificates never lapse.' },
];

export default function CompliancePage() {
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        {/* HERO */}
<section className="relative bg-navy pt-32 pb-0 overflow-hidden min-h-[92vh] flex flex-col">
  <div className="absolute inset-0 z-0">
    <img
      src="https://images.unsplash.com/photo-1657700819262-18792be64208?fm=jpg&q=80&w=2600&auto=format&fit=crop"
      alt="Manchester skyline"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-navy/65" />
    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />
  </div>

  <div className="relative z-10 flex-1 flex items-center max-w-content mx-auto px-6 w-full">
    <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center w-full">
      <div>
        <p className={`text-gold text-sm font-bold tracking-[0.3em] mb-5 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          PROPERTY COMPLIANCE
        </p>
        <h1 className={`font-sans text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Every Certificate,
          <br />
          <span className="text-gold">One Simple Package</span>
        </h1>
        <p className={`text-white/85 text-lg max-w-xl mb-9 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Qualified. Insured. Trusted. Bundle your EPC, EICR and floor plan into a single visit
          and get complete peace of mind.
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
          <BadgeCheck size={90} strokeWidth={1.3} className="text-gold" />
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
        { label: 'One Visit, Everything Covered', desc: 'EPC, EICR and floor plan together', Icon: ShieldCheck },
        { label: 'Bundle Pricing', desc: 'Cheaper than booking separately', Icon: BadgeCheck },
        { label: '3-5 Day Delivery', desc: 'Full compliance sorted, fast', Icon: Home },
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

        {/* WHAT'S IN THE BUNDLE */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">WHAT'S INCLUDED</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">The Full Compliance Bundle</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bundle.map(({ title, desc, Icon }) => (
                <div key={title} className="border border-navy/10 rounded-xl p-7 hover:border-gold/50 hover:shadow-lg transition-all duration-300">
                  <Icon size={30} strokeWidth={1.6} className="text-gold-dark mb-5" />
                  <h3 className="text-navy font-bold text-lg mb-3">{title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IDEAL FOR */}
        <section className="bg-white py-24 border-t border-navy/5">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">IDEAL FOR</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">Who Uses Our Compliance Package</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {idealFor.map(({ title, desc, Icon }) => (
                <div key={title} className="border border-navy/10 rounded-xl p-7">
                  <Icon size={30} strokeWidth={1.6} className="text-gold-dark mb-5" />
                  <h3 className="text-navy font-bold text-lg mb-3">{title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="bg-navy-dark py-24">
          <div className="max-w-content mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1608303588026-884930af2559?fm=jpg&q=80&w=1200&auto=format&fit=crop"
                alt="Reviewing compliance documents"
                className="w-full h-[420px] object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-gold text-sm font-bold tracking-[0.25em] mb-3">WHY BUNDLE</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-6">
                Save Time, Save Money, Stay Covered
              </h2>
              <div className="space-y-4 mb-8">
                {benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <ShieldCheck size={22} className="text-gold shrink-0 mt-0.5" />
                    <p className="text-white/70">{b}</p>
                  </div>
                ))}
              </div>
              <Link href="/quote" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-7 py-3.5 rounded hover:bg-gold-light transition-colors duration-200">
                GET YOUR BUNDLE QUOTE <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        

        {/* FAQ */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6 max-w-3xl">
            <div className="text-center mb-14">
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">FAQS</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">Compliance Package Questions</h2>
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
              Get Fully Compliant in One Visit
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Book your complete compliance package and tick every legal box at once.
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