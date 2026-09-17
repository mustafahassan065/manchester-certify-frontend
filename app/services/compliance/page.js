'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  CheckCircle2, ArrowRight, Wind, Gauge, Thermometer, Flame, ShieldCheck,
  Plus, Users, FileCheck, Building2, Clock, Home, Search,
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

const process = [
  { title: 'Fan Installation', desc: 'A large fan is temporarily fitted, usually in a doorway, ready to begin the test.', Icon: Wind },
  { title: 'Sealing Openings', desc: 'Openings to the property are temporarily sealed before the fan is switched on.', Icon: ShieldCheck },
  { title: 'Pressure Measurement', desc: 'Air pressure is gradually increased and decreased, recording the differential at each step.', Icon: Gauge },
  { title: 'Leakage Calculation', desc: 'Airflow at 50 Pa is divided by the building envelope area to give the leakage rate in m³/h.m².', Icon: FileCheck },
];

const whoNeeds = [
  { title: 'New Builds', desc: 'Mandatory for new residential and commercial constructions since 2006 (2010 in Scotland).', Icon: Home },
  { title: 'Extended Commercial Properties', desc: 'Larger commercial extensions typically require testing to meet Part L standards.', Icon: Building2 },
  { title: 'Residential Extensions & Conversions', desc: 'Not always legally required, but often tested for peace of mind and energy performance.', Icon: ShieldCheck },
];

const causes = [
  'Insufficient sealing around windows and doors',
  'Gaps and spaces behind fitted units',
  'Cracks and gaps around electrical sockets',
  'Poorly sealed junctions at the wall-floor connection',
  'Unsealed spaces around pipework and service penetrations',
];

const diagnostics = [
  { title: 'Smoke Testing', desc: 'We fill the building with smoke and pressurise the space, giving a visible indication of problem areas as smoke escapes through openings. Smoke pencils are used for more targeted checks.', Icon: Flame },
  { title: 'Depressurisation', desc: 'The whole building is pressurised, forcing air out through gaps and cracks. As pressure is reduced, draughts reveal exactly where air is escaping.', Icon: Wind },
  { title: 'Thermography', desc: 'Infrared cameras detect the hottest and coldest spots in the building, pinpointing insulation and air leakage issues that aren\'t visible to the eye.', Icon: Thermometer },
];

const stats = [
  { value: 40, suffix: '%', label: 'Potential Heat Loss Prevented', Icon: ShieldCheck },
  { value: 2, suffix: 'hrs', label: 'Typical Test Duration', Icon: Clock },
  { value: 50, suffix: 'Pa', label: 'Standard Test Pressure', Icon: Gauge },
  { value: 24, suffix: 'hrs', label: 'Report Turnaround', Icon: FileCheck },
];

const faqs = [
  { q: 'What is air pressure testing?', a: 'It\'s an assessment of a building\'s air tightness — also called air permeability or leakage rate — identifying uncontrolled air leakage through gaps, holes or cracks in the building fabric.' },
  { q: 'Do I legally need this test?', a: 'Yes, for new residential and commercial constructions in England, Wales and Northern Ireland since 2006, and in Scotland since 2010, to meet design stage SAP or SBEM air permeability targets.' },
  { q: 'What information do you need before testing?', a: 'Complete drawings including floor plans, sections, elevations and a site plan, along with the air tightness target from your design stage SAP or SBEM calculations.' },
  { q: 'How long does the test take?', a: 'Generally no more than two hours, depending on property size and preparation. It should be carried out towards the end of the project.' },
  { q: 'What happens if the building fails the test?', a: 'We offer consultation, on-site training and further diagnostic testing — including smoke testing, depressurisation and thermography — to pinpoint and resolve the problem areas.' },
];

export default function AirTestingPage() {
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
                  PART L COMPLIANCE
                </p>
                <h1 className={`font-sans text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  Part L Air Leakage
                  <br />
                  <span className="text-gold">Testing of Buildings</span>
                </h1>
                <p className={`text-white/85 text-lg max-w-xl mb-9 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  Air pressure testing evaluates a building's air tightness — identifying
                  uncontrolled leakage through gaps, holes or cracks that impact energy
                  efficiency and increase running costs.
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
                  <Wind size={90} strokeWidth={1.3} className="text-gold" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature strip */}
          <div className="relative z-10 max-w-content mx-auto px-6 pb-14">
            <div
              className={`grid sm:grid-cols-3 gap-8 transition-all duration-700 delay-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {[
                { label: '24 Hour Delivery', desc: 'Report emailed within 24 hours', Icon: Clock },
                { label: 'Nationwide Coverage', desc: 'Call, text or order online', Icon: Building2 },
                { label: 'Trusted by Solicitors', desc: 'Relied on across the industry', Icon: ShieldCheck },
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

        {/* WHY YOU NEED IT / PROCESS */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">HOW IT'S DONE</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy mb-5">The Testing Process</h2>
              <p className="text-navy/60 leading-relaxed">
                Once you or your architects provide complete drawings — floor plans, sections,
                elevations and a site plan — we use your design stage SAP or SBEM air tightness
                target as the benchmark for testing.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map(({ title, desc, Icon }) => (
                <div key={title} className="border border-navy/10 rounded-xl p-7 hover:border-gold/50 hover:shadow-lg transition-all duration-300">
                  <Icon size={30} strokeWidth={1.6} className="text-gold-dark mb-5" />
                  <h3 className="text-navy font-bold text-lg mb-3">{title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO NEEDS IT */}
        <section className="bg-white py-24 border-t border-navy/5">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">WHY DO I NEED IT</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">Who Needs This Test</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {whoNeeds.map(({ title, desc, Icon }) => (
                <div key={title} className="border border-navy/10 rounded-xl p-7">
                  <Icon size={30} strokeWidth={1.6} className="text-gold-dark mb-5" />
                  <h3 className="text-navy font-bold text-lg mb-3">{title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ADDRESSING A FAILED TEST */}
        <section className="bg-navy-dark py-24">
          <div className="max-w-content mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1608303588026-884930af2559?fm=jpg&q=80&w=1200&auto=format&fit=crop"
                alt="Reviewing building compliance documents"
                className="w-full h-[420px] object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-gold text-sm font-bold tracking-[0.25em] mb-3">ADDRESSING FAILURE</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-6">
                Common Causes of a Failed Test
              </h2>
              <div className="space-y-4 mb-8">
                {causes.map((c) => (
                  <div key={c} className="flex items-start gap-3">
                    <CheckCircle2 size={22} className="text-gold shrink-0 mt-0.5" />
                    <p className="text-white/70">{c}</p>
                  </div>
                ))}
              </div>
              <Link href="/quote" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-7 py-3.5 rounded hover:bg-gold-light transition-colors duration-200">
                GET A QUOTE <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* DIAGNOSTIC SERVICES */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">FURTHER DIAGNOSTICS</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">Pinpointing Problem Areas</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {diagnostics.map(({ title, desc, Icon }) => (
                <div key={title} className="border border-navy/10 rounded-xl p-7 hover:border-gold/50 hover:shadow-lg transition-all duration-300">
                  <Icon size={30} strokeWidth={1.6} className="text-gold-dark mb-5" />
                  <h3 className="text-navy font-bold text-lg mb-3">{title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="relative bg-navy-dark py-16 border-y border-white/10 overflow-hidden">
          <div className="relative max-w-content mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map(({ value, suffix, label, Icon }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                  <Icon size={26} strokeWidth={1.8} className="text-gold" />
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
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">FAQS</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">Air Testing Questions Answered</h2>
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
              Book Your Air Pressure Test Today
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Nationwide coverage, fast turnaround, and reports trusted by solicitors and
              contractors across the UK.
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