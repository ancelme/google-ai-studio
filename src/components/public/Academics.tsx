import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Baby, GraduationCap, CheckCircle2 } from 'lucide-react';

export const Academics: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'nursery' | 'lower' | 'upper'>('upper');

  return (
    <section id="academics" className="py-16 sm:py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {t('academicsBadge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {t('academicsTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('academicsSub')}
          </p>
        </div>

        {/* 3-Tier Selector Buttons */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('nursery')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'nursery'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Baby className="w-4 h-4" />
              <span>{t('tabNursery')}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lower')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'lower'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('tabLower')}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upper')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'upper'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t('tabUpper')}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Nursery / Early Childhood Development */}
        {activeTab === 'nursery' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3 w-full rounded-2xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80"
                  alt="Rwandan early childhood nursery pupils playing and learning"
                  className="w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="md:w-2/3 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  {t('nurseryAges')}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t('nurseryHeading')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('nurseryOverview')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('n1Title')}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t('n1Desc')}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> {t('n1B1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> {t('n1B2')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> {t('n1B3')}</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('n2Title')}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t('n2Desc')}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> {t('n2B1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> {t('n2B2')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> {t('n2B3')}</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('n3Title')}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t('n3Desc')}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> {t('n3B1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> {t('n3B2')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> {t('n3B3')}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Lower Primary (P1 - P3) */}
        {activeTab === 'lower' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3 w-full rounded-2xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80"
                  alt="Rwandan lower primary students studying in classroom"
                  className="w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="md:w-2/3 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400">
                  {t('lowerAges')}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t('lowerHeading')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('lowerOverview')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('p1Title')}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t('p1Desc')}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> {t('p1B1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> {t('p1B2')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> {t('p1B3')}</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('p2Title')}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t('p2Desc')}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> {t('p2B1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> {t('p2B2')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> {t('p2B3')}</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('p3Title')}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t('p3Desc')}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> {t('p3B1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> {t('p3B2')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> {t('p3B3')}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Upper Primary (P4 - P6) */}
        {activeTab === 'upper' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3 w-full rounded-2xl overflow-hidden shadow-md">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/1/17/Rwanda_schoolchildren.jpg"
                  alt="Rwandan upper primary students in uniform learning attentively"
                  className="w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="md:w-2/3 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  {t('upperAges')}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t('upperHeading')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('upperOverview')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('p4Title')}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t('p4Desc')}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('p4B1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('p4B2')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('p4B3')}</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('p5Title')}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t('p5Desc')}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('p5B1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('p5B2')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('p5B3')}</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('p6Title')}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t('p6Desc')}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('p6B1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('p6B2')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('p6B3')}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
