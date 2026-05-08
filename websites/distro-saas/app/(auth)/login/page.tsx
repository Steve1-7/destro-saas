'use client';

// app/(auth)/login/page.tsx
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();
  const router = useRouter();

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      {/* Neural grid bg */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#040d0a" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="font-display font-bold text-2xl">Distro</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text3)' }}>
            Content distribution for developers
          </p>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📬</div>
              <h2 className="font-display font-semibold mb-2">Check your inbox</h2>
              <p className="text-sm" style={{ color: 'var(--text3)' }}>
                We sent a magic link to <strong style={{ color: 'var(--text)' }}>{email}</strong>
              </p>
              <button onClick={() => setSent(false)} className="text-sm mt-4"
                style={{ color: 'var(--accent)' }}>
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-mono block mb-1.5" style={{ color: 'var(--text3)' }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg px-3 py-2.5 text-sm border outline-none transition-all"
                  style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>

              {error && (
                <p className="text-xs font-mono" style={{ color: 'var(--danger)' }}>{error}</p>
              )}

              <button type="submit" disabled={loading || !email}
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
                style={{ background: 'var(--accent)', color: '#040d0a' }}>
                {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                Send magic link
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[11px] mt-4" style={{ color: 'var(--text3)' }}>
          No password required · Secured by Supabase Auth
        </p>
      </div>
    </div>
  );
}
