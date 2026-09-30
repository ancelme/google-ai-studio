import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SchoolEvent } from '../../types';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';

interface CalendarTabProps {
  events: SchoolEvent[];
}

export const CalendarTab: React.FC<CalendarTabProps> = ({ events }) => {
  const { t } = useLanguage();

  const terms = [
    { name: 'Term 1', dates: 'Sept 08, 2025 – Dec 19, 2025', status: 'Completed' },
    { name: 'Term 2 (Current)', dates: 'Jan 05, 2026 – Apr 03, 2026', status: 'In Progress' },
    { name: 'Term 3', dates: 'Apr 20, 2026 – Jul 10, 2026', status: 'Upcoming' },
  ];

  const nationalHolidays = [
    { name: 'National Heroes Day', date: 'Feb 01, 2026' },
    { name: 'Kwibuka 32 (Commemoration)', date: 'Apr 07, 2026' },
    { name: 'Independence Day', date: 'Jul 01, 2026' },
    { name: 'National Liberation Day', date: 'Jul 04, 2026' },
    { name: 'Umuganura (National Thanksgiving)', date: 'Aug 07, 2026' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t('dashCalendar')} & Academic Terms
        </h2>
        <p className="text-xs text-slate-500">
          Official term dates, national holidays, and school milestones
        </p>
      </div>

      {/* Academic Term Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {terms.map(tm => (
          <div
            key={tm.name}
            className={`p-5 rounded-2xl border shadow-xs space-y-2 ${
              tm.status === 'In Progress'
                ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{tm.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                tm.status === 'In Progress'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {tm.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">{tm.dates}</p>
          </div>
        ))}
      </div>

      {/* Events Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Scheduled Term Events</span>
          </h3>

          <div className="space-y-3">
            {events.map(evt => (
              <div
                key={evt.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start gap-4 hover:border-emerald-500 transition-colors"
              >
                <div className="sm:w-28 shrink-0 px-3 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 block">
                    {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white block">
                    {new Date(evt.date).getDate()}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-semibold">{evt.type}</span>
                </div>

                <div className="space-y-1.5 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {evt.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {evt.time}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {evt.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* National Holidays List */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span>National Holidays (Rwanda)</span>
          </h3>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            {nationalHolidays.map(h => (
              <div key={h.name} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 dark:border-slate-700/60 last:border-none">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{h.name}</span>
                <span className="font-mono text-slate-500 text-[11px]">{h.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
