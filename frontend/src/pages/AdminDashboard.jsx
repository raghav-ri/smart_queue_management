import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Play,
  SkipForward,
  Check,
  HelpCircle,
  AlertTriangle,
  Layers,
  ChevronRight,
  Loader2,
  Calendar,
  Ticket
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    completed: 0,
    cancelled: 0,
    waiting: 0,
    averageWaitTimeMinutes: 0
  });

  const [counters, setCounters] = useState([]);
  const [selectedCounterId, setSelectedCounterId] = useState('');
  const [waitingQueues, setWaitingQueues] = useState([]);
  const [activeCall, setActiveCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [queueLoading, setQueueLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchInitialData();

    // Auto refresh active queue details every 7 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCounterId) {
      fetchCounterQueues(selectedCounterId);
    } else {
      setWaitingQueues([]);
      setActiveCall(null);
    }
  }, [selectedCounterId]);

  const fetchInitialData = async () => {
    setError('');
    try {
      const [reportRes, countersRes] = await Promise.all([
        api.get('/admin/report'),
        api.get('/admin/counters')
      ]);

      const report = reportRes.data;
      const waitingCount = report.totalCustomers - report.completed - report.cancelled;
      setStats({
        ...report,
        waiting: Math.max(0, waitingCount)
      });

      setCounters(countersRes.data);
      if (countersRes.data.length > 0) {
        setSelectedCounterId(countersRes.data[0].id.toString());
      }
    } catch (err) {
      setError('Failed to fetch admin dashboard configuration');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const reportRes = await api.get('/admin/report');
      const report = reportRes.data;
      const waitingCount = report.totalCustomers - report.completed - report.cancelled;
      setStats({
        ...report,
        waiting: Math.max(0, waitingCount)
      });

      if (selectedCounterId) {
        const queuesRes = await api.get(`/admin/queues?counterId=${selectedCounterId}`);
        const list = queuesRes.data;
        const waiting = list.filter(q => q.status === 'WAITING');
        const active = list.find(q => q.status === 'CALLED' || q.status === 'SERVING');
        setWaitingQueues(waiting);
        setActiveCall(active || null);
      }
    } catch (err) {
      console.error('Silent refresh failed:', err);
    }
  };

  const fetchCounterQueues = async (counterId) => {
    setQueueLoading(true);
    try {
      const res = await api.get(`/admin/queues?counterId=${counterId}`);
      const list = res.data;
      const waiting = list.filter(q => q.status === 'WAITING');
      const active = list.find(q => q.status === 'CALLED' || q.status === 'SERVING');
      setWaitingQueues(waiting);
      setActiveCall(active || null);
    } catch (err) {
      setError('Failed to retrieve counter queue list');
    } finally {
      setQueueLoading(false);
    }
  };

  const handleCallNext = async () => {
    if (!selectedCounterId) return;
    setError('');
    setSuccessMessage('');
    try {
      const res = await api.put(`/admin/call-next?counterId=${selectedCounterId}`);
      setSuccessMessage(`Called Token #${res.data.tokenNumber} successfully`);
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to call the next customer in line');
    }
  };

  const handleSkip = async (queueId) => {
    setError('');
    setSuccessMessage('');
    try {
      await api.put(`/admin/skip?queueId=${queueId}`);
      setSuccessMessage('Customer skipped successfully');
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to skip the customer');
    }
  };

  const handleComplete = async (queueId) => {
    setError('');
    setSuccessMessage('');
    try {
      await api.put(`/admin/complete?queueId=${queueId}`);
      setSuccessMessage('Customer service completed successfully');
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete the customer');
    }
  };

  if (loading) {
    return (
      <div className="qf-page flex-1 flex flex-col items-center justify-center py-20 text-[var(--muted-on-ink)] gap-3">
        <Loader2 className="animate-spin text-[var(--brass)]" size={32} />
        <span>Loading Admin Console...</span>
      </div>
    );
  }

  const metricCards = [
    { label: 'Total Visitors', icon: Users, color: 'var(--brass)', value: stats.totalCustomers },
    { label: 'Completed', icon: CheckCircle, color: 'var(--stamp-green)', value: stats.completed },
    { label: 'Waiting', icon: Clock, color: 'var(--brass)', value: stats.waiting },
    { label: 'Cancelled', icon: XCircle, color: 'var(--stamp-red)', value: stats.cancelled },
    { label: 'Avg Wait Time', icon: Clock, color: 'var(--brass)', value: `${stats.averageWaitTimeMinutes}m`, wide: true },
  ];

  return (
    <div className="qf-page flex-1 px-6 py-12 max-w-7xl mx-auto w-full space-y-8">

      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--ink-line)] pb-5 gap-4">
        <div>
          <h1 className="text-3xl qf-heading uppercase flex items-center gap-2">
            <Layers className="text-[var(--brass)]" /> Admin Console
          </h1>
          <p className="text-[var(--muted-on-ink)] text-sm">Real-time visitor analytics, metrics, and queue processing controls</p>
        </div>

        {/* Counter Selection Dropdown */}
        <div className="flex items-center gap-3">
          <label className="qf-label shrink-0">Counter Desk</label>
          <select
            value={selectedCounterId}
            onChange={(e) => setSelectedCounterId(e.target.value)}
            className="bg-black/20 border-2 border-[var(--ink-line)] rounded-md px-4 py-2.5 text-[var(--paper)] focus:outline-none focus:border-[var(--brass)] text-xs font-bold font-mono cursor-pointer"
          >
            <option value="">Select counter...</option>
            {counters.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="qf-alert qf-alert-error max-w-4xl">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="qf-alert qf-alert-success max-w-4xl">
          <Check size={20} className="shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Metrics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {metricCards.map((m) => (
          <div key={m.label} className={`qf-panel p-5 flex items-center gap-4 ${m.wide ? 'col-span-2 lg:col-span-1' : ''}`}>
            <div className="p-3 rounded-lg border" style={{ color: m.color, borderColor: `${m.color}33`, background: `${m.color}14` }}>
              <m.icon size={20} />
            </div>
            <div>
              <span className="qf-label block">{m.label}</span>
              <span className="text-2xl font-bold ticket-number" style={{ color: 'var(--paper)' }}>{m.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Panel Controls */}
      {selectedCounterId ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Active Call Board — signature ticket stub */}
          <div className="ticket-stub flex flex-col justify-between col-span-1 lg:col-span-1 min-h-[300px] overflow-hidden">
            <div className="ticket-stub__perf" />

            <div className="p-6 pt-8 space-y-4">
              <h3 className="text-sm font-bold text-[var(--charcoal)]/70 border-b-2 border-dashed border-[var(--charcoal)]/15 pb-2 flex items-center gap-2 font-mono uppercase tracking-wide">
                <Ticket size={15} /> Current Caller
              </h3>

              {activeCall ? (
                <div className="space-y-6 text-center py-6">
                  <div>
                    <span className="stamp stamp-green qf-blink">Now Serving</span>
                    <h2 className="text-6xl ticket-number mt-3">
                      #{activeCall.tokenNumber}
                    </h2>
                  </div>

                  <div className="space-y-2 bg-[var(--paper-dim)] p-4 rounded-lg border border-[var(--charcoal)]/15 text-xs">
                    <div className="flex justify-between text-[var(--charcoal)]/60">
                      <span>Customer:</span>
                      <span className="text-[var(--charcoal)] font-semibold">{activeCall.username}</span>
                    </div>
                    <div className="flex justify-between text-[var(--charcoal)]/60 mt-1.5">
                      <span>Joined:</span>
                      <span className="text-[var(--charcoal)] font-mono">
                        {new Date(activeCall.joinedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center text-[var(--charcoal)]/50 space-y-3">
                  <HelpCircle size={36} />
                  <p className="text-xs max-w-[200px]">No customer is currently called at this counter.</p>
                </div>
              )}
            </div>

            {/* Quick Action buttons */}
            <div className="p-6 pt-4 border-t-2 border-dashed border-[var(--charcoal)]/15 flex flex-col gap-2">
              {activeCall ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSkip(activeCall.id)}
                    className="btn-stamp-red flex items-center justify-center gap-1.5 py-3.5 cursor-pointer"
                  >
                    <SkipForward size={14} />
                    <span>Skip</span>
                  </button>
                  <button
                    onClick={() => handleComplete(activeCall.id)}
                    className="btn-brass flex items-center justify-center gap-1.5 py-3.5 cursor-pointer"
                  >
                    <Check size={14} />
                    <span>Complete</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCallNext}
                  disabled={waitingQueues.length === 0}
                  className={`w-full py-3.5 rounded-md text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                    waitingQueues.length > 0
                      ? 'btn-brass'
                      : 'border-2 border-[var(--charcoal)]/20 text-[var(--charcoal)]/40 cursor-not-allowed font-mono font-bold uppercase'
                  }`}
                >
                  <Play size={14} />
                  <span>Call Next Customer</span>
                </button>
              )}
            </div>
          </div>

          {/* Waiting Queue List */}
          <div className="qf-panel p-6 col-span-1 lg:col-span-2 flex flex-col">
            <h3 className="text-base font-bold text-[var(--paper)] border-b border-[var(--ink-line)] pb-3 flex items-center justify-between" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-[var(--brass)]" /> Waiting List
              </span>
              <span className="stamp stamp-brass stamp-flat">{waitingQueues.length} Waiting</span>
            </h3>

            {queueLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-[var(--muted-on-ink)] gap-2">
                <Loader2 className="animate-spin text-[var(--brass)]" size={24} />
                <span className="text-xs">Loading queue list...</span>
              </div>
            ) : waitingQueues.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-14 text-center text-[var(--muted-on-ink)] space-y-3">
                <Users size={32} className="opacity-50" />
                <p className="text-xs max-w-sm">No customers are currently waiting in line for this counter.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto max-h-[300px] divide-y divide-[var(--ink-line)] pr-2 mt-4 space-y-1">
                {waitingQueues.map((q, idx) => (
                  <div key={q.id} className="py-3 flex items-center justify-between text-sm group hover:bg-white/[0.02] rounded-lg px-2 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-black/20 border border-[var(--ink-line)] text-[var(--brass)] font-mono font-bold px-3 py-1.5 rounded-md text-xs">
                        #{q.tokenNumber}
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--paper)] block text-xs">{q.username}</span>
                        <span className="text-[var(--muted-on-ink)] text-[10px] font-mono">{q.userEmail}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <span className="text-[var(--muted-on-ink)] block font-mono text-[11px]">
                          Joined{' '}
                          {new Date(q.joinedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[var(--muted-on-ink)]/70 text-[9px] font-mono">
                          Wait: ~{q.estimatedWaitTime} min
                        </span>
                      </div>

                      {idx === 0 && !activeCall && (
                        <button
                          onClick={handleCallNext}
                          className="bg-[var(--brass)]/10 hover:bg-[var(--brass)]/20 text-[var(--brass)] border border-[var(--brass)]/30 px-2.5 py-1 rounded-md font-bold font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Call</span>
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="qf-panel p-12 text-center text-[var(--muted-on-ink)] text-sm">
          Please select or configure a service counter to manage queues.
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;