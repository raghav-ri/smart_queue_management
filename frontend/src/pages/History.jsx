import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { History, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

const QueueHistory = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/users/history');
      setHistoryList(res.data);
    } catch (err) {
      setError('Failed to load queue history');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    const date = new Date(dateTimeStr);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDuration = (startStr, endStr) => {
    if (!startStr || !endStr) return '-';
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffMs = end - start;
    const diffMins = Math.max(1, Math.round(diffMs / 60000));
    return `${diffMins} min${diffMins === 1 ? '' : 's'}`;
  };

  return (
    <div className="qf-page flex-1 px-6 py-12 max-w-5xl mx-auto w-full space-y-8">
      <div className="flex flex-col space-y-2 border-b border-[var(--ink-line)] pb-4">
        <h1 className="text-3xl qf-heading uppercase flex items-center gap-2">
          <History className="text-[var(--brass)]" /> Queue History
        </h1>
        <p className="text-[var(--muted-on-ink)] text-sm">Every ticket you've pulled — completed and cancelled</p>
      </div>

      {error && (
        <div className="qf-alert qf-alert-error max-w-xl">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--muted-on-ink)] gap-3">
          <Loader2 className="animate-spin text-[var(--brass)]" size={32} />
          <span>Loading your queue history...</span>
        </div>
      ) : historyList.length === 0 ? (
        <div className="qf-panel p-12 text-center space-y-4 max-w-xl mx-auto">
          <History size={48} className="text-[var(--muted-on-ink)] mx-auto opacity-50" />
          <h3 className="text-lg font-semibold text-[var(--paper)]">No History Yet</h3>
          <p className="text-[var(--muted-on-ink)] text-sm leading-relaxed">
            You haven't pulled a ticket yet. Your past visits will be logged here.
          </p>
        </div>
      ) : (
        <div className="qf-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--ink-line)] bg-black/10 text-[var(--muted-on-ink)] text-[10px] font-bold uppercase tracking-wider font-mono">
                  <th className="py-4 px-6">Token</th>
                  <th className="py-4 px-6">Counter</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Joined</th>
                  <th className="py-4 px-6">Ended</th>
                  <th className="py-4 px-6">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--ink-line)] text-[var(--paper)] text-sm">
                {historyList.map((h) => {
                  const isCompleted = h.status === 'COMPLETED';

                  return (
                    <tr key={h.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 ticket-number text-[var(--brass)] text-base" style={{ color: 'var(--brass)' }}>
                        #{h.tokenNumber}
                      </td>
                      <td className="py-4 px-6 font-semibold">{h.counterName}</td>
                      <td className="py-4 px-6 text-[var(--muted-on-ink)]">{h.counterDepartment}</td>
                      <td className="py-4 px-6">
                        <span className={`stamp ${isCompleted ? 'stamp-green' : 'stamp-red'}`}>
                          {isCompleted ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                          {h.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-[var(--muted-on-ink)] font-mono text-xs">
                        {formatDateTime(h.joinedTime)}
                      </td>
                      <td className="py-4 px-6 font-medium text-[var(--muted-on-ink)] font-mono text-xs">
                        {formatDateTime(h.completedTime)}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-[var(--muted-on-ink)]">
                        {getDuration(h.joinedTime, h.completedTime)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueHistory;