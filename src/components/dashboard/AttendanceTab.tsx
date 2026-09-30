import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Student, AttendanceRecord } from '../../types';
import { CalendarCheck2, Check, Clock, AlertTriangle, CheckCircle2, Save } from 'lucide-react';

interface AttendanceTabProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onSaveAttendance: (records: AttendanceRecord[]) => void;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({
  students,
  attendanceRecords,
  onSaveAttendance,
}) => {
  const { t } = useLanguage();
  const [selectedGrade, setSelectedGrade] = useState('Primary 5');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const primaryGrades = [
    'Primary 5',
    'Primary 6',
    'Primary 4',
    'Primary 3',
    'Primary 2',
    'Primary 1',
    'Nursery 3',
    'Nursery 2',
    'Nursery 1'
  ];

  const gradeStudents = students.filter(s => s.grade === selectedGrade);

  // Local attendance state mapped by student id
  const [statusMap, setStatusMap] = useState<Record<string, 'Present' | 'Late' | 'Absent' | 'Excused'>>(() => {
    const initial: Record<string, 'Present' | 'Late' | 'Absent' | 'Excused'> = {};
    students.forEach(s => {
      initial[s.id] = 'Present';
    });
    return initial;
  });

  const handleStatusChange = (studentId: string, status: 'Present' | 'Late' | 'Absent' | 'Excused') => {
    setStatusMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, 'Present' | 'Late' | 'Absent' | 'Excused'> = {};
    gradeStudents.forEach(s => {
      updated[s.id] = 'Present';
    });
    setStatusMap(prev => ({ ...prev, ...updated }));
  };

  const handleSave = () => {
    const newRecords: AttendanceRecord[] = gradeStudents.map(s => ({
      id: `att-${s.id}-${selectedDate}`,
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      rollNo: s.rollNo,
      grade: s.grade,
      date: selectedDate,
      status: statusMap[s.id] || 'Present',
    }));

    onSaveAttendance(newRecords);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const activeStudentsList = gradeStudents.length > 0 ? gradeStudents : students;

  const presentCount = activeStudentsList.filter(s => (statusMap[s.id] || 'Present') === 'Present').length;
  const lateCount = activeStudentsList.filter(s => statusMap[s.id] === 'Late').length;
  const absentCount = activeStudentsList.filter(s => statusMap[s.id] === 'Absent').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('dashAttendance')}
          </h2>
          <p className="text-xs text-slate-500">
            Daily roll-call & school feeding presence register for St. Silas Primary School
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
          >
            Mark Class Present
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all hover:scale-[1.01]"
          >
            <Save className="w-4 h-4" />
            <span>Save Register</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Attendance register saved and feeding counts synchronized for {selectedGrade}.</span>
        </div>
      )}

      {/* Filter & Metric Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Class / Stream</label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              {primaryGrades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Register Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold">
            Present: {presentCount}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-bold">
            Late: {lateCount}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 font-bold">
            Absent: {absentCount}
          </span>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-500 font-semibold text-[11px]">
                <th className="py-3 px-4">Pupil Info</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Parent Mobile</th>
                <th className="py-3 px-4">Roll-Call Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {activeStudentsList.map(s => {
                const curStatus = statusMap[s.id] || 'Present';

                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.photoUrl}
                          alt={s.firstName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {s.firstName} {s.lastName}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {s.rollNo}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {s.grade}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500">
                      {s.parentPhone}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex gap-1.5">
                        {(['Present', 'Late', 'Absent', 'Excused'] as const).map(st => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(s.id, st)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                              curStatus === st
                                ? st === 'Present'
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : st === 'Late'
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : st === 'Absent'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-sky-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
