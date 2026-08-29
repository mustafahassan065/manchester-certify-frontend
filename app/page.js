'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck, Clock, PoundSterling, Headset, Home, Zap, LayoutGrid,
  BadgeCheck, Users, FileText, Building2, Star, ArrowRight, Plus,
  Phone, Mail, MapPin,
} from 'lucide-react';

/* ---------- Reveal ---------- */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
          else entry.target.classList.remove('is-visible');
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const delayClass = delay > 0 ? `reveal-delay-${delay}` : '';
  return (
    <div ref={ref} className={`reveal ${delayClass} ${className}`}>
      {children}
    </div>
  );
}

/* ---------- Counter ---------- */
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
    <span ref={ref} className="text-4xl sm:text-5xl font-extrabold text-white tabular-nums">
      {count}{suffix}
    </span>
  );
}

/* ---------- Data ---------- */
const services = [
  { code: 'EPC', title: 'Energy Performance Certificates', desc: 'Fast, reliable EPC assessments for residential and commercial properties.', Icon: Home },
  { code: 'EICR', title: 'Electrical Installation Condition Reports', desc: 'Ensuring your electrical systems are safe and compliant with regulations.', Icon: Zap },
  { code: 'FLOOR PLAN', title: 'Floor Plan Services', desc: 'Accurate, professional floor plans for sales, lettings and planning purposes.', Icon: LayoutGrid },
  { code: 'CERTIFIED', title: 'Qualified. Insured. Trusted.', desc: 'All reports are carried out by qualified professionals and delivered promptly.', Icon: BadgeCheck },
];

const whyChooseUs = [
  { title: 'Fully Qualified', desc: 'Certified professionals you can rely on.', Icon: ShieldCheck },
  { title: 'Fast Turnaround', desc: 'Quick appointments and same-day reports where possible.', Icon: Clock },
  { title: 'Competitive Pricing', desc: 'High quality service at affordable rates.', Icon: PoundSterling },
  { title: 'Local & Reliable', desc: 'Proudly serving Manchester and surrounding areas.', Icon: MapPin },
  { title: 'Excellent Support', desc: 'Friendly, helpful and responsive team.', Icon: Headset },
  { title: 'Accurate Reports', desc: 'Detailed, compliant and easy to understand reports.', Icon: FileText },
];

const stats = [
  { value: 250, suffix: '+', label: 'Happy Clients', Icon: Users },
  { value: 900, suffix: '+', label: 'Reports Completed', Icon: FileText },
  { value: 5, suffix: '+', label: 'Years Experience', Icon: Building2 },
  { value: 4.9, suffix: '★', label: 'Customer Rated', Icon: Star },
];

const faqs = [
  { q: 'How quickly can I get an EPC or EICR report?', a: 'In most cases we offer same-day or next-day appointments across Manchester, with reports delivered digitally within 24-48 hours of the assessment.' },
  { q: 'Are your assessors fully qualified and accredited?', a: 'Yes. Every assessor on our team is fully qualified, insured, and accredited by the relevant governing bodies for the certificates they issue.' },
  { q: 'Which areas do you cover?', a: 'We proudly serve Manchester and the surrounding Greater Manchester area, including Salford, Stockport, Trafford, Bolton and Oldham.' },
  { q: 'Do I legally need an EPC or EICR?', a: 'An EPC is a legal requirement when selling or letting a property. An EICR is strongly recommended for landlords and required under most tenancy regulations at least every 5 years.' },
  { q: 'How do I book an appointment?', a: 'Simply use the "Book an Appointment" button, choose a convenient date and time, and one of our certified assessors will confirm your visit.' },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <Navbar />

      <main>
        {/* ================= HERO ================= */}
        <section className="relative bg-navy pt-32 pb-0 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/bg.jpg"
              alt="Manchester skyline at dusk"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />
          </div>

          <div className="relative z-10 max-w-content mx-auto px-6 pt-8 pb-20 md:pb-28 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
            <div>
              <p className={`text-gold text-sm font-bold tracking-[0.3em] mb-5 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                PROFESSIONAL. RELIABLE. CERTIFIED.
              </p>
              <h1 className={`font-sans text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-white leading-[1.1] mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                Property Compliance
                <br />
                <span className="text-gold">Made Simple.</span>
              </h1>
              <p className={`text-white/90 text-lg max-w-xl mb-9 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                Expert certification services you can trust. Keeping your property safe, legal and compliant.
              </p>

              <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <Link href="/booking" className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:bg-gold-light transition-all duration-300 shadow-lg shadow-black/20 hover:-translate-y-0.5">
                  BOOK AN APPOINTMENT
                </Link>
                <Link href="/quote" className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-bold text-sm tracking-wide px-8 py-4 rounded-md hover:border-gold hover:text-gold hover:-translate-y-0.5 transition-all duration-300">
                  GET A QUOTE
                </Link>
              </div>
            </div>

            <div className={`hidden lg:flex justify-center transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
  <svg width="280" height="320" viewBox="0 0 260 300" fill="none" className="animate-float">
    <defs>
      <linearGradient id="shieldEdge" x1="20" y1="10" x2="240" y2="290" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF3DC" />
        <stop offset="50%" stopColor="#D69C4D" />
        <stop offset="100%" stopColor="#B87F35" />
      </linearGradient>
    </defs>
    <path
      d="M130 10L240 50V150C240 220 190 270 130 290C70 270 20 220 20 150V50L130 10Z"
      stroke="url(#shieldEdge)"
      strokeWidth="4"
      fill="rgba(214,156,77,0.05)"
      className="drop-shadow-[0_0_22px_rgba(214,156,77,0.7)]"
    />
    <path
      d="M85 150l30 32 62-66"
      stroke="url(#shieldEdge)"
      strokeWidth="9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_16px_rgba(214,156,77,0.8)]"
    />
  </svg>
</div>
          </div>

          {/* ---- Services strip embedded at hero bottom ---- */}
         <div className="relative z-10 max-w-content mx-auto px-6 -mt-6">
            
              <div className="bg-navy-dark/95 backdrop-blur-sm border-2 border-b-0 border-gold/60 rounded-t-2xl grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gold/30">
                {services.map(({ code, title, desc, Icon }) => (
                  <div key={code} className="group p-8">
                    <Icon size={38} strokeWidth={1.6} className="text-gold mb-5" />
                    <p className="text-gold text-xs font-bold tracking-widest mb-1">{code}</p>
                    <h3 className="text-white font-bold text-lg mb-3 leading-snug">{title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-5">{desc}</p>
                    <a href="#" className="inline-flex items-center gap-1.5 text-gold text-xs font-bold tracking-wide group-hover:gap-3 transition-all duration-300">
                      LEARN MORE <ArrowRight size={14} />
                    </a>
                  </div>
                ))}
              </div>
            
          </div>
        </section>

        {/* ================= ABOUT + WHY CHOOSE US ================= */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6 grid lg:grid-cols-[0.85fr_1.15fr] gap-16">
            <Reveal>
              <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-3">ABOUT US</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy leading-tight mb-5">
                Your Local Compliance Experts in Manchester
              </h2>
              <p className="text-navy/70 leading-relaxed mb-4">
                At Manchester Certify, we provide a range of essential property certification services to
                homeowners, landlords, estate agents and businesses across Greater Manchester.
              </p>
              <p className="text-navy/70 leading-relaxed mb-8">
                We pride ourselves on fast turnaround times, competitive pricing and exceptional customer service.
              </p>
              <Link href="/about" className="inline-block bg-navy text-white font-bold text-sm tracking-wide px-7 py-3.5 rounded hover:bg-navy-light transition-colors duration-200">
                LEARN MORE ABOUT US
              </Link>
            </Reveal>

            <div>
              <Reveal delay={1}>
                <p className="text-gold-dark text-sm font-bold tracking-[0.25em] mb-6">WHY CHOOSE US?</p>
              </Reveal>
              <div className="grid sm:grid-cols-3 gap-x-8 gap-y-9">
                {whyChooseUs.map(({ title, desc, Icon }, i) => (
                  <Reveal key={title} delay={(i % 4) + 1} className="flex gap-3.5">
                    <Icon size={26} strokeWidth={1.6} className="text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-navy font-bold text-sm mb-1">{title}</p>
                      <p className="text-navy/60 text-xs leading-relaxed">{desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="relative bg-navy-dark py-16 border-y border-white/10 overflow-hidden">
          <div className="relative max-w-content mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map(({ label, value, suffix, Icon }, i) => (
              <Reveal key={label} delay={(i % 4) + 1} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                  <Icon size={26} strokeWidth={1.8} className="text-gold" />
                </div>
                <div>
                  <Counter value={value} suffix={suffix} />
                  <p className="text-white/55 text-xs font-semibold tracking-wide mt-1">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="bg-white py-24">
          <div className="max-w-content mx-auto px-6 max-w-3xl">
            <Reveal className="text-center mb-14">
              <p className="text-gold-dark text-sm font-bold tracking-[0.3em] mb-3">FAQS</p>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-navy">Frequently Asked Questions</h2>
            </Reveal>

            <div className="space-y-3">
              {faqs.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <Reveal key={item.q} delay={(i % 4) + 1}>
                    <div className={`border rounded-lg overflow-hidden transition-colors duration-300 ${isOpen ? 'border-gold/50 bg-gold/[0.03]' : 'border-navy/10'}`}>
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
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>{/* ================= CONTACT ================= */}
<section className="bg-navy py-24">
  <div className="max-w-content mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
    <Reveal>
      <p className="text-gold text-sm font-bold tracking-[0.3em] mb-3">CONTACT US</p>
      <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight">
        Get In Touch With Our Team
      </h2>
      <p className="text-white/60 leading-relaxed mb-10 max-w-md">
        Have a question or ready to book? Send us a message and one of our certified assessors will get back to you shortly.
      </p>

      <div className="space-y-6">
        {[
          { label: 'Call Us', value: '020 7946 0958', Icon: Phone },
          { label: 'Email Us', value: 'info@manchestercertify.co.uk', Icon: Mail },
          { label: 'Visit Us', value: 'Manchester, United Kingdom', Icon: MapPin },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="flex items-center gap-4">
            <Icon size={22} strokeWidth={1.8} className="text-gold shrink-0" />
            <div>
              <p className="text-white/45 text-xs tracking-wide">{label}</p>
              <p className="text-white font-semibold text-sm">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </Reveal>

    <Reveal delay={1} className="bg-white rounded-xl p-8 shadow-2xl">
      <form className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-navy text-xs font-bold tracking-wide mb-2">FULL NAME</label>
            <input type="text" className="w-full border border-navy/15 rounded px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold transition-shadow" placeholder="John Smith" />
          </div>
          <div>
            <label className="block text-navy text-xs font-bold tracking-wide mb-2">PHONE</label>
            <input type="tel" className="w-full border border-navy/15 rounded px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold transition-shadow" placeholder="07000 000000" />
          </div>
        </div>
        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">EMAIL</label>
          <input type="email" className="w-full border border-navy/15 rounded px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold transition-shadow" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">SERVICE NEEDED</label>
          <select className="w-full border border-navy/15 rounded px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold transition-shadow">
            <option>EPC Certificate</option>
            <option>EICR Report</option>
            <option>Floor Plan</option>
            <option>Property Compliance</option>
          </select>
        </div>
        <div>
          <label className="block text-navy text-xs font-bold tracking-wide mb-2">MESSAGE</label>
          <textarea rows={4} className="w-full border border-navy/15 rounded px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold resize-none transition-shadow" placeholder="Tell us about your property..." />
        </div>
        <button type="submit" className="w-full bg-gold text-navy font-bold text-sm tracking-wide py-4 rounded hover:bg-navy hover:text-white transition-colors duration-300">
          SEND MESSAGE
        </button>
      </form>
    </Reveal>
  </div>
</section>
      </main>

      <Footer />
    </>
  );
}