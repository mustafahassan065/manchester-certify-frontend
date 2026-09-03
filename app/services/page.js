'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Home, Zap, LayoutGrid, BadgeCheck, ArrowRight, CheckCircle2, Plus,
  Users, FileText, Building2, Star,
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

const services = [
  { slug: 'epc', code: 'EPC', title: 'Energy Performance Certificates', desc: 'A legal requirement for selling or letting any property. Our assessors deliver accurate, compliant EPCs fast.', Icon: Home },
  { slug: 'eicr', code: 'EICR', title: 'Electrical Installation Condition Reports', desc: 'Full electrical safety testing and certification for landlords, homeowners and businesses.', Icon: Zap },
  { slug: 'floor-plans', code: 'FLOOR PLANS', title: 'Floor Plan Services', desc: 'Precise, professionally drawn floor plans for sales listings, lettings and planning applications.', Icon: LayoutGrid },
  { slug: 'compliance', code: 'COMPLIANCE', title: 'Property Compliance', desc: 'A complete compliance package covering every certificate and check your property needs.', Icon: BadgeCheck },
];

const process = [
  'Book online or by phone in under 2 minutes',
  'Assessor visits at a time that suits you',
  'Digital report delivered within 24-48 hours',
  'Ongoing support if anything needs clarifying',
];

const whyUs = [
  'Fixed, transparent pricing on every service — no hidden fees',
  'Fully accredited, insured assessors for every job',
  'Fast turnaround, with same-day slots often available',
  'A single team you can call for any compliance need',
];

const stats = [
  { value: 1000, suffix: '+', label: 'Happy Clients', Icon: Users },
  { value: 5000, suffix: '+', label: 'Reports Delivered', Icon: FileText },
  { value: 10, suffix: '+', label: 'Years Experience', Icon: Building2 },
  { value: 4, suffix: '.9★', label: 'Customer Rated', Icon: Star },
];

const faqs = [
  { q: 'Which service do I actually need?', a: 'If you\'re selling or letting, you\'ll need an EPC. Landlords also require an EICR. Selling agents often request a floor plan too — or bundle all three with our compliance package.' },
  { q: 'Can I book more than one service at once?', a: 'Yes — many clients combine EPC, EICR and floor plan into a single visit through our compliance package, saving time and money.' },
  { q: 'How quickly can you turn a service around?', a: 'Most reports are delivered within 24-48 hours of the appointment, with same-day service available in some areas.' },
  { q: 'Do you serve commercial properties?', a: 'Yes — all four services are available for residential, commercial and mixed-use properties.' },
  { q: 'Is pricing the same across all services?', a: 'Pricing varies by service and property size, but is always fixed and quoted upfront before you book.' },
];

export default function ServicesPage() {
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
              OUR SERVICES
            </p>
            <h1 className={`font-sans text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Everything Your Property<br /><span className="text-gold">Needs to Stay Compliant</span>
            </h1>
            <p className={`text-white/85 text-lg max-w-2xl mx-auto mb-9 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              From EPCs to full compliance packages, our accredited assessors cover every
              certificate you're legally required to have — with fast turnarounds and fair pricing.
            </p>
            <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Link href="/booking" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:bg-gold-light transition-colors duration-300">
                BOOK AN APPOINTMENT <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6 grid sm:grid-cols-2 gap-8">
            {services.map(({ slug, code, title, desc, Icon }) => (
              <div key={slug} className="border border-navy/10 rounded-2xl p-8 hover:border-gold/50 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors duration-300">
                  <Icon size={30} strokeWidth={1.6} className="text-gold-dark" />
                </div>
                <p className="text-gold-dark text-xs font-bold tracking-widest mb-2">{code}</p>
                <h3 className="text-navy font-bold text-xl mb-3">{title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed mb-6">{desc}</p>
                <Link href={`/services/${slug}`} className="inline-flex items-center gap-1.5 text-navy font-bold text-sm hover:gap-3 transition-all duration-300">
                  LEARN MORE <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="bg-white py-24 border-t border-navy/5">
          <div className="max-w-content mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">WHY CHOOSE US</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy leading-tight mb-6">
                Compliance Done Properly, Every Time
              </h2>
              <div className="space-y-4 mb-8">
                {whyUs.map((w) => (
                  <div key={w} className="flex items-start gap-3">
                    <CheckCircle2 size={22} className="text-gold-dark shrink-0 mt-0.5" />
                    <p className="text-navy/70">{w}</p>
                  </div>
                ))}
              </div>
              <Link href="/about" className="inline-flex items-center gap-2 bg-navy text-white font-bold text-sm tracking-wide px-7 py-3.5 rounded hover:bg-navy-light transition-colors duration-200">
                MORE ABOUT US <ArrowRight size={16} />
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?fm=jpg&q=80&w=1200&auto=format&fit=crop"
                alt="Certified assessor at work"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="bg-white py-20 border-t border-navy/5">
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

        {/* HOW IT WORKS TEASER */}
        <section className="bg-navy-dark py-24">
          <div className="max-w-content mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold text-sm font-bold tracking-[0.25em] mb-3">SIMPLE PROCESS</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-6">
                Booking Any Service Takes Minutes
              </h2>
              <div className="space-y-4 mb-8">
                {process.map((step) => (
                  <div key={step} className="flex items-start gap-3">
                    <CheckCircle2 size={22} className="text-gold shrink-0 mt-0.5" />
                    <p className="text-white/70">{step}</p>
                  </div>
                ))}
              </div>
              <Link href="/how-it-works" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-7 py-3.5 rounded hover:bg-gold-light transition-colors duration-200">
                SEE HOW IT WORKS <ArrowRight size={16} />
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1608303588026-884930af2559?fm=jpg&q=80&w=1200&auto=format&fit=crop"
                alt="Reviewing property documents"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6 max-w-3xl">
            <div className="text-center mb-14">
              <p className="text-gold-dark text-sm font-bold tracking-[0.3em] mb-3">FAQS</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">Service Questions Answered</h2>
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
              Not Sure Which Service You Need?
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Get in touch and we'll point you toward exactly the right certificate for your situation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:bg-gold-light transition-colors duration-300">
                CONTACT US <ArrowRight size={16} />
              </Link>
              <Link href="/booking" className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:border-gold hover:text-gold transition-colors duration-300">
                BOOK AN APPOINTMENT
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}