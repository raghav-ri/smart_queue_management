import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { History, Calendar, Clock, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

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
    <div className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full space-y-8 bg-gradient-premium">
      <div className="flex flex-col space-y-2 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <History className="text-indigo-400" /> Queue History
        </h1>
        <p className="text-slate-400 text-sm">View details of your past completed and cancelled queue tickets</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-2.5 max-w-xl">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <span>Loading your queue history...</span>
        </div>
      ) : historyList.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4 max-w-xl mx-auto shadow-lg border border-slate-900/60">
          <History size={48} className="text-slate-600 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-300">No History Available</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            You haven't participated in any service queues yet. Your future queue activity will appear here.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-900/60 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Token</th>
                  <th className="py-4 px-6">Service Counter</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Joined At</th>
                  <th className="py-4 px-6">Ended At</th>
                  <th className="py-4 px-6">Total Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300 text-sm">
                {historyList.map((h) => {
                  const isCompleted = h.status === 'COMPLETED';

                  return (
                    <tr key={h.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-100 text-base">
                        #{h.tokenNumber}
                      </td>
                      <td className="py-4 px-6 font-semibold">{h.counterName}</td>
                      <td className="py-4 px-6 text-slate-400">{h.counterDepartment}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {isCompleted ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {h.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-400">
                        {formatDateTime(h.joinedTime)}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-400">
                        {formatDateTime(h.completedTime)}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-400">
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
