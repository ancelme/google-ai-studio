import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { INITIAL_EVENTS, INITIAL_ANNOUNCEMENTS } from '../../data/mockData';
import { Calendar, Clock, MapPin, Bell } from 'lucide-react';

export const NewsEvents: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="news" className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t('newsBadge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              {t('newsTitle')}
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {t('academicTermBadge')}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Upcoming Calendar Events */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>{t('upcomingEventsTitle')}</span>
            </h3>

            <div className="space-y-3">
              {INITIAL_EVENTS.map(evt => (
                <div
                  key={evt.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-500 transition-all flex flex-col sm:flex-row gap-4 items-start"
                >
                  <div className="sm:w-28 shrink-0 px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center">
                    <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 block uppercase">
                      {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-black text-emerald-900 dark:text-white block">
                      {new Date(evt.date).getDate()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      {evt.type}
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {evt.description}
                    </p>
                    <div className="pt-1 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {evt.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {evt.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Urgent School Announcements */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <span>{t('officialAnnouncementsTitle')}</span>
            </h3>

            <div className="space-y-3">
              {INITIAL_ANNOUNCEMENTS.map(anc => (
                <div
                  key={anc.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      anc.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {anc.priority}
                    </span>
                    <span className="text-[11px] text-slate-400">{anc.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {anc.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {anc.content}
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {t('byAuthor')} {anc.author} • {t('targetRole')}: {anc.targetRole}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
