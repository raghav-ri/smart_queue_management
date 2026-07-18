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
  Loader2
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    completed: 0,
    cancelled: 0,
    waiting: 0, // calculated
    averageWaitTimeMinutes: 0
  });

  const [counters, setCounters] = useState([]);
  const [selectedCounterId, setSelectedCounterId] = useState('');
  const [waitingQueues, setWaitingQueues] = useState([]);
  const [activeCall, setActiveCall] = useState(null); // CALLED or SERVING ticket
  const [loading, setLoading] = useState(true);
  const [queueLoading, setQueueLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchInitialData();

    // Auto refresh active queue details and stats every 7 seconds
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
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <span>Loading Admin Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-12 max-w-7xl mx-auto w-full space-y-8 bg-gradient-premium">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <Layers className="text-indigo-400" /> Admin Service Console
          </h1>
          <p className="text-slate-400 text-sm">Real-time visitor analytics, metrics, and queue processing controls</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Selected Counter</label>
          <select
            value={selectedCounterId}
            onChange={(e) => setSelectedCounterId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 text-sm cursor-pointer"
          >
            <option value="">Select a counter...</option>
            {counters.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-2.5 max-w-3xl">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-start gap-2.5 max-w-3xl">
          <Check size={20} className="shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Metrics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 shadow-lg border border-slate-850">
          <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl">
            <Users size={22} />
          </div>
          <div>
            <span className="text-slate-500 text-xs block font-semibold uppercase tracking-wider">Today's Visitors</span>
            <span className="text-2xl font-bold text-slate-200">{stats.totalCustomers}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 shadow-lg border border-slate-850">
          <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl">
            <CheckCircle size={22} />
          </div>
          <div>
            <span className="text-slate-500 text-xs block font-semibold uppercase tracking-wider">Completed</span>
            <span className="text-2xl font-bold text-slate-200">{stats.completed}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 shadow-lg border border-slate-850">
          <div className="bg-amber-500/10 text-amber-400 p-3 rounded-xl">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-slate-500 text-xs block font-semibold uppercase tracking-wider">Waiting</span>
            <span className="text-2xl font-bold text-slate-200">{stats.waiting}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 shadow-lg border border-slate-850">
          <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl">
            <XCircle size={22} />
          </div>
          <div>
            <span className="text-slate-500 text-xs block font-semibold uppercase tracking-wider">Cancelled</span>
            <span className="text-2xl font-bold text-slate-200">{stats.cancelled}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 shadow-lg border border-slate-850 col-span-2 lg:col-span-1">
          <div className="bg-purple-500/10 text-purple-400 p-3 rounded-xl">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-slate-500 text-xs block font-semibold uppercase tracking-wider">Avg Wait Time</span>
            <span className="text-2xl font-bold text-slate-200">{stats.averageWaitTimeMinutes}m</span>
          </div>
        </div>
      </div>

      {/* Main Queue Management Area */}
      {selectedCounterId ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Call Board */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-xl border border-indigo-500/10 relative overflow-hidden col-span-1 lg:col-span-1">
            <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">
                Counter Status Screen
              </h3>

              {activeCall ? (
                <div className="space-y-6 text-center py-6">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/25 animate-pulse">
                      Now Serving
                    </span>
                    <h2 className="text-6xl font-extrabold text-slate-100 font-mono mt-3 text-gradient">
                      #{activeCall.tokenNumber}
                    </h2>
                  </div>

                  <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-sm">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Customer</span>
                      <span className="text-slate-300 font-semibold">{activeCall.username}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1.5">
                      <span>Email</span>
                      <span className="text-slate-400 font-mono">{activeCall.userEmail}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1.5">
                      <span>Joined At</span>
                      <span className="text-slate-400">
                        {new Date(activeCall.joinedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center text-slate-500 space-y-3">
                  <HelpCircle size={40} className="text-slate-700" />
                  <p className="text-sm max-w-[200px]">No customer is currently called at this counter.</p>
                </div>
              )}
            </div>

            {/* Quick Action buttons */}
            <div className="pt-6 border-t border-slate-850 flex flex-col gap-2">
              {activeCall ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSkip(activeCall.id)}
                    className="flex items-center justify-center gap-1 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <SkipForward size={14} />
                    <span>Skip</span>
                  </button>
                  <button
                    onClick={() => handleComplete(activeCall.id)}
                    className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Check size={14} />
                    <span>Complete</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCallNext}
                  disabled={waitingQueues.length === 0}
                  className={`w-full py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    waitingQueues.length > 0 
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800/80'
                  }`}
                >
                  <Play size={14} />
                  <span>Call Next Customer</span>
                </button>
              )}
            </div>
          </div>

          {/* Waiting Queue List */}
          <div className="glass-panel p-6 rounded-2xl shadow-xl col-span-1 lg:col-span-2 border border-slate-850 flex flex-col">
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Waiting Line</span>
              <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-0.5 rounded-full font-semibold border border-indigo-500/20">
                {waitingQueues.length} Waiting
              </span>
            </h3>

            {queueLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-500 gap-2">
                <Loader2 className="animate-spin text-indigo-500" size={24} />
                <span className="text-xs">Loading queue list...</span>
              </div>
            ) : waitingQueues.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-14 text-center text-slate-500 space-y-3">
                <Users size={32} className="text-slate-700" />
                <p className="text-sm max-w-sm">No customers are currently waiting in line for this counter.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto max-h-[350px] divide-y divide-slate-800/50 pr-2 mt-4 space-y-1">
                {waitingQueues.map((q, idx) => (
                  <div key={q.id} className="py-3 flex items-center justify-between text-sm group hover:bg-white/1 rounded-xl px-2 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 border border-slate-800 text-slate-300 font-mono font-bold px-3 py-1.5 rounded-lg text-sm">
                        #{q.tokenNumber}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-200 block">{q.username}</span>
                        <span className="text-slate-500 text-xs font-mono">{q.userEmail}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <span className="text-slate-400 block">
                          Joined{' '}
                          {new Date(q.joinedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-slate-500 text-[10px]">
                          Wait: ~{q.estimatedWaitTime} min
                        </span>
                      </div>

                      {idx === 0 && !activeCall && (
                        <button
                          onClick={handleCallNext}
                          className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 hover:text-indigo-300 border border-indigo-500/25 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
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
        <div className="glass-panel p-12 text-center text-slate-500 text-sm">
          Please select or configure a service counter to manage queues.
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
