'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { saveAssessorSession } from '@/lib/auth';
import { Mail, Lock, UserCog } from 'lucide-react';

export default function AssessorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/auth/assessor/login', { email, password });
      saveAssessorSession(data.token, data.user);
      router.push('/assessor/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
              <path d="M4 36V16L12 10V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
              <path d="M12 36V6L20 2V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
              <path d="M20 36V10L28 4V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
              <path d="M28 36V14L36 8V36" stroke="#D69C4D" strokeWidth="2.2" strokeLinejoin="round" />
              <line x1="2" y1="36" x2="38" y2="36" stroke="#D69C4D" strokeWidth="2.2" />
            </svg>
            <span>
              <span className="block text-white text-lg font-bold tracking-wide">MANCHESTER</span>
              <span className="block text-gold text-sm font-semibold tracking-[0.2em] -mt-1">CERTIFY</span>
            </span>
          </div>
          <p className="text-white/50 text-sm">Assessor Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl space-y-5">
          <div className="w-14 h-14 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center mx-auto">
            <UserCog size={26} className="text-gold-dark" />
          </div>

          <div>
            <label className="block text-navy text-xs font-bold tracking-wide mb-2">EMAIL</label>
            <div className="flex items-center border border-navy/15 rounded px-4 py-3 gap-2 focus-within:ring-2 focus-within:ring-gold">
              <Mail size={16} className="text-navy/40" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-navy text-xs font-bold tracking-wide mb-2">PASSWORD</label>
            <div className="flex items-center border border-navy/15 rounded px-4 py-3 gap-2 focus-within:ring-2 focus-within:ring-gold">
              <Lock size={16} className="text-navy/40" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full text-sm outline-none" />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-navy text-white font-bold text-sm tracking-wide py-3.5 rounded hover:bg-navy-light transition-colors duration-300 disabled:opacity-50">
            {loading ? 'Logging in...' : 'LOG IN'}
          </button>
        </form>
      </div>
    </main>
  );
}