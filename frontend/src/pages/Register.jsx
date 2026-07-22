import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, Phone, User, ShieldAlert, AlertCircle, Sparkles, Layers, Activity } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('ROLE_USER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password, phone, role);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
        <div className="absolute bottom-[-15%] right-[-15%] h-72 w-72 rounded-full bg-[var(--stamp-green)]/10 blur-3xl" />

        <Link to="/" className="flex items-center gap-2.5 group z-10 w-fit">
          <div className="bg-[var(--brass)] text-[var(--charcoal)] p-2 rounded-md border-2 border-[var(--charcoal)] shadow-[3px_3px_0_rgba(0,0,0,0.4)] group-hover:-translate-y-0.5 transition-transform">
            <Layers size={18} />
          </div>
          <span className="qf-heading text-lg tracking-tight">Q-FLOW</span>
        </Link>

        <div className="space-y-6 z-10 my-auto max-w-sm">
          <span className="stamp stamp-green stamp-flat w-fit">New Enrollment</span>
          <h2 className="qf-heading text-4xl leading-[1.05] uppercase pt-1">
            Pull a ticket.<br />Skip the line.
          </h2>
          <p className="text-[var(--muted-on-ink)] text-sm leading-relaxed font-light">
            Register to view live counter status, check in for service, and track your position without standing anywhere.
          </p>

          <div className="pt-6 border-t-2 border-dashed border-[var(--ink-line)] flex items-center gap-3">
            <div className="bg-[var(--ink-soft)] border border-[var(--ink-line)] text-[var(--stamp-green)] p-2.5 rounded-lg">
              <Activity size={16} />
            </div>
            <div>
              <span className="text-[var(--on-ink)] text-xs font-bold block font-mono">SELF-SERVICE SIGN-UP</span>
              <span className="text-[var(--muted-on-ink)] text-[10px]">Choose customer or admin access on registration.</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-[var(--muted-on-ink)] font-mono z-10 tracking-wide">
          © Q-FLOW COUNTER SYSTEMS
        </div>
      </div>

      {/* Right side: Register form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12 relative">
        <div className="qf-panel-paper max-w-md w-full p-8 space-y-6 relative">

          <div className="text-center space-y-2">
            <div className="bg-[var(--charcoal)] text-[var(--paper)] p-3 rounded-lg w-fit mx-auto lg:hidden">
              <UserPlus size={22} />
            </div>
            <span className="qf-label text-[var(--brass-deep)]">New Registration</span>
            <h2 className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>Create Account</h2>
          </div>

          {error && (
            <div className="qf-alert border-[var(--stamp-red)] bg-[rgba(193,67,42,0.08)] text-[var(--stamp-red)]">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="qf-alert border-[var(--stamp-green)] bg-[rgba(63,122,92,0.1)] text-[var(--stamp-green)]">
              <Sparkles size={16} className="shrink-0 mt-0.5 animate-bounce" />
              <span>Ticket issued! Redirecting to sign in...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', icon: User, type: 'text', value: name, set: setName, placeholder: 'John Doe', required: true },
              { label: 'Email Address', icon: Mail, type: 'email', value: email, set: setEmail, placeholder: 'john@example.com', required: true },
              { label: 'Password', icon: Lock, type: 'password', value: password, set: setPassword, placeholder: 'Min 6 characters', required: true, minLength: 6 },
              { label: 'Phone Number', icon: Phone, type: 'tel', value: phone, set: setPhone, placeholder: 'e.g. +91 98765 43210', required: false },
            ].map((f) => (
              <div className="space-y-1.5" key={f.label}>
                <label className="text-[10px] font-bold text-[var(--charcoal)]/60 uppercase tracking-wider font-mono">{f.label}</label>
                <div className="relative">
                  <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--charcoal)]/40" size={16} />
                  <input
                    type={f.type}
                    required={f.required}
                    minLength={f.minLength}
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full bg-white/40 border-2 border-[var(--charcoal)]/15 rounded-lg py-3 pl-11 pr-4 text-[var(--charcoal)] placeholder-[var(--charcoal)]/35 focus:outline-none focus:border-[var(--brass-deep)] text-sm transition-colors"
                  />
                </div>
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--charcoal)]/60 uppercase tracking-wider font-mono">Account Type</label>
              <div className="relative">
                <ShieldAlert className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--charcoal)]/40" size={16} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white/40 border-2 border-[var(--charcoal)]/15 rounded-lg py-3 pl-11 pr-4 text-[var(--charcoal)] focus:outline-none focus:border-[var(--brass-deep)] text-sm transition-colors appearance-none cursor-pointer"
                >
                  <option value="ROLE_USER">Customer (ROLE_USER)</option>
                  <option value="ROLE_ADMIN">Administrator (ROLE_ADMIN)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || success}
              className="btn-brass w-full py-3.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <span className="h-4 w-4 border-2 border-[var(--charcoal)]/30 border-t-[var(--charcoal)] rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Register</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4 text-xs text-[var(--charcoal)]/60 border-t-2 border-dashed border-[var(--charcoal)]/15">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--brass-deep)] hover:underline font-bold">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;