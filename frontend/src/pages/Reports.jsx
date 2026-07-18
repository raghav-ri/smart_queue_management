import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart3, Users, CheckCircle, Clock, XCircle, TrendingUp, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await api.get('/admin/report');
      setReport(res.data);
    } catch (err) {
      setError('Failed to fetch analytical report');
    } finally {
      setLoading(false);
    }
  };

  const getPeakHourPercentage = (count) => {
    if (!report || report.peakHours.length === 0) return 0;
    const maxCount = Math.max(...report.peakHours.map(h => h.count));
    if (maxCount === 0) return 0;
    return (count / maxCount) * 100;
  };

  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <span>Generating Analytics Report...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full space-y-8 bg-gradient-premium">
      <div className="flex flex-col space-y-2 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <BarChart3 className="text-indigo-400" /> Daily Reports
        </h1>
        <p className="text-slate-400 text-sm">Analyze visitor patterns, peak traffic hours, and average wait time efficiencies</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-2.5 max-w-3xl">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {report && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-full blur-xl" />
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Visitors</span>
                <Users className="text-indigo-400" size={20} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-200 mt-4 font-mono">{report.totalCustomers}</h2>
              <p className="text-[10px] text-slate-500 mt-2">Total registered tokens today</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-xl" />
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Completed Services</span>
                <CheckCircle className="text-emerald-400" size={20} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-200 mt-4 font-mono">{report.completed}</h2>
              <p className="text-[10px] text-slate-500 mt-2">
                {report.totalCustomers > 0 
                  ? `${Math.round((report.completed / report.totalCustomers) * 100)}% of total traffic`
                  : '0% of total traffic'}
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 h-24 w-24 bg-rose-500/5 rounded-full blur-xl" />
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Cancelled Tickets</span>
                <XCircle className="text-rose-400" size={20} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-200 mt-4 font-mono">{report.cancelled}</h2>
              <p className="text-[10px] text-slate-500 mt-2">
                {report.totalCustomers > 0 
                  ? `${Math.round((report.cancelled / report.totalCustomers) * 100)}% exit rate`
                  : '0% exit rate'}
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/5 rounded-full blur-xl" />
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Avg Waiting Time</span>
                <Clock className="text-purple-400" size={20} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-200 mt-4 font-mono">
                {report.averageWaitTimeMinutes} <span className="text-sm font-semibold">mins</span>
              </h2>
              <p className="text-[10px] text-slate-500 mt-2">Average time from joined to called</p>
            </div>
          </div>

          {/* Peak Traffic Hour Analysis */}
          <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-slate-850">
            <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <TrendingUp size={20} className="text-indigo-400" /> Peak Hour Operations
            </h3>

            {report.peakHours.length === 0 ? (
              <div className="text-center py-20 text-slate-550 text-sm">
                No visitor traffic recorded to display peak hours.
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {report.peakHours.map((h) => {
                  const percentage = getPeakHourPercentage(h.count);
                  
                  return (
                    <div key={h.hour} className="flex items-center gap-4 text-sm">
                      {/* Hour label */}
                      <span className="w-20 text-slate-400 font-semibold shrink-0">
                        {formatHour(h.hour)}
                      </span>

                      {/* Bar graphical container */}
                      <div className="flex-1 bg-slate-900/60 h-6 rounded-lg overflow-hidden border border-slate-800/50">
                        <div 
                          style={{ width: `${percentage}%` }}
                          className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-500 relative flex items-center justify-end pr-2 font-semibold text-[10px] text-white"
                        >
                          {percentage > 15 && `${h.count}`}
                        </div>
                      </div>

                      {/* Label if percentage too small */}
                      {percentage <= 15 && (
                        <span className="text-slate-300 font-semibold text-xs shrink-0">
                          {h.count} visitor{h.count === 1 ? '' : 's'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
