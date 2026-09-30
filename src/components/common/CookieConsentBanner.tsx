import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Cookie, ShieldCheck, X, Check, Sliders } from 'lucide-react';

export const CookieConsentBanner: React.FC = () => {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('st_silas_cookie_consent');
    if (!consent) {
      // Show banner after brief delay
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'st_silas_cookie_consent',
      JSON.stringify({ necessary: true, sessions: true, preferences: true, timestamp: new Date().toISOString() })
    );
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem(
      'st_silas_cookie_consent',
      JSON.stringify({ necessary: true, sessions: false, preferences: false, timestamp: new Date().toISOString() })
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Session Consent"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-40 p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-emerald-600/30 dark:border-emerald-500/30 shadow-2xl animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5" />
        </div>

        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {language === 'rw'
                ? 'Kuki na Gahunda z\'Umutekano z\'Ishuri'
                : language === 'fr'
                ? 'Cookies & Sessions de Sécurité'
                : 'Cookies & Portal Session Governance'}
            </h4>
            <button
              type="button"
              onClick={handleEssentialOnly}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {language === 'rw'
              ? 'Ishuri rya St. Silas EAR Kibondo rikoresha kuki (cookies) z\'umutekano n\'isesheni zo kubika imyirondoro y\'abanyeshuri, ababyeyi n\'abarimu bacyinjira muri porotari no guhitamo ururimi.'
              : language === 'fr'
              ? 'L\'École Primaire St. Silas utilise des cookies essentiels et des sessions sécurisées pour authentifier les parents, enseignants et élèves, tout en mémorisant vos préférences.'
              : 'St. Silas EAR Kibondo uses essential security cookies and encrypted session tokens to manage parent, teacher, and student portal authentications, 2FA validation, and language preferences.'}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
            >
              {language === 'rw' ? 'Emeza Byose' : language === 'fr' ? 'Accepter Tout' : 'Accept All'}
            </button>

            <button
              type="button"
              onClick={handleEssentialOnly}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {language === 'rw' ? 'Iby\'Umutekano Gusa' : language === 'fr' ? 'Essentiels Uniquement' : 'Essential Only'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
