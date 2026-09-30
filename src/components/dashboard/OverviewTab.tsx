import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Student,
  Teacher,
  FeeInvoice,
  AttendanceRecord,
  SchoolEvent
} from '../../types';
import {
  Users,
  GraduationCap,
  CalendarCheck2,
  Wallet,
  Sparkles,
  BookOpen,
  Clock,
  Award,
  Bell,
  MapPin,
  CheckCircle2,
  FileText,
  CreditCard,
  Send,
  Phone,
  Printer,
  ChevronRight,
  HeartHandshake,
  Utensils,
  Milk,
  Smartphone,
  Check
} from 'lucide-react';

interface OverviewTabProps {
  students: Student[];
  teachers: Teacher[];
  fees: FeeInvoice[];
  attendance: AttendanceRecord[];
  events: SchoolEvent[];
  onNavigateTab: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  students,
  teachers,
  fees,
  attendance,
  events,
  onNavigateTab,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const currentRole = user?.role || 'admin';

  // Parent State: Selected Child & MoMo payment simulator
  const [selectedChild, setSelectedChild] = useState<'Aline' | 'Eric'>('Aline');
  const [isMoMoModalOpen, setIsMoMoModalOpen] = useState(false);
  const [momoPhone, setMomoPhone] = useState('+250 788 564 890');
  const [momoAmount, setMomoAmount] = useState(25000);
  const [momoStep, setMomoStep] = useState<'form' | 'processing' | 'done'>('form');

  // Teacher State: Quick Roll Call for P5 Alpha
  const [p5Attendance, setP5Attendance] = useState<Record<string, 'Present' | 'Late' | 'Absent'>>({
    'Keza Aline': 'Present',
    'Gasana Mugisha': 'Present',
    'Ineza Grace': 'Present',
    'Manzi Thierry': 'Late',
    'Ishimwe Samuel': 'Present',
    'Umutoni Cynthia': 'Present',
  });
  const [rollCallSaved, setRollCallSaved] = useState(false);

  // Student State: Star card modal
  const [showReportCardModal, setShowReportCardModal] = useState(false);

  // Formatter for Rwandan Francs
  const formatRWF = (num: number) => {
    return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 })
      .format(num)
      .replace('RWF', '')
      .trim() + ' RWF';
  };

  const totalBilled = fees.reduce((acc, f) => acc + f.amountTotal, 0);
  const totalPaid = fees.reduce((acc, f) => acc + f.amountPaid, 0);
  const feePercent = Math.round((totalPaid / (totalBilled || 1)) * 100);

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 98;

  const handleMomoPay = (e: React.FormEvent) => {
    e.preventDefault();
    setMomoStep('processing');
    setTimeout(() => {
      setMomoStep('done');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const handleSaveRollCall = () => {
    setRollCallSaved(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => setRollCallSaved(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Rwandan Primary School Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl"
      >
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('currentTerm')} • St. Silas Private Primary School (EAR Kibondo)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            {t('welcomeBack')} {user?.name}!
          </h2>

          <div className="flex items-center gap-2 text-xs text-emerald-200">
            <MapPin className="w-3.5 h-3.5" />
            <span>Gatsibo District, Kabarore Sector, Simbwa Cell, Kibondo Village</span>
          </div>

          <p className="text-xs sm:text-sm text-emerald-50/90 font-normal leading-relaxed pt-1">
            {currentRole === 'admin' &&
              'Daily school operations, feeding program allocations, pupil admissions, and educator rosters are active across Nursery, Lower Primary, and Upper Primary in Kibondo village, Simbwa Cell.'}
            {currentRole === 'teacher' &&
              'Mwalimu Jean Bosco Mugabo, you are assigned to Primary 5 Alpha (Kibondo Stream). You have 3 teaching periods today. Class roll-call is ready below.'}
            {currentRole === 'student' &&
              'Pupil Keza Aline (Primary 5 Alpha), welcome to your school dashboard! Check your timetable, study notes, and Term 2 report card.'}
            {currentRole === 'parent' &&
              'Umubyeyi Emmanuel Habimana (Kibondo Village), welcome! Your children Grace Uwitonze (N2), Kwizera Eric (P3), and Keza Aline (P5) are present at school today.'}
          </p>
        </div>

        {/* Decorative Sun & Hills Silhouette */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* ========================================================
          1. ADMIN SPECIFIC DASHBOARD VIEW
         ======================================================== */}
      {currentRole === 'admin' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Admin KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">{t('kpiTotalStudents')}</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">684 Pupils</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">148 Nursery • 264 Lower • 272 Upper</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">{t('kpiAttendanceRate')}</span>
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center">
                  <CalendarCheck2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">98.6%</p>
              <p className="text-[11px] text-teal-700 font-semibold mt-1">674 of 684 Present this morning</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Feeding Program (Ifunguro)</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">684 Meals</p>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">Hot Lunch & Fresh Milk Daily</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Primary Educators</span>
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">24 Teachers</p>
              <p className="text-[11px] text-sky-700 font-semibold mt-1">ECD, Lower & Upper Primary Faculty</p>
            </div>
          </div>

          {/* Quick Actions for Head Teacher */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Pupil Admissions</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 text-[10px] font-bold">
                  3 Pending
                </span>
              </div>
              <p className="text-xs text-slate-500">
                New applicants from Kibondo and Simbwa cell awaiting your review and stream allocation.
              </p>
              <button
                type="button"
                onClick={() => onNavigateTab('admissions')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                Review Admissions Applications
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Class Timetables</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 text-[10px] font-bold">
                  P1 to P6
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage weekly subject schedules, teacher allocations, and classroom streams.
              </p>
              <button
                type="button"
                onClick={() => onNavigateTab('timetable')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-colors"
              >
                Open Timetable Manager
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-600" />
                  <span>Parent SMS Broadcast</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 text-[10px] font-bold">
                  Kibondo SMS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Send official school alerts and notices directly to parents in Kibondo village and Kabarore sector.
              </p>
              <button
                type="button"
                onClick={() => onNavigateTab('messages')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white transition-colors"
              >
                Send SMS to Parents
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================
          2. TEACHER (MWALIMU) SPECIFIC DASHBOARD VIEW
         ======================================================== */}
      {currentRole === 'teacher' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Teacher Header Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">My Assigned Class</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Primary 5 Alpha</p>
              <span className="text-[11px] text-emerald-600 font-semibold">42 Enrolled Pupils • Kibondo Stream</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Today Teaching Schedule</span>
              <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">3 Periods</p>
              <span className="text-[11px] text-slate-500">Kinyarwanda, SET Science & Math</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Term 2 Marks Status</span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">38/42 Graded</p>
              <span className="text-[11px] text-amber-600 font-semibold">4 assessments pending</span>
            </div>
          </div>

          {/* Interactive Class Roll-Call for Mwalimu */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarCheck2 className="w-5 h-5 text-emerald-600" />
                  <span>Primary 5 Alpha - Today Roll-Call Attendance</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Quickly mark pupil attendance for morning session in Kibondo campus
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const allP: Record<string, 'Present' | 'Late' | 'Absent'> = {};
                    Object.keys(p5Attendance).forEach(k => { allP[k] = 'Present'; });
                    setP5Attendance(allP);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={handleSaveRollCall}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Save Roll-Call
                </button>
              </div>
            </div>

            {rollCallSaved && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Murakoze! Morning roll-call attendance for Primary 5 Alpha saved and transmitted to Head Teacher.</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(p5Attendance).map(([pupilName, status]) => (
                <div
                  key={pupilName}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{pupilName}</p>
                    <span className="text-[10px] text-slate-400">P5 Alpha</span>
                  </div>
                  <div className="flex gap-1">
                    {(['Present', 'Late', 'Absent'] as const).map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setP5Attendance({ ...p5Attendance, [pupilName]: st })}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          status === st
                            ? st === 'Present'
                              ? 'bg-emerald-600 text-white'
                              : st === 'Late'
                              ? 'bg-amber-500 text-white'
                              : 'bg-rose-500 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {st.charAt(0)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================
          3. STUDENT (PUPIL) SPECIFIC DASHBOARD VIEW
         ======================================================== */}
      {currentRole === 'student' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Pupil Identity Banner */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80"
                alt="Keza Aline"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Keza Aline</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                    Primary 5 Alpha
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Roll No: <span className="font-mono font-bold text-emerald-600">SSP-2026-P5-001</span> • Class Teacher: Mwalimu Jean Bosco Mugabo
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <Award className="w-3.5 h-3.5" />
                    <span>Class Rank: 2nd / 42 Pupils</span>
                  </span>
                  <span>•</span>
                  <span>Term 2 Average: <strong>90.8%</strong></span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReportCardModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
            >
              <FileText className="w-4 h-4" />
              <span>View Official Report Card (Indangamanota)</span>
            </button>
          </div>

          {/* Today Pupil Schedule & Reading Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>My Classes Today (Thursday)</span>
              </h4>
              <div className="space-y-2.5">
                {[
                  { time: '08:00 - 09:30 AM', subject: 'Kinyarwanda Reading & Composition', teacher: 'Mme. Claudine Mukamana', status: 'Completed' },
                  { time: '09:45 - 11:15 AM', subject: 'Competence Mathematics (Fractions & Word Problems)', teacher: 'Mwalimu Jean Bosco Mugabo', status: 'In Progress' },
                  { time: '11:15 - 12:15 PM', subject: 'SET - Science & Elementary Technology', teacher: 'Mwalimu Jean Bosco Mugabo', status: 'Next' },
                  { time: '12:15 - 01:30 PM', subject: 'School Feeding (Ifunguro) & Milk Break', teacher: 'School Refectory Staff', status: 'Break' },
                  { time: '01:30 - 03:00 PM', subject: 'Social & Religious Studies (Rwanda History)', teacher: 'Mwalimu Jean Bosco', status: 'Afternoon' },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block">
                        {s.time}
                      </span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{s.subject}</p>
                      <p className="text-[10px] text-slate-400">{s.teacher}</p>
                    </div>
                    <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading Book Corner */}
            <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>My Library Reader</span>
              </h4>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 shadow-xs space-y-2">
                <p className="font-bold text-xs text-slate-800 dark:text-white">
                  "Imigani n'Ibisakuzo by'Iwacu i Gatsibo"
                </p>
                <p className="text-[11px] text-slate-500">
                  Author: Rwanda Basic Education Board (REB)
                </p>
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-1">
                    <span>Reading Progress</span>
                    <span>Page 24 of 48</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div className="w-1/2 h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200 space-y-1">
                <p className="font-bold">⭐ Star Pupil Badge Earned</p>
                <p>Awarded for 100% attendance and outstanding Kinyarwanda reading fluency in Term 2.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================
          4. PARENT (UMUBYEYI) SPECIFIC DASHBOARD VIEW
         ======================================================== */}
      {currentRole === 'parent' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Child Switcher Tabs */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-xs font-bold text-slate-500 pl-3">My Enrolled Children:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedChild('Aline')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedChild === 'Aline'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Keza Aline (Primary 5 Alpha)
              </button>
              <button
                type="button"
                onClick={() => setSelectedChild('Eric')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedChild === 'Eric'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Kwizera Eric (Primary 3 Beta)
              </button>
            </div>
          </div>

          {/* Safe Arrival & Health Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Daily Arrival Status</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-base font-black text-emerald-950 dark:text-emerald-100">
                Safely at St. Slas Primary
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Arrived at 07:42 AM • Walked safely with Kibondo morning group
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">School Feeding & Milk</span>
                <Utensils className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-base font-black text-slate-900 dark:text-white">
                Ifunguro Active (Term 2)
              </p>
              <p className="text-[11px] text-slate-500">
                25,000 RWF settled. Child receives hot lunch and milk every day at 12:15 PM.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Class Teacher Direct Link</span>
                <Phone className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-base font-black text-slate-900 dark:text-white">
                Mwalimu Jean Bosco
              </p>
              <p className="text-[11px] text-teal-600 font-semibold">
                +250 783 451 902 • Available 04:00 PM
              </p>
            </div>
          </div>

          {/* Quick Payment with MTN MoMo / Airtel Money */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                <Smartphone className="w-3 h-3" />
                <span>MTN MoMo (*182#) & Airtel Money</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                School Feeding & Contribution Fund
              </h4>
              <p className="text-xs text-slate-500">
                Easily pay school feeding fees or check receipts instantly from your mobile device.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMomoStep('form');
                setIsMoMoModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Simulate Mobile Money Payment (25,000 RWF)</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Official Report Card (Indangamanota) Modal for Student/Parent */}
      {showReportCardModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-2xl rounded-3xl bg-white text-slate-900 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-emerald-700 uppercase">
                Official Term 2 Report Card (Indangamanota)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportCardModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Republic & School Header */}
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-500">
                REPUBLIC OF RWANDA • MINISTRY OF EDUCATION (REB)
              </p>
              <h3 className="text-xl font-black text-emerald-800 font-heading">
                ST. SILAS PRIVATE PRIMARY SCHOOL - KIBONDO
              </h3>
              <p className="text-xs text-slate-600">
                Gatsibo District • Kabarore Sector • Simbwa Cell • Kibondo Village
              </p>
              <div className="w-20 h-0.5 bg-emerald-600 mx-auto mt-1" />
            </div>

            {/* Pupil Information */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block">Pupil Name</span>
                <span className="font-bold text-slate-800">Keza Aline</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Class & Stream</span>
                <span className="font-bold text-slate-800">Primary 5 Alpha</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Term / Year</span>
                <span className="font-bold text-slate-800">Term 2, 2026</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Position in Class</span>
                <span className="font-bold text-emerald-700">2nd out of 42</span>
              </div>
            </div>

            {/* Marks Table */}
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Score / 100</th>
                  <th className="py-2.5 px-3">REB Grade</th>
                  <th className="py-2.5 px-3">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Kinyarwanda Reading & Composition</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">94 / 100</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">A (Exemplary)</td>
                  <td className="py-2.5 px-3 text-slate-600">Exceptional fluency in Ikinyarwanda</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Competence Mathematics</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">88 / 100</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">A</td>
                  <td className="py-2.5 px-3 text-slate-600">Strong mastery of fractions & geometry</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">English Language Skills</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">91 / 100</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">A</td>
                  <td className="py-2.5 px-3 text-slate-600">Very articulate and disciplined</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">SET (Science & Elementary Technology)</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">92 / 100</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">A</td>
                  <td className="py-2.5 px-3 text-slate-600">Enthusiastic in school garden experiments</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Social & Religious Studies (SRS)</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">89 / 100</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">A</td>
                  <td className="py-2.5 px-3 text-slate-600">Exemplary moral and cultural conduct</td>
                </tr>
                <tr className="bg-emerald-50 font-bold">
                  <td className="py-3 px-3 text-emerald-900">Overall Average Score</td>
                  <td className="py-3 px-3 font-mono text-emerald-900 text-sm">90.8%</td>
                  <td className="py-3 px-3 text-emerald-900">Grade I Distinction</td>
                  <td className="py-3 px-3 text-emerald-900">Promoted with Highest Honors</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-end pt-4 border-t border-slate-200 text-xs">
              <div>
                <p className="font-bold text-slate-800">Class Teacher: Jean Bosco Mugabo</p>
                <p className="italic text-slate-500">"Keza is a shining star of Kibondo village."</p>
              </div>
              <div className="text-right">
                <p className="font-serif italic font-bold">Fr. Silas Nkurunziza</p>
                <p className="text-[10px] text-slate-500">Head Teacher, St. Slas Primary</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* MTN MoMo Payment Simulator Modal */}
      {isMoMoModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  MoMo
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  MTN Mobile Money Gateway
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMoMoModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {momoStep === 'form' && (
              <form onSubmit={handleMomoPay} className="space-y-4">
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <p className="font-bold">Merchant: St. Slas Primary School Feeding Fund</p>
                  <p>Momo Code: 042004 • Kibondo Village, Gatsibo</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone Number (MTN / Airtel)
                  </label>
                  <input
                    type="text"
                    required
                    value={momoPhone}
                    onChange={e => setMomoPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount to Pay (RWF)
                  </label>
                  <input
                    type="number"
                    required
                    value={momoAmount}
                    onChange={e => setMomoAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                >
                  Send USSD Push Prompt to Phone (*182#)
                </button>
              </form>
            )}

            {momoStep === 'processing' && (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Sending USSD Prompt to {momoPhone}...
                </p>
                <p className="text-[11px] text-slate-500">
                  Please check your phone screen and enter your Mobile Money PIN.
                </p>
              </div>
            )}

            {momoStep === 'done' && (
              <div className="py-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                  Payment Confirmed!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  TxID: MOMO-RW-2026-98124<br />
                  Amount: <strong>{formatRWF(momoAmount)}</strong> settled for Keza Aline.
                </p>
                <button
                  type="button"
                  onClick={() => setIsMoMoModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};
