'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck, PoundSterling, MapPin, Target, Award, Users, Building2,
  FileText, ArrowRight, Plus, CheckCircle2, Headset, Home,
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

const values = [
  { title: 'Integrity', desc: 'Honest assessments, no shortcuts, no inflated reports — just accurate compliance you can rely on.', Icon: ShieldCheck },
  { title: 'Precision', desc: 'Every certificate follows strict RICS and government-accredited standards to the letter.', Icon: Target },
  { title: 'Accessibility', desc: 'Transparent, fixed pricing with no hidden fees — quality compliance shouldn\'t cost a fortune.', Icon: PoundSterling },
  { title: 'Local Focus', desc: 'We know Manchester\'s housing stock inside out, from Victorian terraces to new-build apartments.', Icon: MapPin },
];

const stats = [
  { value: 1000, suffix: '+', label: 'Happy Clients', Icon: Users },
  { value: 5000, suffix: '+', label: 'Reports Delivered', Icon: FileText },
  { value: 10, suffix: '+', label: 'Combined Assessor Experience', Icon: Building2 },
  { value: 100, suffix: '%', label: 'Accredited Assessors', Icon: Award },
];

const whatWeDo = [
  { title: 'Residential Compliance', desc: 'EPCs, EICRs and floor plans for homeowners, landlords and letting agents across Greater Manchester.', Icon: Home },
  { title: 'Commercial Compliance', desc: 'Electrical safety and energy performance certification for offices, shops and mixed-use buildings.', Icon: Building2 },
  { title: 'Portfolio Support', desc: 'Ongoing compliance management for landlords and agents handling multiple properties at once.', Icon: ShieldCheck },
];

const approach = [
  'We book you in fast — most appointments confirmed within 24 hours of enquiry',
  'One assessor, start to finish — no handoffs, no repeated explanations',
  'Every report double-checked before it reaches your inbox',
  'Plain-English write-ups so you actually understand what you\'re looking at',
  'A real phone number and a real person if you have questions afterward',
];

const team = [
  { role: 'Domestic Energy Assessors', desc: 'DEA-accredited specialists producing EPCs across all property types.', Icon: Home },
  { role: 'NICEIC Electricians', desc: 'Registered electricians carrying out full EICR inspections and testing.', Icon: ShieldCheck },
  { role: 'RICS-Standard Surveyors', desc: 'Trained to measure and produce floor plans to industry specification.', Icon: Target },
  { role: 'Client Support Team', desc: 'On hand by phone and email to help with bookings, questions and reports.', Icon: Headset },
];

const areas = [
  'Manchester City Centre', 'Salford', 'Stockport', 'Trafford',
  'Bolton', 'Oldham', 'Rochdale', 'Tameside',
];

const faqs = [
  { q: 'Are your assessors actually accredited?', a: 'Yes — every assessor holds the relevant accreditation for their service: DEA for EPCs, NICEIC for electrical work, and RICS-standard training for floor plans.' },
  { q: 'Do you only work with individual homeowners?', a: 'No. We work with homeowners, landlords, letting agents, estate agents and commercial property managers across Greater Manchester.' },
  { q: 'What areas do you cover?', a: 'Manchester, Salford, Stockport, Trafford, Bolton, Oldham, Rochdale, Tameside and the surrounding Greater Manchester area.' },
  { q: 'Can I speak to someone before booking?', a: 'Of course — call, email or use our contact form and a member of the team will talk you through exactly what you need.' },
  { q: 'Do you offer any guarantees on your reports?', a: 'Every report is quality-checked before delivery. If anything is unclear or incorrect, we\'ll correct it at no extra cost.' },
  { q: 'How do you keep pricing fair?', a: 'We publish fixed, upfront pricing per service with no hidden add-ons, and offer bundle discounts for combined bookings.' },
];

export default function AboutPage() {
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
            <div className="absolute inset-0 bg-navy/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />
          </div>
          <div className="relative z-10 max-w-content mx-auto px-6 text-center">
            <p className={`text-gold text-sm font-bold tracking-[0.3em] mb-5 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              ABOUT MANCHESTER CERTIFY
            </p>
            <h1 className={`font-sans text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Your Local Compliance<br /><span className="text-gold">Experts in Manchester</span>
            </h1>
            <p className={`text-white/85 text-lg max-w-2xl mx-auto mb-9 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              We help homeowners, landlords and estate agents across Greater Manchester stay safe,
              legal and compliant — with fast turnarounds, fair pricing and honest, accredited
              reporting on every single job.
            </p>
            <div className={`flex flex-wrap justify-center gap-4 mb-14 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Link href="/booking" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:bg-gold-light transition-colors duration-300">
                BOOK AN APPOINTMENT <ArrowRight size={16} />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:border-gold hover:text-gold transition-colors duration-300">
                VIEW OUR SERVICES
              </Link>
            </div>

            <div className={`flex flex-wrap justify-center gap-3 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              {areas.map((a) => (
                <span key={a} className="text-white/70 text-xs font-semibold tracking-wide bg-white/5 border border-white/10 rounded-full px-4 py-2">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* OUR STORY */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">OUR STORY</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy leading-tight mb-5">
                Built by Assessors Who Actually Care About Compliance
              </h2>
              <p className="text-navy/70 leading-relaxed mb-4">
                Manchester Certify exists because too many property owners were getting rushed,
                inaccurate certificates from assessors who treated compliance as a box-ticking
                exercise. We set out to do it differently — properly qualified people, properly
                checked reports, and a process that respects your time.
              </p>
              <p className="text-navy/70 leading-relaxed mb-4">
                We're a team of fully qualified, DEA-accredited and NICEIC-registered professionals
                covering EPC, EICR, floor plans and full property compliance across Manchester,
                Salford, Stockport, Trafford, Bolton and Oldham.
              </p>
              <p className="text-navy/70 leading-relaxed mb-8">
                Every report we issue is checked twice, delivered on time, and written so you can
                actually understand what it means for your property — not just a certificate you
                file away and forget about.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-navy text-white font-bold text-sm tracking-wide px-7 py-3.5 rounded hover:bg-navy-light transition-colors duration-200">
                GET IN TOUCH <ArrowRight size={16} />
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

        {/* WHAT WE DO */}
        <section className="bg-white py-24 border-t border-navy/5">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">WHAT WE DO</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">Compliance Across Every Property Type</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {whatWeDo.map(({ title, desc, Icon }) => (
                <div key={title} className="border border-navy/10 rounded-xl p-7 hover:border-gold/50 hover:shadow-lg transition-all duration-300">
                  <Icon size={30} strokeWidth={1.6} className="text-gold-dark mb-5" />
                  <h3 className="text-navy font-bold text-lg mb-3">{title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="bg-navy-dark py-24">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-gold text-sm font-bold tracking-[0.3em] mb-3">WHAT WE STAND FOR</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-white">Our Core Values</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map(({ title, desc, Icon }) => (
                <div key={title} className="bg-white/[0.03] border border-white/10 rounded-xl p-7">
                  <Icon size={32} strokeWidth={1.6} className="text-gold mb-5" />
                  <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS — count-up on first view */}
        <section className="bg-white py-20 border-b border-navy/5">
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

        {/* OUR APPROACH */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1608303588026-884930af2559?fm=jpg&q=80&w=1200&auto=format&fit=crop"
                alt="Reviewing property compliance documents"
                className="w-full h-[420px] object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">OUR APPROACH</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy leading-tight mb-6">
                Compliance Without the Hassle
              </h2>
              <div className="space-y-4 mb-8">
                {approach.map((a) => (
                  <div key={a} className="flex items-start gap-3">
                    <CheckCircle2 size={22} className="text-gold-dark shrink-0 mt-0.5" />
                    <p className="text-navy/70">{a}</p>
                  </div>
                ))}
              </div>
              <Link href="/how-it-works" className="inline-flex items-center gap-2 bg-navy text-white font-bold text-sm tracking-wide px-7 py-3.5 rounded hover:bg-navy-light transition-colors duration-200">
                SEE HOW IT WORKS <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* OUR TEAM */}
        <section className="bg-navy-dark py-24">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-gold text-sm font-bold tracking-[0.3em] mb-3">OUR TEAM</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-white">Qualified People Behind Every Report</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map(({ role, desc, Icon }) => (
                <div key={role} className="bg-white/[0.03] border border-white/10 rounded-xl p-7">
                  <Icon size={30} strokeWidth={1.6} className="text-gold mb-5" />
                  <h3 className="text-white font-bold text-base mb-3">{role}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
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
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">Common Questions About Us</h2>
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
              Ready to Work With a Team You Can Trust?
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Book your assessment today and see why Manchester's landlords and homeowners choose us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/booking" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:bg-gold-light transition-colors duration-300">
                BOOK AN APPOINTMENT <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:border-gold hover:text-gold transition-colors duration-300">
                CONTACT US
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}