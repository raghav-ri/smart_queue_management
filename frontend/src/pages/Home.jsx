import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Shield, Users, Clock, ArrowRight, KanbanSquare, Sparkles } from 'lucide-react';

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
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gradient-premium">
      {/* Hero section */}
      <div className="max-w-4xl text-center space-y-6 mt-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Sparkles size={12} className="animate-pulse" />
          Seamless Queue Management
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Wait Smarter, Not Harder with <span className="text-gradient">Q-Flow</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          Ditch physical queues. Join virtual queues for banks, hospitals, and counters. Track your position and estimated wait times in real-time.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {user ? (
            user.role === 'ROLE_ADMIN' ? (
              <Link
                to="/admin"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 group transition-all"
              >
                Go to Admin Dashboard
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                to="/join-queue"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 group transition-all"
              >
                Join a Queue
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )
          ) : (
            <>
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                Get Started
              </Link>
              <Link
                to="/register"
                className="glass-card hover:bg-white/5 border border-white/10 text-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-all"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-24">
        <div className="glass-panel p-8 rounded-2xl space-y-4 shadow-xl">
          <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl w-fit">
            <Clock size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-200">Real-Time Estimations</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Know exactly when you'll be called with dynamic wait time algorithms that adapt in real time.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl space-y-4 shadow-xl">
          <div className="bg-purple-500/10 text-purple-400 p-3 rounded-xl w-fit">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-200">Virtual Positions</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Monitor your ticket number and position in line from your smartphone while relaxing elsewhere.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl space-y-4 shadow-xl">
          <div className="bg-pink-500/10 text-pink-400 p-3 rounded-xl w-fit">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-200">Secured Control</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Role-based dashboard allows service administrators to run, pause, or resume counters instantly.
          </p>
        </div>
      </div>

      {/* Live Counter Status overview */}
      <div className="max-w-5xl w-full mt-20 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-200 flex items-center gap-2">
            <KanbanSquare size={22} className="text-indigo-400" />
            Live Counter Status
          </h2>
          <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-full flex items-center gap-1 border border-indigo-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            Live
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl animate-pulse h-32" />
            ))}
          </div>
        ) : counters.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-slate-500 text-sm">
            No service counters are configured yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {counters.map((c) => (
              <div key={c.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700/80 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
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
                  <h4 className="text-lg font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                    {c.name}
                  </h4>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <span>Service Counter ID: #{c.id}</span>
                  <span className="font-semibold text-slate-400">
                    {c.status === 'ACTIVE' ? 'Joinable' : 'Unavailable'}
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
