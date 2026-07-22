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
    <div className="qf-page flex-1 px-6 py-12 max-w-6xl mx-auto w-full space-y-8">
      <div className="flex flex-col space-y-2 border-b border-[var(--ink-line)] pb-4">
        <h1 className="text-3xl qf-heading uppercase flex items-center gap-2">
          <Sliders className="text-[var(--brass)]" /> Manage Counters
        </h1>
        <p className="text-[var(--muted-on-ink)] text-sm">Open desks, and toggle active, paused, or closed states</p>
      </div>

      {error && (
        <div className="qf-alert qf-alert-error max-w-3xl">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="qf-alert qf-alert-success max-w-3xl">
          <CheckCircle size={20} className="shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Counter Panel */}
        <div className="qf-panel p-6 h-fit space-y-4">
          <h3 className="text-base font-bold text-[var(--paper)] border-b border-[var(--ink-line)] pb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Create Service Counter
          </h3>

          <form onSubmit={handleAddCounter} className="space-y-4">
            <div className="space-y-1.5">
              <label className="qf-label">Counter Name</label>
              <div className="qf-input-wrap">
                <Activity className="qf-input-icon" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Counter 1"
                  className="qf-input"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="qf-label">Department / Category</label>
              <div className="qf-input-wrap">
                <Building2 className="qf-input-icon" size={18} />
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Hospital Check-in"
                  className="qf-input"
                />
              </div>
            </div>

            <button type="submit" disabled={adding} className="btn-brass w-full py-3.5 flex items-center justify-center gap-1.5 cursor-pointer">
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
        <div className="qf-panel p-6 col-span-1 lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-[var(--paper)] border-b border-[var(--ink-line)] pb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Service Counters List
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--muted-on-ink)] gap-3">
              <Loader2 className="animate-spin text-[var(--brass)]" size={24} />
              <span className="text-xs">Loading counters...</span>
            </div>
          ) : counters.length === 0 ? (
            <div className="text-center py-14 text-[var(--muted-on-ink)] text-sm">
              No counters have been created yet. Use the panel on the left to add one.
            </div>
          ) : (
            <div className="divide-y divide-[var(--ink-line)] space-y-2">
              {counters.map((c) => {
                const isActive = c.status === 'ACTIVE';
                const isPaused = c.status === 'PAUSED';

                return (
                  <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm group">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--paper)] text-base" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</span>
                        <span className={`stamp ${isActive ? 'stamp-green' : isPaused ? 'stamp-brass' : 'stamp-red'}`}>
                          {c.status}
                        </span>
                      </div>
                      <span className="text-[var(--muted-on-ink)] text-xs block font-mono">Dept: {c.department}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {!isActive ? (
                        <button
                          onClick={() => handleStatusChange(c.id, c.status, isPaused ? 'RESUME' : 'OPEN')}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-bold font-mono uppercase cursor-pointer border-2 border-[var(--stamp-green)] text-[var(--stamp-green)] hover:bg-[var(--stamp-green)] hover:text-[var(--paper)] transition-colors"
                        >
                          <Play size={12} />
                          <span>{isPaused ? 'Resume' : 'Open'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(c.id, c.status, 'PAUSE')}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-bold font-mono uppercase cursor-pointer border-2 border-[var(--brass)] text-[var(--brass)] hover:bg-[var(--brass)] hover:text-[var(--charcoal)] transition-colors"
                        >
                          <Pause size={12} />
                          <span>Pause</span>
                        </button>
                      )}

                      {c.status !== 'INACTIVE' && (
                        <button
                          onClick={() => handleStatusChange(c.id, c.status, 'CLOSE')}
                          className="btn-stamp-red flex items-center gap-1.5 px-3.5 py-2 cursor-pointer"
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