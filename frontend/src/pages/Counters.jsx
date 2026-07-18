import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Sliders, 
  Plus, 
  Power, 
  Pause, 
  Play, 
  Building2, 
  Activity, 
  AlertCircle, 
  CheckCircle,
  Loader2
} from 'lucide-react';

const Counters = () => {
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add counter form state
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCounters();
  }, []);

  const fetchCounters = async () => {
    try {
      const res = await api.get('/admin/counters');
      setCounters(res.data);
    } catch (err) {
      setError('Failed to fetch service counters');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCounter = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAdding(true);
    try {
      const res = await api.post('/admin/counter', { name, department });
      setCounters([...counters, res.data]);
      setSuccess(`Counter "${res.data.name}" created successfully`);
      setName('');
      setDepartment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service counter');
    } finally {
      setAdding(false);
    }
  };

  const handleStatusChange = async (id, currentStatus, action) => {
    setError('');
    setSuccess('');
    let newStatus = 'INACTIVE';
    if (action === 'OPEN' || action === 'RESUME') {
      newStatus = 'ACTIVE';
    } else if (action === 'PAUSE') {
      newStatus = 'PAUSED';
    } else if (action === 'CLOSE') {
      newStatus = 'INACTIVE';
    }

    try {
      const res = await api.put(`/admin/counter/${id}/status?status=${newStatus}`);
      setCounters(counters.map(c => c.id === id ? res.data : c));
      setSuccess(`Counter status updated to ${newStatus}`);
    } catch (err) {
      setError('Failed to update service counter status');
    }
  };

  return (
    <div className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full space-y-8 bg-gradient-premium">
      <div className="flex flex-col space-y-2 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <Sliders className="text-indigo-400" /> Manage Counters
        </h1>
        <p className="text-slate-400 text-sm">Create service counters and toggle active, paused, or closed states</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-2.5 max-w-3xl">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-start gap-2.5 max-w-3xl">
          <CheckCircle size={20} className="shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Counter Panel */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl border border-slate-850 h-fit space-y-4">
          <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">
            Create Service Counter
          </h3>

          <form onSubmit={handleAddCounter} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Counter Name</label>
              <div className="relative">
                <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Counter 1"
                  className="w-full bg-slate-900/50 border border-slate-800/80 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Department / Category</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Hospital Check-in"
                  className="w-full bg-slate-900/50 border border-slate-800/80 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={adding}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {adding ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Plus size={16} />
                  <span>Create Counter</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Counters List Panel */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl col-span-1 lg:col-span-2 border border-slate-850 space-y-4">
          <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">
            Service Counters List
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Loader2 className="animate-spin text-indigo-500" size={24} />
              <span className="text-xs">Loading counters...</span>
            </div>
          ) : counters.length === 0 ? (
            <div className="text-center py-14 text-slate-550 text-sm">
              No counters have been created yet. Use the panel on the left to add one.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60 space-y-2">
              {counters.map((c) => {
                const isActive = c.status === 'ACTIVE';
                const isPaused = c.status === 'PAUSED';

                return (
                  <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm group">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 text-base">{c.name}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          isActive 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 badge-glow-green' 
                            : isPaused
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 badge-glow-blue'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <span className="text-slate-500 text-xs block">Department: {c.department}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {!isActive ? (
                        <button
                          onClick={() => handleStatusChange(c.id, c.status, isPaused ? 'RESUME' : 'OPEN')}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/25 text-emerald-400 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <Play size={12} />
                          <span>{isPaused ? 'Resume' : 'Open'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(c.id, c.status, 'PAUSE')}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/25 text-amber-400 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <Pause size={12} />
                          <span>Pause</span>
                        </button>
                      )}

                      {c.status !== 'INACTIVE' && (
                        <button
                          onClick={() => handleStatusChange(c.id, c.status, 'CLOSE')}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/25 text-rose-400 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <Power size={12} />
                          <span>Close</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Counters;
