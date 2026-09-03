'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'EPC Certificates', href: '/services/epc' },
      { label: 'EICR Reports', href: '/services/eicr' },
      { label: 'Floor Plans', href: '/services/floor-plans' },
      { label: 'Property Compliance', href: '/services/compliance' },
    ],
  },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy shadow-lg shadow-black/20 py-2' : 'bg-navy py-4'
      }`}
    >
      <nav className="max-w-content mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 shrink-0" onClick={closeMobile}>
          <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
            <path d="M4 36V16L12 10V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M12 36V6L20 2V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M20 36V10L28 4V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M28 36V14L36 8V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
            <line x1="2" y1="36" x2="38" y2="36" stroke="#D69C4D" strokeWidth="2.2" />
          </svg>
          <span className="font-display leading-tight">
            <span className="block text-white text-lg font-bold tracking-wide">MANCHESTER</span>
            <span className="block text-gold text-sm font-semibold tracking-[0.2em] -mt-1">CERTIFY</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li
              key={link.label}
              className="relative"
              onMouseEnter={() => link.children && setServicesOpen(true)}
              onMouseLeave={() => link.children && setServicesOpen(false)}
            >
              <Link href={link.href} className="text-sm font-semibold tracking-wide text-white/90 hover:text-gold transition-colors duration-200 flex items-center gap-1">
                {link.label}
                {link.children && <span className={`text-xs transition-transform ${servicesOpen ? 'rotate-180' : ''}`}>▾</span>}
              </Link>

              {link.children && (
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-56 transition-all duration-200 ${
                    servicesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <ul className="bg-white rounded-lg shadow-xl overflow-hidden">
                    {link.children.map((child) => (
                      <li key={child.label}>
                        <Link href={child.href} className="block px-5 py-3 text-sm text-navy hover:bg-navy/5 hover:text-gold-dark transition-colors">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        <Link
          href="/booking"
          className="hidden lg:inline-flex items-center gap-2 border-2 border-gold text-gold text-sm font-bold tracking-wide px-5 py-2.5 rounded hover:bg-gold hover:text-navy transition-colors duration-200"
        >
          BOOK APPOINTMENT
        </Link>

        <button
          className="lg:hidden text-white"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile nav */}
      <div className={`lg:hidden overflow-hidden transition-[max-height] duration-300 bg-navy ${mobileOpen ? 'max-h-[700px] overflow-y-auto' : 'max-h-0'}`}>
        <ul className="px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <li key={link.label} className="border-b border-white/10">
                <button
                  className="w-full flex items-center justify-between py-2.5 text-white/90 font-semibold text-sm"
                  onClick={() => setMobileServicesOpen((v) => !v)}
                  aria-expanded={mobileServicesOpen}
                >
                  {link.label}
                  <span className={`text-xs transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
                <div className={`overflow-hidden transition-[max-height] duration-300 ${mobileServicesOpen ? 'max-h-96' : 'max-h-0'}`}>
                  <ul className="pb-2 pl-4 flex flex-col gap-1">
                    {link.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          className="block py-2 text-white/70 text-sm hover:text-gold transition-colors"
                          onClick={closeMobile}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ) : (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block py-2.5 text-white/90 font-semibold text-sm border-b border-white/10"
                  onClick={closeMobile}
                >
                  {link.label}
                </Link>
              </li>
            )
          )}
          <li className="pt-3">
            <Link
              href="/booking"
              className="block text-center border-2 border-gold text-gold font-bold text-sm px-5 py-2.5 rounded"
              onClick={closeMobile}
            >
              BOOK APPOINTMENT
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}