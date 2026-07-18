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
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
      
      {/* Left side: Premium Branding Column (Hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-5 bg-slate-950 border-r border-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Glowing highlights */}
        <div className="absolute top-[-20%] left-[-20%] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-15%] h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        
        {/* Header Branding */}
        <Link to="/" className="flex items-center gap-2 group z-10 w-fit">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/15 group-hover:scale-105 transition-all">
            <Layers size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight text-gradient">
            Q-Flow
          </span>
        </Link>

        {/* Feature/Metric Display */}
        <div className="space-y-6 z-10 my-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 w-fit">
            <Sparkles size={10} />
            <span>Join 100% cloud automated queues</span>
          </div>

          <h2 className="text-4xl font-extrabold text-white leading-tight font-display">
            Start Waiting <br />
            Smarter Today.
          </h2>

          <p className="text-slate-400 text-sm font-light leading-relaxed max-w-sm">
            Create your account to view live counter statuses, check in for service tickets, and monitor estimated waiting lines in real-time.
          </p>

          <div className="pt-6 border-t border-slate-900 space-y-4 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/15 text-emerald-400 p-2 rounded-lg">
                <Activity size={16} />
              </div>
              <div>
                <span className="text-slate-200 text-xs font-bold block">Self-Service Registration</span>
                <span className="text-slate-500 text-[10px]">Select Customer or Admin roles based on your portal needs.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer branding */}
        <div className="text-xs text-slate-600 font-mono z-10">
          © Q-Flow SaaS Inc. All rights reserved.
        </div>
      </div>

      {/* Right side: Register Form Column */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12 bg-gradient-premium relative">
        <div className="neo-card max-w-md w-full p-8 rounded-2xl shadow-2xl space-y-6 relative overflow-hidden">
          
          <div className="text-center space-y-2">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-3 rounded-xl text-white shadow-lg w-fit mx-auto lg:hidden">
              <UserPlus size={22} />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 font-display">Create Account</h2>
            <p className="text-xs text-slate-400">Join virtual queues and track waiting times</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl flex items-start gap-2 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl flex items-start gap-2 text-xs">
              <Sparkles size={16} className="shrink-0 mt-0.5 animate-bounce" />
              <span>Registration successful! Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-450 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-550" size={16} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-900/30 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-550 focus:outline-none focus:border-indigo-500 text-sm transition-smooth"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-450 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-555" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-900/30 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-555 focus:outline-none focus:border-indigo-500 text-sm transition-smooth"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-450 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-555" size={16} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-900/30 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-555 focus:outline-none focus:border-indigo-500 text-sm transition-smooth"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-450 uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-555" size={16} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-slate-900/30 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-555 focus:outline-none focus:border-indigo-500 text-sm transition-smooth"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-450 uppercase tracking-wider">Select Account Type</label>
              <div className="relative">
                <ShieldAlert className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-555" size={16} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-300 focus:outline-none focus:border-indigo-500 text-sm transition-smooth appearance-none cursor-pointer"
                >
                  <option value="ROLE_USER" className="bg-slate-950 text-slate-200">Customer (ROLE_USER)</option>
                  <option value="ROLE_ADMIN" className="bg-slate-950 text-slate-200">Administrator (ROLE_ADMIN)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || success}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-smooth cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Register</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4 text-xs text-slate-400 border-t border-slate-900">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
