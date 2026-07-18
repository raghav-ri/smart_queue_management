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
  Layers
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
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <span>Checking for active tickets...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-12 max-w-2xl mx-auto w-full space-y-8">
      <div className="flex flex-col space-y-2 border-b border-slate-900 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2 font-display">
          <Activity className="text-indigo-400" /> Active Ticket
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
        <div className="neo-card p-12 rounded-2xl text-center space-y-6 max-w-xl mx-auto shadow-xl">
          <HelpCircle size={56} className="text-slate-600 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-350 font-display">No Active Ticket</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
              You are not currently waiting in any service queues. Select an open counter to join.
            </p>
          </div>
          <Link
            to="/join-queue"
            className="inline-flex bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition-smooth hover:scale-[1.02] cursor-pointer"
          >
            Join a Queue
          </Link>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          
          {/* Smart Boarding Ticket Container */}
          <div className="boarding-ticket rounded-3xl overflow-hidden shadow-2xl relative">
            
            {/* Top Ticket Section */}
            <div className="bg-slate-900/90 p-6 md:p-8 space-y-6">
              
              {/* Ticket header */}
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-1.5 rounded-lg text-white">
                    <Layers size={14} />
                  </div>
                  <span className="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono">
                    Q-Flow Smart Pass
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  ticket.status === 'WAITING' 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : ticket.status === 'CALLED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 badge-glow-green animate-pulse'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {ticket.status}
                </span>
              </div>

              {/* Ticket Core details */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 w-fit">
                      {ticket.counterDepartment}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-200 mt-2 font-display">
                      {ticket.counterName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar size={14} />
                    <span>Joined At:</span>
                    <span className="text-slate-400 font-mono">
                      {new Date(ticket.joinedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Large Token Pass Display */}
                <div className="bg-slate-950/80 border border-slate-850 rounded-2xl px-8 py-5 text-center min-w-[160px] flex flex-col justify-center items-center shadow-inner select-none">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    Token Pass
                  </span>
                  <span className="text-5xl font-extrabold text-slate-100 font-mono my-1.5 text-gradient">
                    #{ticket.tokenNumber}
                  </span>
                  <span className="text-[9px] text-slate-400 font-light">
                    Keep screen open
                  </span>
                </div>
              </div>
            </div>

            {/* Dash cutting line */}
            <div className="relative h-px bg-slate-900 z-10">
              <div className="absolute top-1/2 -translate-y-1/2 left-[-13px] w-6 h-6 rounded-full bg-[#030712] border-r border-slate-800" />
              <div className="absolute top-1/2 -translate-y-1/2 right-[-13px] w-6 h-6 rounded-full bg-[#030712] border-l border-slate-800" />
            </div>

            {/* Bottom Ticket Section */}
            <div className="bg-slate-900/50 p-6 md:p-8 space-y-6">
              
              {/* Grid details */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-500/10 text-indigo-400 p-2.5 rounded-xl border border-indigo-500/15">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block font-mono">Line Position</span>
                    <span className="text-slate-200 font-bold text-base font-display">
                      {ticket.status === 'WAITING' 
                        ? `${ticket.position} people ahead`
                        : 'You are next!'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/10 text-purple-400 p-2.5 rounded-xl border border-purple-500/15">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block font-mono">Est. Wait Time</span>
                    <span className="text-slate-200 font-bold text-base font-display">
                      {ticket.status === 'WAITING'
                        ? `~ ${ticket.estimatedWaitTime} mins`
                        : 'Go to Counter'}
                    </span>
                  </div>
                </div>
              </div>

              {ticket.status === 'CALLED' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
                  <Sparkles size={18} className="animate-spin text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold">
                    Your token is being CALLED! Proceed to the desk immediately.
                  </span>
                </div>
              )}

              {/* Simulated Barcode */}
              <div className="pt-6 border-t border-slate-800/40 flex flex-col items-center gap-2 select-none">
                <div className="flex gap-[2px] w-full max-w-sm justify-center">
                  {[1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 1, 3, 2, 4, 1, 3, 2].map((w, idx) => (
                    <div 
                      key={idx} 
                      style={{ width: `${w}px` }} 
                      className="barcode-line opacity-50" 
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">
                  QFLOW-TKT-{ticket.id}-{ticket.tokenNumber}
                </span>
              </div>

            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end">
            <button
              onClick={() => handleCancelQueue(ticket.id)}
              disabled={cancelling}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-rose-450 hover:text-rose-350 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/30 transition-smooth cursor-pointer disabled:opacity-50"
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
