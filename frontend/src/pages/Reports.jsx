import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart3, Users, CheckCircle, Clock, XCircle, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

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
      <div className="qf-page flex-1 flex flex-col items-center justify-center py-20 text-[var(--muted-on-ink)] gap-3">
        <Loader2 className="animate-spin text-[var(--brass)]" size={32} />
        <span>Generating Analytics Report...</span>
      </div>
    );
  }

  const summaryCards = report ? [
    { label: 'Total Visitors', icon: Users, color: 'var(--brass)', value: report.totalCustomers, sub: 'Total registered tokens today' },
    { label: 'Completed Services', icon: CheckCircle, color: 'var(--stamp-green)', value: report.completed, sub: report.totalCustomers > 0 ? `${Math.round((report.completed / report.totalCustomers) * 100)}% of total traffic` : '0% of total traffic' },
    { label: 'Cancelled Tickets', icon: XCircle, color: 'var(--stamp-red)', value: report.cancelled, sub: report.totalCustomers > 0 ? `${Math.round((report.cancelled / report.totalCustomers) * 100)}% exit rate` : '0% exit rate' },
    { label: 'Avg Waiting Time', icon: Clock, color: 'var(--brass)', value: `${report.averageWaitTimeMinutes}m`, sub: 'Average time from joined to called' },
  ] : [];

  return (
    <div className="qf-page flex-1 px-6 py-12 max-w-6xl mx-auto w-full space-y-8">
      <div className="flex flex-col space-y-2 border-b border-[var(--ink-line)] pb-4">
        <h1 className="text-3xl qf-heading uppercase flex items-center gap-2">
          <BarChart3 className="text-[var(--brass)]" /> Daily Reports
        </h1>
        <p className="text-[var(--muted-on-ink)] text-sm">Visitor patterns, peak traffic hours, and wait-time efficiency</p>
      </div>

      {error && (
        <div className="qf-alert qf-alert-error max-w-3xl">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {report && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {summaryCards.map((s) => (
              <div key={s.label} className="qf-panel p-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="qf-label">{s.label}</span>
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
                <h2 className="text-3xl font-extrabold mt-4 ticket-number" style={{ color: 'var(--paper)' }}>{s.value}</h2>
                <p className="text-[10px] text-[var(--muted-on-ink)] mt-2">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Peak Traffic Hour Analysis */}
          <div className="qf-panel p-8">
            <h3 className="text-lg font-bold text-[var(--paper)] flex items-center gap-2 border-b border-[var(--ink-line)] pb-3" style={{ fontFamily: 'var(--font-display)' }}>
              <TrendingUp size={20} className="text-[var(--brass)]" /> Peak Hour Operations
            </h3>

            {report.peakHours.length === 0 ? (
              <div className="text-center py-20 text-[var(--muted-on-ink)] text-sm">
                No visitor traffic recorded to display peak hours.
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {report.peakHours.map((h) => {
                  const percentage = getPeakHourPercentage(h.count);

                  return (
                    <div key={h.hour} className="flex items-center gap-4 text-sm">
                      <span className="w-20 text-[var(--muted-on-ink)] font-mono text-xs shrink-0">
                        {formatHour(h.hour)}
                      </span>

                      <div className="flex-1 bg-black/20 h-6 rounded-md overflow-hidden border border-[var(--ink-line)]">
                        <div
                          style={{ width: `${percentage}%`, background: 'var(--brass)' }}
                          className="h-full transition-all duration-500 relative flex items-center justify-end pr-2 font-bold text-[10px] text-[var(--charcoal)] font-mono"
                        >
                          {percentage > 15 && `${h.count}`}
                        </div>
                      </div>

                      {percentage <= 15 && (
                        <span className="text-[var(--paper)] font-semibold text-xs shrink-0 font-mono">
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