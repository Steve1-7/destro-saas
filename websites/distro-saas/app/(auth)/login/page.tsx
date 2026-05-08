'use client';

// app/(auth)/login/page.tsx
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Github, Chrome, Eye, EyeOff, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'magic' | 'password' | 'oauth'>('magic');
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

  async function handleEmailPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
    setLoading(false);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  async function handleOAuth(provider: 'google' | 'github') {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
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
                We sent a confirmation to <strong style={{ color: 'var(--text)' }}>{email}</strong>
              </p>
              <button onClick={() => { setSent(false); setActiveTab('magic'); }} className="text-sm mt-4"
                style={{ color: 'var(--accent)' }}>
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex p-1 rounded-lg mb-4" style={{ background: 'var(--bg2)' }}>
                <button
                  onClick={() => setActiveTab('magic')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === 'magic' ? 'bg-[var(--bg3)] text-[var(--text)]' : 'text-[var(--text3)]'
                  }`}
                >
                  <Mail size={14} />
                  Magic Link
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === 'password' ? 'bg-[var(--bg3)] text-[var(--text)]' : 'text-[var(--text3)]'
                  }`}
                >
                  <Lock size={14} />
                  Email/Pass
                </button>
                <button
                  onClick={() => setActiveTab('oauth')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === 'oauth' ? 'bg-[var(--bg3)] text-[var(--text)]' : 'text-[var(--text3)]'
                  }`}
                >
                  <Chrome size={14} />
                  OAuth
                </button>
              </div>

              {error && (
                <p className="text-xs font-mono mb-3 text-center" style={{ color: 'var(--danger)' }}>{error}</p>
              )}

              {/* Magic Link Form */}
              {activeTab === 'magic' && (
                <form onSubmit={handleMagicLink} className="flex flex-col gap-4">
                  <div>
                    <label className="text-[11px] font-mono block mb-1.5" style={{ color: 'var(--text3)' }}>
                      Email address
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border"
                      style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
                      <Mail size={16} style={{ color: 'var(--text3)' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="flex-1 bg-transparent outline-none text-sm"
                        style={{ color: 'var(--text)' }}
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading || !email}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
                    style={{ background: 'var(--accent)', color: '#040d0a' }}>
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                    Send magic link
                  </button>
                </form>
              )}

              {/* Email/Password Form */}
              {activeTab === 'password' && (
                <form onSubmit={handleEmailPassword} className="flex flex-col gap-4">
                  <div>
                    <label className="text-[11px] font-mono block mb-1.5" style={{ color: 'var(--text3)' }}>
                      Email address
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border"
                      style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
                      <User size={16} style={{ color: 'var(--text3)' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="flex-1 bg-transparent outline-none text-sm"
                        style={{ color: 'var(--text)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-mono block mb-1.5" style={{ color: 'var(--text3)' }}>
                      Password
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border"
                      style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
                      <Lock size={16} style={{ color: 'var(--text3)' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="flex-1 bg-transparent outline-none text-sm"
                        style={{ color: 'var(--text)' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ color: 'var(--text3)' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={loading || !email || !password}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
                      style={{ background: 'var(--accent)', color: '#040d0a' }}>
                      {loading ? <Loader2 size={14} className="animate-spin" /> : 'Sign In'}
                    </button>
                    <button type="button" onClick={handleSignUp} disabled={loading || !email || !password}
                      className="px-4 py-2.5 rounded-lg text-sm font-medium border transition-all disabled:opacity-40"
                      style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
                      Sign Up
                    </button>
                  </div>
                </form>
              )}

              {/* OAuth Options */}
              {activeTab === 'oauth' && (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleOAuth('google')}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-all disabled:opacity-40"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    <Chrome size={18} style={{ color: '#4285F4' }} />
                    Continue with Google
                  </button>
                  <button
                    onClick={() => handleOAuth('github')}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-all disabled:opacity-40"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    <Github size={18} style={{ color: 'var(--text)' }} />
                    Continue with GitHub
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-center text-[11px] mt-4" style={{ color: 'var(--text3)' }}>
          No password required · Secured by Supabase Auth
        </p>
      </div>
    </div>
  );
}
