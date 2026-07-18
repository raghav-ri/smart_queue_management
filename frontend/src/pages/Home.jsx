import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import queueConceptImg from '../assets/queue_concept.jpg';
import { 
  Shield, 
  Users, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Laptop,
  CheckCircle,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const res = await api.get('/queue/status');
        setCounters(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounters();
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-16 md:py-24 max-w-7xl mx-auto w-full space-y-24">
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
          <Sparkles size={12} className="text-indigo-400" />
          <span>Next-Generation Virtual Queuing System</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight font-display">
          Eliminate Physical Lines. <br />
          <span className="text-gradient">Wait from Anywhere.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          Q-Flow is an enterprise-grade virtual queue manager that allows customers to register, track live positions, and receive service status directly on their devices.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {user ? (
            user.role === 'ROLE_ADMIN' ? (
              <Link
                to="/admin"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 group transition-smooth cursor-pointer"
              >
                Go to Admin Dashboard
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                to="/join-queue"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 group transition-smooth cursor-pointer"
              >
                Join a Queue
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )
          ) : (
            <>
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-smooth hover:-translate-y-0.5 cursor-pointer"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/register"
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-semibold px-6 py-4 rounded-xl transition-smooth hover:-translate-y-0.5 cursor-pointer"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* SaaS Dashboard Preview Mockup */}
      <div className="w-full max-w-5xl mx-auto animate-float pt-4">
        <div className="bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-2.5 shadow-2xl relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-70" />
          
          {/* Mockup Header bar */}
          <div className="flex items-center justify-between px-3 pb-2.5 border-b border-slate-200 dark:border-slate-900">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="bg-slate-200/50 dark:bg-slate-900 text-[10px] text-slate-500 px-8 py-1 rounded-md font-mono select-none">
              qflow.saas/live-monitoring
            </div>
            <div className="w-8" />
          </div>

          <img 
            src={queueConceptImg} 
            alt="Q-Flow Virtual Queue Concept" 
            className="w-full h-auto rounded-b-xl border-t border-slate-200 dark:border-slate-900 object-cover max-h-[420px]" 
          />
        </div>
      </div>

      {/* Benefits / Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="neo-card p-8 rounded-2xl space-y-4 shadow-xl">
          <div className="bg-indigo-500/10 text-indigo-400 p-3.5 rounded-xl w-fit border border-indigo-500/20">
            <Clock size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-100 font-display">Real-Time Estimations</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-light">
            Dynamic waiting algorithms calculate average customer turnaround times per counter to display real-time position countdowns.
          </p>
        </div>

        <div className="neo-card p-8 rounded-2xl space-y-4 shadow-xl">
          <div className="bg-purple-500/10 text-purple-400 p-3.5 rounded-xl w-fit border border-purple-500/20">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-100 font-display">Multi-Counter Scalability</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-light">
            Admins can launch unlimited service desks, allocate categories, and isolate queues so that high priority queries load balance.
          </p>
        </div>

        <div className="neo-card p-8 rounded-2xl space-y-4 shadow-xl">
          <div className="bg-emerald-500/10 text-emerald-400 p-3.5 rounded-xl w-fit border border-emerald-500/20">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-100 font-display">Admin Dashboard</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-light">
            Role-based dashboard gives managers metrics over total visitors, cancelled tokens, average wait times, and traffic peak hours.
          </p>
        </div>
      </div>

      {/* Live Counter Registry List */}
      <div className="w-full max-w-5xl space-y-8">
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2 font-display">
            <Laptop size={22} className="text-indigo-400" />
            Live Counter Directory
          </h2>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Live Status
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="neo-card p-8 rounded-2xl animate-pulse h-32" />
            ))}
          </div>
        ) : counters.length === 0 ? (
          <div className="neo-card p-12 rounded-2xl text-center text-slate-500 text-sm">
            No service counters are configured by administrators at this moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {counters.map((c) => (
              <div key={c.id} className="neo-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {c.department}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'ACTIVE' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 badge-glow-green' 
                        : c.status === 'PAUSED'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 badge-glow-blue'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {c.status === 'ACTIVE' ? 'OPEN' : c.status === 'PAUSED' ? 'PAUSED' : 'CLOSED'}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {c.name}
                  </h4>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center justify-between text-xs text-slate-500">
                  <span>ID: #{c.id}</span>
                  <span className="font-semibold text-slate-400">
                    {c.status === 'ACTIVE' ? 'Register Virtual Ticket' : 'Not Acceptable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
