import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Activity,
  Clock,
  UserCheck,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  Loader2,
  Calendar,
  Ticket
} from 'lucide-react';

const MyQueue = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchActiveTicket();

    // Poll every 5 seconds for live position updates
    const interval = setInterval(() => {
      fetchActiveTicketSilent();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchActiveTicket = async () => {
    try {
      const res = await api.get('/queue/my');
      setTicket(res.data);
    } catch (err) {
      setError('Failed to load active queue status');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveTicketSilent = async () => {
    try {
      const res = await api.get('/queue/my');
      setTicket(res.data);
    } catch (err) {
      console.error('Silent poll failed:', err);
    }
  };

  const handleCancelQueue = async (id) => {
    if (!window.confirm("Are you sure you want to cancel your queue ticket?")) {
      return;
    }
    setCancelling(true);
    try {
      await api.delete(`/queue/cancel/${id}`);
      setTicket(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel the ticket');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="qf-page flex-1 flex flex-col items-center justify-center py-20 text-[var(--muted-on-ink)] gap-3">
        <Loader2 className="animate-spin text-[var(--brass)]" size={32} />
        <span>Checking for active tickets...</span>
      </div>
    );
  }

  return (
    <div className="qf-page flex-1 px-6 py-12 max-w-2xl mx-auto w-full space-y-8">
      <div className="flex flex-col space-y-2 border-b border-[var(--ink-line)] pb-4">
        <h1 className="text-3xl qf-heading uppercase flex items-center gap-2">
          <Activity className="text-[var(--brass)]" /> Active Ticket
        </h1>
        <p className="text-[var(--muted-on-ink)] text-sm">Your current position and estimated wait, updated live</p>
      </div>

      {error && (
        <div className="qf-alert qf-alert-error">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!ticket ? (
        <div className="qf-panel p-12 text-center space-y-6 max-w-xl mx-auto">
          <HelpCircle size={56} className="text-[var(--muted-on-ink)] mx-auto opacity-50" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[var(--paper)]" style={{ fontFamily: 'var(--font-display)' }}>No Active Ticket</h3>
            <p className="text-[var(--muted-on-ink)] text-sm leading-relaxed max-w-sm mx-auto">
              You're not currently waiting in any service queues. Select an open counter to pull one.
            </p>
          </div>
          <Link to="/join-queue" className="btn-brass inline-flex px-6 py-3 cursor-pointer">
            Join a Queue
          </Link>
        </div>
      ) : (
        <div className="space-y-8">

          {/* Signature ticket stub */}
          <div className="ticket-stub overflow-hidden">
            <div className="ticket-stub__perf" />

            <div className="p-6 md:p-8 pt-8 space-y-6">
              <div className="flex items-center justify-between border-b-2 border-dashed border-[var(--charcoal)]/15 pb-4">
                <div className="flex items-center gap-2">
                  <Ticket size={16} className="text-[var(--charcoal)]/70" />
                  <span className="text-xs font-bold tracking-widest text-[var(--charcoal)]/60 uppercase font-mono">
                    Q-Flow Ticket
                  </span>
                </div>
                <span className={`stamp ${
                  ticket.status === 'WAITING' ? 'stamp-brass' :
                  ticket.status === 'CALLED' ? 'stamp-green qf-blink' : 'stamp-red'
                }`}>
                  {ticket.status}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="qf-label text-[var(--charcoal)]/55">{ticket.counterDepartment}</span>
                    <h3 className="text-2xl font-bold text-[var(--charcoal)] mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                      {ticket.counterName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[var(--charcoal)]/55">
                    <Calendar size={14} />
                    <span>Joined at</span>
                    <span className="text-[var(--charcoal)]/80 font-mono">
                      {new Date(ticket.joinedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="border-2 border-[var(--charcoal)] rounded-lg px-8 py-5 text-center min-w-[160px] flex flex-col justify-center items-center select-none bg-[var(--paper-dim)]">
                  <span className="qf-label text-[var(--charcoal)]/55">Token</span>
                  <span className="ticket-number text-5xl my-1.5">
                    #{ticket.tokenNumber}
                  </span>
                  <span className="text-[9px] text-[var(--charcoal)]/50 font-mono">KEEP SCREEN OPEN</span>
                </div>
              </div>
            </div>

            <div className="qf-notch-row h-px bg-[var(--charcoal)]/15 mx-8" />

            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--paper-dim)] text-[var(--charcoal)]/70 p-2.5 rounded-lg border border-[var(--charcoal)]/15">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <span className="qf-label text-[var(--charcoal)]/50 block">Line Position</span>
                    <span className="text-[var(--charcoal)] font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>
                      {ticket.status === 'WAITING' ? `${ticket.position} ahead` : 'You are next!'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-[var(--paper-dim)] text-[var(--charcoal)]/70 p-2.5 rounded-lg border border-[var(--charcoal)]/15">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="qf-label text-[var(--charcoal)]/50 block">Est. Wait</span>
                    <span className="text-[var(--charcoal)] font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>
                      {ticket.status === 'WAITING' ? `~ ${ticket.estimatedWaitTime} mins` : 'Go to counter'}
                    </span>
                  </div>
                </div>
              </div>

              {ticket.status === 'CALLED' && (
                <div className="bg-[var(--stamp-green)]/10 border-2 border-[var(--stamp-green)]/40 text-[var(--stamp-green)] p-4 rounded-lg flex items-center gap-3">
                  <Sparkles size={18} className="shrink-0" />
                  <span className="text-xs font-bold">
                    Your token is being called — proceed to the desk now.
                  </span>
                </div>
              )}

              {/* Barcode flourish */}
              <div className="pt-6 border-t-2 border-dashed border-[var(--charcoal)]/15 flex flex-col items-center gap-2 select-none">
                <div className="flex gap-[2px] w-full max-w-sm justify-center">
                  {[1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 1, 3, 2, 4, 1, 3, 2].map((w, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${w}px`, height: '28px', background: 'var(--charcoal)' }}
                      className="opacity-70"
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-[var(--charcoal)]/50 tracking-widest uppercase">
                  QFLOW-TKT-{ticket.id}-{ticket.tokenNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => handleCancelQueue(ticket.id)}
              disabled={cancelling}
              className="btn-stamp-red flex items-center gap-2 px-5 py-3 cursor-pointer"
            >
              {cancelling ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <>
                  <XCircle size={14} />
                  <span>Cancel Ticket</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyQueue;