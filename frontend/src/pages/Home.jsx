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
  Ticket,
  Laptop,
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

  const statusStamp = (status) =>
    status === 'ACTIVE' ? 'stamp-green' : status === 'PAUSED' ? 'stamp-brass' : 'stamp-red';
  const statusLabel = (status) =>
    status === 'ACTIVE' ? 'OPEN' : status === 'PAUSED' ? 'PAUSED' : 'CLOSED';

  return (
    <div className="qf-page flex-1 flex flex-col items-center px-6 py-16 md:py-24 max-w-7xl mx-auto w-full space-y-24">

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-8">
        <div className="stamp stamp-brass stamp-flat mx-auto w-fit">
          <Ticket size={11} />
          <span>Now Issuing Digital Tickets</span>
        </div>

        <h1 className="text-5xl md:text-7xl uppercase leading-[0.98] qf-heading">
          Eliminate physical lines.<br />
          <span className="text-[var(--brass)]">Wait from anywhere.</span>
        </h1>

        <p className="text-base md:text-lg text-[var(--muted-on-ink)] max-w-2xl mx-auto font-light leading-relaxed">
          Q-Flow is a virtual queue counter that lets people pull a ticket, watch their live position, and get called to service — right from their phone.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {user ? (
            user.role === 'ROLE_ADMIN' ? (
              <Link to="/admin" className="btn-brass px-6 py-4 flex items-center gap-2 group cursor-pointer">
                Go to Admin Console
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link to="/join-queue" className="btn-brass px-6 py-4 flex items-center gap-2 group cursor-pointer">
                Pull a Ticket
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )
          ) : (
            <>
              <Link to="/login" className="btn-brass px-6 py-4 flex items-center gap-2 cursor-pointer">
                Get Started
                <ArrowRight size={16} />
              </Link>
              <Link to="/register" className="btn-outline px-6 py-4 cursor-pointer">
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Dashboard Preview Mockup */}
      <div className="w-full max-w-5xl mx-auto pt-4">
        <div className="qf-panel p-2.5 relative">
          <div className="flex items-center justify-between px-3 pb-2.5 border-b border-[var(--ink-line)]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[var(--stamp-red)]/70" />
              <div className="w-3 h-3 rounded-full bg-[var(--brass)]/70" />
              <div className="w-3 h-3 rounded-full bg-[var(--stamp-green)]/70" />
            </div>
            <div className="bg-[var(--ink)] text-[10px] text-[var(--muted-on-ink)] px-8 py-1 rounded-md font-mono select-none">
              qflow.saas/live-monitoring
            </div>
            <div className="w-8" />
          </div>

          <img
            src={queueConceptImg}
            alt="Q-Flow Virtual Queue Concept"
            className="w-full h-auto rounded-b-md border-t border-[var(--ink-line)] object-cover max-h-[420px]"
          />
        </div>
      </div>

      {/* Benefits / Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          { icon: Clock, title: 'Real-Time Estimations', color: 'var(--brass)', copy: 'Live wait-time math per counter, recalculated as the line moves, so nobody stares at a guess.' },
          { icon: Users, title: 'Multi-Counter Scale', color: 'var(--stamp-green)', copy: 'Admins open as many desks as they need and route each department to its own line.' },
          { icon: Shield, title: 'Admin Console', color: 'var(--stamp-red)', copy: 'One screen for visitor counts, cancellations, average wait time, and peak traffic hours.' },
        ].map((f) => (
          <div key={f.title} className="qf-panel p-8 space-y-4">
            <div className="p-3 rounded-lg w-fit border" style={{ color: f.color, borderColor: `${f.color}33`, background: `${f.color}14` }}>
              <f.icon size={22} />
            </div>
            <h3 className="text-lg font-extrabold text-[var(--on-ink)]" style={{ fontFamily: 'var(--font-display)' }}>{f.title}</h3>
            <p className="text-[var(--muted-on-ink)] text-sm leading-relaxed font-light">{f.copy}</p>
          </div>
        ))}
      </div>

      {/* Live Counter Directory */}
      <div className="w-full max-w-5xl space-y-8">
        <div className="flex items-center justify-between border-b border-[var(--ink-line)] pb-3">
          <h2 className="text-2xl qf-heading uppercase flex items-center gap-2">
            <Laptop size={22} className="text-[var(--brass)]" />
            Live Counter Directory
          </h2>
          <span className="stamp stamp-green stamp-flat">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--stamp-green)] qf-blink" />
            Live
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="qf-panel animate-pulse h-32" />
            ))}
          </div>
        ) : counters.length === 0 ? (
          <div className="qf-panel p-12 text-center text-[var(--muted-on-ink)] text-sm">
            No service counters are configured by administrators at this moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {counters.map((c) => (
              <div key={c.id} className="qf-panel p-6 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--brass)]/40 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="qf-eyebrow">{c.department}</span>
                    <span className={`stamp ${statusStamp(c.status)}`}>{statusLabel(c.status)}</span>
                  </div>
                  <h4 className="text-xl font-bold text-[var(--on-ink)] group-hover:text-[var(--brass)] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                    {c.name}
                  </h4>
                </div>

                <div className="mt-8 pt-4 border-t border-dashed border-[var(--ink-line)] flex items-center justify-between text-xs text-[var(--muted-on-ink)]">
                  <span className="font-mono">DESK #{c.id}</span>
                  <span className="font-semibold">
                    {c.status === 'ACTIVE' ? 'Ready for tickets' : 'Not accepting'}
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