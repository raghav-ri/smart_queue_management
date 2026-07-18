import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { KanbanSquare, ArrowRight, ShieldCheck, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';

const JoinQueue = () => {
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joiningId, setJoiningId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCounters();
  }, []);

  const fetchCounters = async () => {
    try {
      const res = await api.get('/queue/status');
      setCounters(res.data);
    } catch (err) {
      setError('Failed to fetch service counters');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = async (counterId) => {
    setError('');
    setJoiningId(counterId);
    try {
      await api.post('/queue/join', { counterId });
      navigate('/my-queue');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join the queue');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full space-y-8 bg-gradient-premium">
      <div className="flex flex-col space-y-2 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <KanbanSquare className="text-indigo-400" /> Join Service Queue
        </h1>
        <p className="text-slate-400 text-sm">Select an open counter below to register for a virtual queue ticket</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-2.5 max-w-2xl">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-sm font-semibold">{error}</span>
            {error.includes("already") && (
              <p className="text-xs text-rose-400/80">
                You can view or cancel your active ticket on the{' '}
                <Link to="/my-queue" className="underline hover:text-white font-medium">
                  Active Ticket page
                </Link>.
              </p>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <span>Loading available service counters...</span>
        </div>
      ) : counters.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
          <HelpCircle size={48} className="text-slate-600 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-300">No Counters Found</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            There are currently no service counters configured by the administrator. Please try again later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {counters.map((c) => {
            const isOpen = c.status === 'ACTIVE';
            const isPaused = c.status === 'PAUSED';
            const isDisabled = !isOpen;

            return (
              <div 
                key={c.id} 
                className={`glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-xl transition-all relative overflow-hidden border ${
                  isOpen 
                    ? 'hover:border-indigo-500/40 hover:-translate-y-0.5' 
                    : 'opacity-65'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {c.department}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isOpen 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 badge-glow-green' 
                        : isPaused
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 badge-glow-blue'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {isOpen ? 'OPEN' : isPaused ? 'PAUSED' : 'CLOSED'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-200">{c.name}</h3>
                    <p className="text-slate-500 text-xs mt-1">Counter ID: #{c.id}</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {isOpen ? 'Step in line virtually' : 'Unavailable'}
                  </span>
                  
                  <button
                    onClick={() => handleJoinQueue(c.id)}
                    disabled={isDisabled || joiningId !== null}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isOpen
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10 hover:scale-[1.03]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800/80'
                    }`}
                  >
                    {joiningId === c.id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <>
                        <span>{isOpen ? 'Join Queue' : 'Closed'}</span>
                        {isOpen && <ArrowRight size={14} />}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JoinQueue;
