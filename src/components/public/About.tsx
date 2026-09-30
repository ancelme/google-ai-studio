import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, ShieldCheck, Cpu, HeartHandshake } from 'lucide-react';

export const About: React.FC = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: BookOpen,
      title: t('valExcellence'),
      desc: t('valExcellenceDesc'),
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    },
    {
      icon: ShieldCheck,
      title: t('valIntegrity'),
      desc: t('valIntegrityDesc'),
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800',
    },
    {
      icon: Cpu,
      title: t('valInnovation'),
      desc: t('valInnovationDesc'),
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800',
    },
    {
      icon: HeartHandshake,
      title: t('valInclusion'),
      desc: t('valInclusionDesc'),
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800',
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-100/50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {t('aboutBadge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {t('aboutTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            {t('aboutDesc')}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${v.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {v.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Leadership & Campus Heritage Highlight */}
        <div className="mt-16 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                alt="Head Teacher Fr. Silas Nkurunziza"
                className="w-full h-full min-h-[320px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 text-white lg:hidden">
                <p className="font-bold">{t('headTeacherName')}</p>
                <p className="text-xs text-emerald-300">{t('headTeacherRole')}</p>
              </div>
            </div>

            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t('headTeacherWelcomeTitle')}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('headTeacherQuote')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('headTeacherBio')}
              </p>
              <div className="pt-2">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{t('headTeacherName')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('headTeacherRole')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
