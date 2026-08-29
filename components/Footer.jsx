'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';


function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { el.classList.add('is-visible'); return; }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
        else entry.target.classList.remove('is-visible');
      }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const delayClass = delay > 0 ? `reveal-delay-${delay}` : '';
  return <div ref={ref} className={`reveal ${delayClass} ${className}`}>{children}</div>;
}



const quickLinks = ['Home', 'About Us', 'Services', 'How It Works', 'Pricing', 'Contact Us'];
const ourServices = ['EPC Certificates', 'EICR Reports', 'Floor Plans', 'Property Compliance'];
const information = ['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Sitemap'];

export default function Footer() {
  return (
    <footer className="bg-navy">
      {/* Trust bar */}


      <Reveal className="max-w-content mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_1fr] gap-10">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
            <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
              <path d="M4 36V16L12 10V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
              <path d="M12 36V6L20 2V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
              <path d="M20 36V10L28 4V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
              <path d="M28 36V14L36 8V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
              <line x1="2" y1="36" x2="38" y2="36" stroke="#D69C4D" strokeWidth="2.2" />
            </svg>
            <span>
              <span className="block text-white text-base font-bold tracking-wide leading-none">MANCHESTER</span>
              <span className="block text-gold text-xs font-semibold tracking-[0.2em] leading-none mt-0.5">CERTIFY</span>
            </span>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed mb-5 max-w-xs">
            Professional, reliable EPC certification services you can trust. Keeping your property safe, legal and compliant.
          </p>
          <div className="flex gap-3">
            {['F', 'in', 'IG'].map((s) => (
              <a key={s} href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:border-gold hover:text-gold transition-colors duration-200 text-xs">
                {s}
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Quick Links" items={quickLinks} />
        <FooterCol title="Our Services" items={ourServices} />
        <FooterCol title="Information" items={information} />

        <div>
          <h4 className="text-white font-bold text-sm tracking-wide mb-4">Contact Us</h4>
          <ul className="space-y-3 text-white/60 text-sm">
            <li>020 7946 0958</li>
            <li>info@manchestercertify.co.uk</li>
            <li>Manchester, United Kingdom</li>
          </ul>
        </div>
      </Reveal>

      <div className="border-t border-white/10">
        <div className="max-w-content mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 text-white/40 text-xs">
          <p>© {new Date().getFullYear()} Manchester Certify. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 className="text-white font-bold text-sm tracking-wide mb-4">{title}</h4>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item}>
            <Link href="#" className="text-white/60 text-sm hover:text-gold transition-colors duration-200">{item}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}