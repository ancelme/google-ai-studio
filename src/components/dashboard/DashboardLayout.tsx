import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  Student,
  Teacher,
  FeeInvoice,
  AttendanceRecord,
  GradeEntry,
  SchoolEvent,
  Announcement,
  TimetableSlot,
  AdmissionApplication,
  Language,
  Role
} from '../../types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck2,
  Award,
  Wallet,
  BookOpen,
  Bus,
  MessageSquare,
  FileText,
  Calendar,
  LogOut,
  Moon,
  Sun,
  Globe,
  Bell,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  ChevronDown,
  Camera,
  MapPin,
  CheckCircle2
} from 'lucide-react';

import { OverviewTab } from './OverviewTab';
import { StudentsTab } from './StudentsTab';
import { TeachersTab } from './TeachersTab';
import { TimetableTab } from './TimetableTab';
import { AttendanceTab } from './AttendanceTab';
import { GradesTab } from './GradesTab';
import { FeesTab } from './FeesTab';
import { LibraryTab } from './LibraryTab';
import { MessagesTab } from './MessagesTab';
import { CalendarTab } from './CalendarTab';
import { AdmissionsTab } from './AdmissionsTab';

interface DashboardLayoutProps {
  students: Student[];
  teachers: Teacher[];
  fees: FeeInvoice[];
  attendance: AttendanceRecord[];
  grades: GradeEntry[];
  events: SchoolEvent[];
  announcements: Announcement[];
  timetable: TimetableSlot[];
  admissions: AdmissionApplication[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onAddTeacher: (teacher: Teacher) => void;
  onSaveAttendance: (records: AttendanceRecord[]) => void;
  onUpdateGrade: (grade: GradeEntry) => void;
  onRecordPayment: (invoiceId: string, amount: number, method: 'MTN Mobile Money' | 'Airtel Money' | 'Bank Transfer') => void;
  onAddAnnouncement: (announcement: Announcement) => void;
  onApproveAdmission: (admissionId: string, assignedStream: string) => void;
  onRejectAdmission: (admissionId: string) => void;
  onNewAdmission: (application: AdmissionApplication) => void;
  onAnswerAdmission?: (admissionId: string, decision: 'Approved' | 'Rejected' | 'Under Review', answerText: string, assignedStream?: string) => void;
  onSwitchToPublic: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  students,
  teachers,
  fees,
  attendance,
  grades,
  events,
  announcements,
  timetable,
  admissions,
  onAddStudent,
  onUpdateStudent,
  onAddTeacher,
  onSaveAttendance,
  onUpdateGrade,
  onRecordPayment,
  onAddAnnouncement,
  onApproveAdmission,
  onRejectAdmission,
  onNewAdmission,
  onAnswerAdmission,
  onSwitchToPublic,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, updateUserAvatar } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [avatarSuccessToast, setAvatarSuccessToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Define Navigation Items with Role-based filtering
  const allNavItems = [
    { id: 'overview', label: t('dashOverview'), icon: LayoutDashboard, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'admissions', label: t('dashAdmissions'), icon: FileText, roles: ['admin', 'parent'] },
    { id: 'students', label: t('dashStudents'), icon: Users, roles: ['admin', 'teacher'] },
    { id: 'teachers', label: t('dashTeachers'), icon: GraduationCap, roles: ['admin'] },
    { id: 'timetable', label: t('dashTimetable'), icon: Calendar, roles: ['admin', 'teacher', 'student'] },
    { id: 'attendance', label: t('dashAttendance'), icon: CalendarCheck2, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'grades', label: t('dashGrades'), icon: Award, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'fees', label: t('dashFees'), icon: Wallet, roles: ['admin', 'parent', 'student'] },
    { id: 'library', label: t('dashLibrary'), icon: BookOpen, roles: ['admin', 'teacher', 'student'] },
    { id: 'messages', label: t('dashMessages'), icon: MessageSquare, roles: ['admin', 'teacher', 'parent', 'student'] },
    { id: 'calendar', label: t('dashCalendar'), icon: Calendar, roles: ['admin', 'teacher', 'student', 'parent'] },
  ];

  const currentRole = user?.role || 'student';
  const visibleNavItems = allNavItems.filter(item => item.roles.includes(currentRole));

  const roleBadges: Record<Role, { label: string; color: string }> = {
    admin: { label: t('roleAdmin'), color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
    teacher: { label: t('roleTeacher'), color: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' },
    student: { label: t('roleStudent'), color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' },
    parent: { label: t('roleParent'), color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' },
  };

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  // Handle avatar image file upload directly from device
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateUserAvatar(dataUrl);
      setAvatarSuccessToast(true);
      setTimeout(() => setAvatarSuccessToast(false), 3500);
    };
    reader.readAsDataURL(file);
  };

  const triggerAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Hidden File Input for Device Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarFileChange}
        className="hidden"
        aria-label="Upload profile image from device"
      />

      {/* Avatar Updated Toast */}
      {avatarSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile photo updated from device!</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold tracking-tight block leading-tight font-heading text-slate-900 dark:text-white">
                {t('schoolName')}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{t('schoolLocationShort')}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Public Site Switcher */}
          <button
            type="button"
            onClick={onSwitchToPublic}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <span>{t('publicWebsite')}</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          {/* Instant Language Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold uppercase transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-36 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'fr', label: 'Français' },
                  { code: 'rw', label: 'Kinyarwanda' },
                ].map(l => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code as Language);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                      language === l.code
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark and White Only Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? t('themeWhite') : t('themeDark')}
            aria-label={theme === 'dark' ? t('themeWhite') : t('themeDark')}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* User Profile Pill with Device Photo Upload Button */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="relative group cursor-pointer" onClick={triggerAvatarUpload} title="Click to upload profile photo from your device">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name || 'User'}
                className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 bg-emerald-600 text-white p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform">
                <Camera className="w-2.5 h-2.5" />
              </span>
            </div>

            <div className="hidden md:block text-left">
              <span className="text-xs font-bold block leading-tight truncate max-w-[130px]">
                {user?.name || 'User'}
              </span>
              <span className={`inline-block px-1.5 py-0.2 text-[9px] font-bold rounded-full uppercase ${roleBadges[currentRole]?.color || 'bg-slate-100'}`}>
                {roleBadges[currentRole]?.label || currentRole}
              </span>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-1"
              title={t('logout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 pt-16 lg:pt-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Navigation Links */}
          <div className="p-4 space-y-1 overflow-y-auto flex-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('portalTitle')}
            </div>
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'admissions' && admissions.filter(a => a.status === 'Pending').length > 0 && (
                    <span className="ml-auto flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                        {admissions.filter(a => a.status === 'Pending').length}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar User Info & Avatar Upload trigger */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div
              onClick={triggerAvatarUpload}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-750 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
              title="Click to change profile picture"
            >
              <div className="relative">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                  {user?.name}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                  Click to change photo
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onSwitchToPublic}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <OverviewTab
              students={students}
              teachers={teachers}
              fees={fees}
              attendance={attendance}
              events={events}
              onNavigateTab={tab => setActiveTab(tab)}
            />
          )}

          {activeTab === 'admissions' && (
            <AdmissionsTab
              admissions={admissions}
              onApproveAdmission={onApproveAdmission}
              onRejectAdmission={onRejectAdmission}
              onNewAdmission={onNewAdmission}
              onAnswerAdmission={onAnswerAdmission}
              currentUserRole={currentRole}
            />
          )}

          {activeTab === 'students' && (
            <StudentsTab
              students={students}
              onAddStudent={onAddStudent}
              onUpdateStudent={onUpdateStudent}
            />
          )}

          {activeTab === 'teachers' && (
            <TeachersTab
              teachers={teachers}
              onAddTeacher={onAddTeacher}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableTab timetable={timetable} />
          )}

          {activeTab === 'attendance' && (
            <AttendanceTab
              students={students}
              attendanceRecords={attendance}
              onSaveAttendance={onSaveAttendance}
            />
          )}

          {activeTab === 'grades' && (
            <GradesTab
              students={students}
              grades={grades}
              onUpdateGrade={onUpdateGrade}
            />
          )}

          {activeTab === 'fees' && (
            <FeesTab
              fees={fees}
              onRecordPayment={onRecordPayment}
            />
          )}

          {activeTab === 'library' && (
            <LibraryTab />
          )}

          {activeTab === 'messages' && (
            <MessagesTab
              announcements={announcements}
              onAddAnnouncement={onAddAnnouncement}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarTab events={events} />
          )}
        </main>
      </div>
    </div>
  );
};
