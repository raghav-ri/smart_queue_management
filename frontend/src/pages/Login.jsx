import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, KeyRound, Ticket, Layers, Activity } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/join-queue');
      }
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="qf-page flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">

      {/* Left side: Counter signage column */}
      <div className="hidden lg:flex lg:col-span-5 border-r border-[var(--ink-line)] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-[-15%] left-[-15%] h-72 w-72 rounded-full bg-[var(--brass)]/10 blur-3xl" />

        <Link to="/" className="flex items-center gap-2.5 group z-10 w-fit">
          <div className="bg-[var(--brass)] text-[var(--charcoal)] p-2 rounded-md border-2 border-[var(--charcoal)] shadow-[3px_3px_0_rgba(0,0,0,0.4)] group-hover:-translate-y-0.5 transition-transform">
            <Layers size={18} />
          </div>
          <span className="qf-heading text-lg tracking-tight">Q-FLOW</span>
        </Link>

        <div className="space-y-6 z-10 my-auto max-w-sm">
          <span className="qf-eyebrow">Counter №1 — Sign In</span>
          <h2 className="qf-heading text-4xl leading-[1.05] uppercase">
            Take your place<br />in line, digitally.
          </h2>
          <p className="text-[var(--muted-on-ink)] text-sm leading-relaxed font-light">
            Sign in to watch your position update live, manage your ticket, or run the counter desk from your admin console.
          </p>

          <div className="pt-6 border-t-2 border-dashed border-[var(--ink-line)] flex items-center gap-3">
            <div className="bg-[var(--ink-soft)] border border-[var(--ink-line)] text-[var(--brass)] p-2.5 rounded-lg">
              <Activity size={16} />
            </div>
            <div>
              <span className="text-[var(--text-primary)] text-xs font-bold block font-mono">15,000+ TOKENS SERVED</span>
              <span className="text-[var(--muted-on-ink)] text-[10px]">Across every registered counter to date.</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-[var(--muted-on-ink)] font-mono z-10 tracking-wide">
          © Q-FLOW COUNTER SYSTEMS
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12 relative">
        <div className="qf-panel-paper max-w-md w-full p-8 space-y-6 relative">

          <div className="text-center space-y-2">
            <div className="bg-[var(--charcoal)] text-[var(--paper)] p-3 rounded-lg w-fit mx-auto lg:hidden">
              <KeyRound size={22} />
            </div>
            <span className="qf-label text-[var(--brass-deep)]">Ticket Window</span>
            <h2 className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>Sign In</h2>
          </div>

          {error && (
            <div className="qf-alert border-[var(--stamp-red)] bg-[rgba(193,67,42,0.08)] text-[var(--stamp-red)]">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--charcoal)]/60 uppercase tracking-wider font-mono">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--charcoal)]/40" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/40 border-2 border-[var(--charcoal)]/15 rounded-lg py-3 pl-11 pr-4 text-[var(--charcoal)] placeholder-[var(--charcoal)]/35 focus:outline-none focus:border-[var(--brass-deep)] text-sm transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--charcoal)]/60 uppercase tracking-wider font-mono">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--charcoal)]/40" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/40 border-2 border-[var(--charcoal)]/15 rounded-lg py-3 pl-11 pr-4 text-[var(--charcoal)] placeholder-[var(--charcoal)]/35 focus:outline-none focus:border-[var(--brass-deep)] text-sm transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-brass w-full py-3.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <span className="h-4 w-4 border-2 border-[var(--charcoal)]/30 border-t-[var(--charcoal)] rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Log In</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4 text-xs text-[var(--charcoal)]/60 border-t-2 border-dashed border-[var(--charcoal)]/15 flex items-center justify-center gap-1.5">
            <Ticket size={12} />
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--brass-deep)] hover:underline font-bold">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;