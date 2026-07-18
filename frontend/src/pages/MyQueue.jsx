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
  Loader2
} from 'lucide-react';

const MyQueue = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchActiveTicket();
    
    // Poll every 5 seconds for live position / status updates
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
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <span>Checking for active tickets...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-12 max-w-3xl mx-auto w-full space-y-8 bg-gradient-premium">
      <div className="flex flex-col space-y-2 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <Activity className="text-indigo-400" /> Active Queue Status
        </h1>
        <p className="text-slate-400 text-sm">Monitor your current token position and estimated waiting time</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-2.5">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {!ticket ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-6 max-w-xl mx-auto shadow-xl">
          <HelpCircle size={56} className="text-slate-600 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-300 font-sans">No Active Ticket</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
              You are not currently in any service queues. Need assistance? Select an open counter to join.
            </p>
          </div>
          <Link
            to="/join-queue"
            className="inline-flex bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
          >
            Join a Queue
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Ticket Panel */}
          <div className="glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden border border-indigo-500/15">
            {/* Ambient glows based on status */}
            {ticket.status === 'CALLED' ? (
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl animate-pulse" />
            ) : (
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Ticket Details */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                    {ticket.counterDepartment}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-200 mt-2">
                    {ticket.counterName}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Joined Time
                    </span>
                    <span className="text-slate-300 font-semibold text-sm">
                      {new Date(ticket.joinedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Status
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      ticket.status === 'WAITING' 
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
                        : ticket.status === 'CALLED'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 badge-glow-green animate-pulse'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Big Token Number Display */}
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 text-center min-w-[200px] flex flex-col justify-center items-center relative shadow-inner">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Your Token
                </span>
                <span className="text-5xl font-extrabold text-slate-100 font-mono my-2 text-gradient">
                  #{ticket.tokenNumber}
                </span>
                <span className="text-[10px] text-slate-400">
                  Please wait for your call
                </span>
              </div>
            </div>

            {/* Waiting Statistics Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-800/50">
              <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/40">
                <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl">
                  <UserCheck size={24} />
                </div>
                <div>
                  <span className="text-slate-500 text-xs uppercase tracking-wider block">Position in Queue</span>
                  <span className="text-slate-200 font-bold text-lg font-sans">
                    {ticket.status === 'WAITING' 
                      ? `${ticket.position} ${ticket.position === 1 ? 'person' : 'people'} ahead`
                      : 'You are next!'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/40">
                <div className="bg-purple-500/10 text-purple-400 p-3 rounded-xl">
                  <Clock size={24} />
                </div>
                <div>
                  <span className="text-slate-500 text-xs uppercase tracking-wider block">Est. Waiting Time</span>
                  <span className="text-slate-200 font-bold text-lg font-sans">
                    {ticket.status === 'WAITING'
                      ? `~ ${ticket.estimatedWaitTime} mins`
                      : 'Proceed to counter'}
                  </span>
                </div>
              </div>
            </div>

            {ticket.status === 'CALLED' && (
              <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
                <Sparkles size={20} className="animate-spin" />
                <span className="text-sm font-semibold">
                  Your token has been CALLED! Please proceed to the service counter immediately.
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end">
            <button
              onClick={() => handleCancelQueue(ticket.id)}
              disabled={cancelling}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-350 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {cancelling ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <XCircle size={16} />
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
