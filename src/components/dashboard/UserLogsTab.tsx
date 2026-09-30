import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { UserAuditLog, Role } from '../../types';
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Laptop,
  Globe,
  Lock,
  User,
  ShieldCheck
} from 'lucide-react';

interface UserLogsTabProps {
  logs: UserAuditLog[];
  onClearLogs?: () => void;
}

export const UserLogsTab: React.FC<UserLogsTabProps> = ({ logs, onClearLogs }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  // Security gate: only admin has access
  if (user?.role !== 'admin') {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/50">
        <ShieldAlert className="w-16 h-16 text-rose-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {t('accessDeniedTitle') || 'Access Restricted to Administrators'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {t('accessDeniedDesc') || 'Only the School Administrator (Umuyobozi w\'Ishuri) has authorization to inspect system user audit logs and session security events.'}
        </p>
      </div>
    );
  }

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || log.role === roleFilter;
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;

    return matchesSearch && matchesRole && matchesAction;
  });

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'LOGOUT':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      case 'ADMISSION_APPROVED':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300';
      case 'ADMISSION_REJECTED':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      case 'FEE_PAYMENT':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'CONTENT_UPDATED':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300';
      case 'PASSWORD_RESET':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'SESSION_TERMINATED':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const exportLogsAsCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'User Name', 'Email', 'Role', 'Action', 'Details', 'IP Address', 'Device', 'Status'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.userEmail}"`,
      l.role,
      l.action,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
      `"${l.device}"`,
      l.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `st_silas_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold">
                {t('userLogsTitle') || 'System User Audit & Activity Logs'}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Admin Exclusive
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {t('userLogsDesc') || 'Real-time chronological telemetry tracking all portal authentications, permission changes, payments, and admin actions.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={exportLogsAsCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('exportPdf') || 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('searchLogsPlaceholder') || 'Search by user name, email, IP, action details...'}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
            <option value="student">Student</option>
          </select>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGOUT">LOGOUT</option>
            <option value="ADMISSION_APPROVED">ADMISSION_APPROVED</option>
            <option value="FEE_PAYMENT">FEE_PAYMENT</option>
            <option value="CONTENT_UPDATED">CONTENT_UPDATED</option>
            <option value="PASSWORD_RESET">SECURITY_ALERT</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Time & ID</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4">IP & Device</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No audit logs matching query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.timestamp}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{log.id}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {log.userName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {log.userEmail}
                      </div>
                      <span className="inline-block mt-0.5 text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {log.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide font-mono ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {log.details}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>{log.ipAddress}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <Laptop className="w-3 h-3" />
                        <span className="truncate max-w-[160px]">{log.device}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {log.status === 'SUCCESS' && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Success</span>
                        </span>
                      )}
                      {log.status === 'WARNING' && (
                        <span className="inline-flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Warning</span>
                        </span>
                      )}
                      {log.status === 'FAILED' && (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Failed</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
