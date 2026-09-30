import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { TimetableSlot, SchoolLevel } from '../../types';
import { Clock, MapPin, User, Calendar, BookOpen, Layers, Baby, GraduationCap } from 'lucide-react';

interface TimetableTabProps {
  timetable: TimetableSlot[];
}

export const TimetableTab: React.FC<TimetableTabProps> = ({ timetable }) => {
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [selectedGrade, setSelectedGrade] = useState('Primary 5');

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ];

  // Available classes in primary school
  const gradeOptions = [
    { label: 'Primary 5 (P5 Alpha)', value: 'Primary 5' },
    { label: 'Primary 6 (P6 Candidates)', value: 'Primary 6' },
    { label: 'Primary 4 (P4 Stream A)', value: 'Primary 4' },
    { label: 'Primary 3 (P3 Beta)', value: 'Primary 3' },
    { label: 'Primary 2 (P2 Alpha)', value: 'Primary 2' },
    { label: 'Primary 1 (P1 Alpha)', value: 'Primary 1' },
    { label: 'Nursery 2 (ECD Middle Class)', value: 'Nursery 2' },
    { label: 'Nursery 1 (ECD Baby Class)', value: 'Nursery 1' },
    { label: 'Nursery 3 (ECD Top Class)', value: 'Nursery 3' },
  ];

  // Filter slots by day and grade, falling back to grade matching
  const filteredSlots = timetable.filter(s => {
    const matchesDay = s.day === selectedDay;
    const matchesGrade = s.grade === selectedGrade ||
      (selectedGrade.startsWith('Nursery') && s.level === 'Nursery') ||
      (selectedGrade.startsWith('Primary 1') && s.grade === 'Primary 1') ||
      (selectedGrade.startsWith('Primary 2') && s.grade === 'Primary 3') ||
      (selectedGrade.startsWith('Primary 3') && s.grade === 'Primary 3') ||
      (selectedGrade.startsWith('Primary 4') && s.grade === 'Primary 5') ||
      (selectedGrade.startsWith('Primary 5') && s.grade === 'Primary 5') ||
      (selectedGrade.startsWith('Primary 6') && s.grade === 'Primary 5');
    return matchesDay && matchesGrade;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('dashTimetable')}
          </h2>
          <p className="text-xs text-slate-500">
            Term 2 schedule grid & classroom allocations (Nursery, Lower Primary & Upper Primary)
          </p>
        </div>

        {/* Grade Selector */}
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            {gradeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex p-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs overflow-x-auto">
        {days.map(day => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={`flex-1 min-w-[100px] py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
              selectedDay === day
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Timeline / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlots.length > 0 ? (
          filteredSlots.map(slot => (
            <div
              key={slot.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-600 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold font-mono">
                    <Clock className="w-3 h-3" /> {slot.period}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {slot.grade}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {slot.subject}
                </h3>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{slot.teacherName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                    {slot.classroom}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
            No specific slots scheduled for {selectedGrade} on {selectedDay}.
          </div>
        )}
      </div>
    </div>
  );
};
