import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { UserSession } from '../../types';
import {
  Cookie,
  Key,
  ShieldCheck,
  Smartphone,
  Laptop,
  Clock,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Lock,
  Sliders,
  LogOut
} from 'lucide-react';

interface SessionsCookiesTabProps {
  sessions: UserSession[];
  onTerminateSession: (sessionId: string) => void;
  onTerminateAllOtherSessions: () => void;
}

export const SessionsCookiesTab: React.FC<SessionsCookiesTabProps> = ({
  sessions,
  onTerminateSession,
  onTerminateAllOtherSessions,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [cookieLifetime, setCookieLifetime] = useState<string>(() => {
    return localStorage.getItem('st_silas_cookie_lifetime') || '24h';
  });

  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    sessionState: true,
    languagePreference: true,
    themePreference: true,
    secureHttpOnly: true,
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Security gate: only admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/50">
        <Cookie className="w-16 h-16 text-rose-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Access Restricted to Administrators
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Only the School Administrator has permission to view active authentication sessions and configure website cookie parameters.
        </p>
      </div>
    );
  }

  const handleUpdateLifetime = (newLifetime: string) => {
    setCookieLifetime(newLifetime);
    localStorage.setItem('st_silas_cookie_lifetime', newLifetime);
    setToastMsg(`Session and cookie persistence lifetime set to ${newLifetime}.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleCookie = (key: keyof typeof cookieSettings) => {
    if (key === 'essential') return; // Cannot toggle essential
    setCookieSettings(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('st_silas_cookie_preferences', JSON.stringify(next));
      return next;
    });
    setToastMsg('Cookie policy preferences updated.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-bold">
            <Cookie className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold">
                User Sessions & Cookie Security Governance
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Admin Security
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Inspect active bearer tokens, terminate remote sessions, and manage persistent browser cookies for St. Silas portal users.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Terminate all active sessions except your current device session?')) {
              onTerminateAllOtherSessions();
              setToastMsg('All other user sessions terminated.');
              setTimeout(() => setToastMsg(null), 3000);
            }
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Terminate Other Sessions</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{toastMsg}</span>
        </div>
      )}

      {/* 2-Column Grid: Active Sessions & Cookie Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active User Sessions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-600" />
              <span>Active Authentication Sessions ({sessions.filter(s => s.status === 'ACTIVE').length})</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Live Sync</span>
          </div>

          <div className="space-y-3">
            {sessions.map(sess => (
              <div
                key={sess.sessionId}
                className={`p-4 rounded-2xl border transition-all ${
                  sess.status === 'ACTIVE'
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {sess.userName}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {sess.role}
                      </span>
                      {sess.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">
                          Terminated
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3 font-mono">
                      <span>IP: {sess.ipAddress}</span>
                      <span>·</span>
                      <span>{sess.device}</span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono pt-1">
                      Token: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-700 dark:text-emerald-400">{sess.tokenSnippet}</code>
                      <span className="mx-2">·</span>
                      Expires: {sess.expiresAt}
                    </div>
                  </div>

                  {sess.status === 'ACTIVE' && sess.userId !== user?.id && (
                    <button
                      type="button"
                      onClick={() => {
                        onTerminateSession(sess.sessionId);
                        setToastMsg(`Session ${sess.sessionId} has been revoked.`);
                        setTimeout(() => setToastMsg(null), 3000);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 transition-colors shrink-0"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cookies Policy & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>Cookie Policies & Storage</span>
          </h3>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-xs">
            {/* Cookie Lifetime Selector */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Session Persistence & Cookie Lifetime:
              </label>
              <select
                value={cookieLifetime}
                onChange={e => handleUpdateLifetime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="8h">8 Hours (Standard School Workday)</option>
                <option value="24h">24 Hours (Daily Authentication)</option>
                <option value="7d">7 Days (Weekly Persistent Parent Cookie)</option>
                <option value="30d">30 Days (Extended Term Remember Me)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Controls the Max-Age and Expires headers for user session authentication cookies.
              </p>
            </div>

            {/* Cookie Types Toggles */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Allowed Cookie Categories:
              </span>

              {/* Essential */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Strictly Necessary Cookies
                  </span>
                  <span className="text-[10px] text-slate-400">
                    CSRF protection token, 2FA verification gate, session tokens
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.essential}
                  disabled
                  className="rounded text-emerald-600 cursor-not-allowed opacity-75"
                />
              </div>

              {/* Session State */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    User Session & Auth State
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Maintains user login across browser refreshes and tabs
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.sessionState}
                  onChange={() => handleToggleCookie('sessionState')}
                  className="rounded text-emerald-600 cursor-pointer"
                />
              </div>

              {/* Language Preferences */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Language Preference Cookie
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Remembers chosen language (Kinyarwanda, English, French)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.languagePreference}
                  onChange={() => handleToggleCookie('languagePreference')}
                  className="rounded text-emerald-600 cursor-pointer"
                />
              </div>

              {/* Theme Preferences */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Dark / Light Theme Cookie
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Stores preferred visual appearance
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.themePreference}
                  onChange={() => handleToggleCookie('themePreference')}
                  className="rounded text-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Security Flags Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Security Cookie Enforcements</span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Enforced with <code>SameSite=Lax</code>, <code>Secure</code> HTTPS encryption flag, and simulated <code>HttpOnly</code> token storage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
