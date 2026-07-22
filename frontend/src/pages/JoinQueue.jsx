import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { KanbanSquare, ArrowRight, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';

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
    <div className="qf-page flex-1 px-6 py-12 max-w-5xl mx-auto w-full space-y-8">
      <div className="flex flex-col space-y-2 border-b border-[var(--ink-line)] pb-4">
        <h1 className="text-3xl qf-heading uppercase flex items-center gap-2">
          <KanbanSquare className="text-[var(--brass)]" /> Join Service Queue
        </h1>
        <p className="text-[var(--muted-on-ink)] text-sm">Pick an open counter below and pull a virtual ticket</p>
      </div>

      {error && (
        <div className="qf-alert qf-alert-error max-w-2xl">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span>{error}</span>
            {error.includes("already") && (
              <p className="text-xs opacity-80">
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
        <div className="flex flex-col items-center justify-center py-20 text-[var(--muted-on-ink)] gap-3">
          <Loader2 className="animate-spin text-[var(--brass)]" size={32} />
          <span>Loading available service counters...</span>
        </div>
      ) : counters.length === 0 ? (
        <div className="qf-panel p-12 text-center space-y-4 max-w-xl mx-auto">
          <HelpCircle size={48} className="text-[var(--muted-on-ink)] mx-auto opacity-60" />
          <h3 className="text-lg font-semibold text-[var(--on-ink)]">No Counters Found</h3>
          <p className="text-[var(--muted-on-ink)] text-sm leading-relaxed">
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
                className={`qf-panel p-6 flex flex-col justify-between relative overflow-hidden transition-all ${
                  isOpen ? 'hover:border-[var(--brass)]/50 hover:-translate-y-0.5' : 'opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="qf-eyebrow">{c.department}</span>
                    <span className={`stamp ${isOpen ? 'stamp-green' : isPaused ? 'stamp-brass' : 'stamp-red'}`}>
                      {isOpen ? 'OPEN' : isPaused ? 'PAUSED' : 'CLOSED'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[var(--on-ink)]" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</h3>
                    <p className="text-[var(--muted-on-ink)] text-xs mt-1 font-mono">DESK #{c.id}</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-dashed border-[var(--ink-line)] flex items-center justify-between">
                  <span className="text-xs text-[var(--muted-on-ink)]">
                    {isOpen ? 'Step in line virtually' : 'Unavailable'}
                  </span>

                  <button
                    onClick={() => handleJoinQueue(c.id)}
                    disabled={isDisabled || joiningId !== null}
                    className={`px-4 py-2 rounded-md text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      isOpen ? 'btn-brass' : 'bg-transparent border-2 border-[var(--ink-line)] text-[var(--muted-on-ink)] cursor-not-allowed font-mono font-bold uppercase'
                    }`}
                  >
                    {joiningId === c.id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <>
                        <span>{isOpen ? 'Pull Ticket' : 'Closed'}</span>
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