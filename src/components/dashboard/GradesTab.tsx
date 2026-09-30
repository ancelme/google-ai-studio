import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Student, GradeEntry } from '../../types';
import { Award, Printer, Download, Sparkles, X, Check, FileText } from 'lucide-react';

interface GradesTabProps {
  students: Student[];
  grades: GradeEntry[];
  onUpdateGrade: (grade: GradeEntry) => void;
}

export const GradesTab: React.FC<GradesTabProps> = ({ students, grades, onUpdateGrade }) => {
  const { t } = useLanguage();
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'std-008');
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const studentGrades = grades.filter(g => g.studentId === currentStudent?.id);

  const calculateOverallTotal = () => {
    if (studentGrades.length === 0) return 0;
    const sum = studentGrades.reduce((acc, g) => acc + (g.total ?? g.totalScore ?? 0), 0);
    return Math.round(sum / studentGrades.length);
  };

  const handleScoreChange = (entry: GradeEntry, field: 'quiz' | 'midTerm' | 'finalExam', val: number) => {
    const updated = { ...entry, [field]: val };
    const q = field === 'quiz' ? val : (entry.quiz ?? entry.quizScore ?? 0);
    const m = field === 'midTerm' ? val : (entry.midTerm ?? entry.midtermScore ?? 0);
    const f = field === 'finalExam' ? val : (entry.finalExam ?? entry.finalExamScore ?? 0);

    const total = Math.round(q * 0.3 + m * 0.3 + f * 0.4);
    updated.total = total;
    updated.totalScore = total;
    updated.quiz = q;
    updated.midTerm = m;
    updated.finalExam = f;

    let letter = 'D';
    if (total >= 90) letter = 'A';
    else if (total >= 80) letter = 'B';
    else if (total >= 70) letter = 'C';
    else if (total >= 60) letter = 'D';
    else letter = 'E';

    updated.gradeLetter = letter;
    updated.letterGrade = letter;

    onUpdateGrade(updated);
  };

  const avgTotal = calculateOverallTotal();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('dashGrades')}
          </h2>
          <p className="text-xs text-slate-500">
            Rwanda Basic Education Board (REB) Competence-Based Assessment & Term Report Cards
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Select Student */}
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} ({s.grade} - {s.rollNo})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsReportCardOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all hover:scale-[1.01]"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Report Card</span>
          </button>
        </div>
      </div>

      {/* Student Summary Card */}
      {currentStudent && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentStudent.photoUrl}
              alt={currentStudent.firstName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {currentStudent.rollNo}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentStudent.firstName} {currentStudent.lastName}
              </h3>
              <p className="text-xs text-slate-500">
                {currentStudent.level} • {currentStudent.grade} ({currentStudent.section})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Term Mark</span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{avgTotal}%</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Attendance</span>
              <span className="text-2xl font-black text-sky-600">{currentStudent.attendanceRate}%</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">CBC Performance</span>
              <span className="text-2xl font-black text-amber-500">Exceeding</span>
            </div>
          </div>
        </div>
      )}

      {/* Grade Entries Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-500 font-semibold text-[11px]">
                <th className="py-3 px-4">Subject (Isomo)</th>
                <th className="py-3 px-4">Educator (Mwalimu)</th>
                <th className="py-3 px-4">Quiz / Continuous (30%)</th>
                <th className="py-3 px-4">Mid-Term Exam (30%)</th>
                <th className="py-3 px-4">Final Exam (40%)</th>
                <th className="py-3 px-4">Total Score</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Teacher's Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {studentGrades.length > 0 ? (
                studentGrades.map(g => {
                  const q = g.quiz ?? g.quizScore ?? 0;
                  const m = g.midTerm ?? g.midtermScore ?? 0;
                  const f = g.finalExam ?? g.finalExamScore ?? 0;
                  const tot = g.total ?? g.totalScore ?? 0;
                  const ltr = g.gradeLetter ?? g.letterGrade ?? 'A';

                  return (
                    <tr key={g.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {g.subject}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {g.teacherName || 'Faculty'}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={q}
                          onChange={e => handleScoreChange(g, 'quiz', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center font-mono font-bold"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={m}
                          onChange={e => handleScoreChange(g, 'midTerm', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center font-mono font-bold"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={f}
                          onChange={e => handleScoreChange(g, 'finalExam', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center font-mono font-bold"
                        />
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                        {tot}%
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                          {ltr}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 italic text-[11px]">
                        "{g.remarks}"
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-slate-500">
                    No individual marks recorded yet for {currentStudent?.firstName}. Developmental progress assessments are verified at end of term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable REB Report Card Modal */}
      {isReportCardOpen && currentStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white text-slate-900 p-8 shadow-2xl space-y-6 print:m-0 print:p-6 print:w-full">
            <button
              type="button"
              onClick={() => setIsReportCardOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Header */}
            <div className="border-b-2 border-emerald-700 pb-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Rwanda Basic Education Board (REB) Code: 530413
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-wide text-slate-900 font-heading">
                  St. Silas Primary School Kibondo (EAR)
                </h3>
                <p className="text-xs text-slate-600">
                  Kibondo Village • Simbwa Cell • Kabarore Sector • Gatsibo District • Eastern Province
                </p>
                <p className="text-xs font-bold text-emerald-800">
                  INDANGAMANOTA Y'IGIHEMBWE CYA KABIRI — TERMINAL REPORT CARD (TERM 2, 2026)
                </p>
              </div>
              <div className="text-right">
                <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex flex-col items-center justify-center font-bold text-xs shadow leading-tight">
                  <span>SSP</span>
                  <span className="text-[9px] font-normal">KIBONDO</span>
                </div>
              </div>
            </div>

            {/* Pupil Info Box */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Pupil Name (Amazina):</span>
                <span className="font-bold text-slate-900">{currentStudent.firstName} {currentStudent.lastName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Roll No (Nimero):</span>
                <span className="font-mono font-bold text-slate-900">{currentStudent.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Class & Stream (Ishuri):</span>
                <span className="font-bold text-slate-900">{currentStudent.grade} ({currentStudent.section})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Level (Icyiciro):</span>
                <span className="font-bold text-slate-900">{currentStudent.level}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Attendance (Kwitabira):</span>
                <span className="font-bold text-emerald-700">{currentStudent.attendanceRate}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Term Average (Amanota):</span>
                <span className="font-bold text-emerald-700">{avgTotal > 0 ? `${avgTotal}%` : `${currentStudent.overallGPA}%`}</span>
              </div>
            </div>

            {/* Grades Table */}
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold text-[11px]">
                <tr>
                  <th className="p-2.5">Subject (Isomo)</th>
                  <th className="p-2.5">Continuous (30%)</th>
                  <th className="p-2.5">Mid-Term (30%)</th>
                  <th className="p-2.5">Final (40%)</th>
                  <th className="p-2.5">Total Marks</th>
                  <th className="p-2.5">Grade</th>
                  <th className="p-2.5">Teacher's Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {studentGrades.map(g => (
                  <tr key={g.id}>
                    <td className="p-2.5 font-bold">{g.subject}</td>
                    <td className="p-2.5">{g.quiz ?? g.quizScore ?? 0}%</td>
                    <td className="p-2.5">{g.midTerm ?? g.midtermScore ?? 0}%</td>
                    <td className="p-2.5">{g.finalExam ?? g.finalExamScore ?? 0}%</td>
                    <td className="p-2.5 font-bold text-emerald-800">{g.total ?? g.totalScore ?? 0}%</td>
                    <td className="p-2.5 font-bold">{g.gradeLetter ?? g.letterGrade ?? 'A'}</td>
                    <td className="p-2.5 italic text-slate-600">{g.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signatures */}
            <div className="pt-4 grid grid-cols-2 gap-8 text-xs">
              <div className="border-t border-slate-400 pt-2 space-y-1">
                <span className="font-bold">Deputy Head of Academics:</span>
                <p className="text-slate-600">Mme. Claudine Mukamana</p>
                <div className="font-serif italic text-emerald-800 text-sm">C. Mukamana [Signed]</div>
              </div>

              <div className="border-t border-slate-400 pt-2 space-y-1">
                <span className="font-bold">Head Teacher & Director:</span>
                <p className="text-slate-600">Fr. Silas Nkurunziza</p>
                <div className="font-serif italic text-emerald-800 text-sm">Fr. Silas Nkurunziza [Official Seal 530413]</div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 flex justify-end gap-3 print:hidden border-t border-slate-200">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Report Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
