import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { About } from './components/public/About';
import { Academics } from './components/public/Academics';
import { Admissions } from './components/public/Admissions';
import { NewsEvents } from './components/public/NewsEvents';
import { Contact } from './components/public/Contact';
import { Footer } from './components/public/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { NationalSuccess } from './components/public/NationalSuccess';
import { HomeInteractiveFeatures } from './components/public/HomeInteractiveFeatures';
import { GoogleMapModal } from './components/common/GoogleMapModal';

import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_FEES,
  INITIAL_ATTENDANCE,
  INITIAL_GRADES,
  INITIAL_EVENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TIMETABLE,
  INITIAL_ADMISSIONS,
} from './data/mockData';

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
} from './types';

const MainApp: React.FC = () => {
  const { user } = useAuth();

  // Mode: 'public' or 'dashboard'
  const [viewMode, setViewMode] = useState<'public' | 'dashboard'>('public');

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Interactive Google Map Modal State (opened on-demand when user clicks location)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Persistent Domain States (with LocalStorage caching)
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('kea_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('kea_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [fees, setFees] = useState<FeeInvoice[]>(() => {
    const saved = localStorage.getItem('kea_fees');
    return saved ? JSON.parse(saved) : INITIAL_FEES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('kea_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [grades, setGrades] = useState<GradeEntry[]>(() => {
    const saved = localStorage.getItem('kea_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [events, setEvents] = useState<SchoolEvent[]>(() => {
    const saved = localStorage.getItem('kea_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('kea_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [timetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);

  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(() => {
    const saved = localStorage.getItem('st_slas_admissions');
    return saved ? JSON.parse(saved) : INITIAL_ADMISSIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kea_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('kea_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('kea_fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('kea_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('kea_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('kea_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('st_slas_admissions', JSON.stringify(admissions));
  }, [admissions]);

  // If user logs in, switch to dashboard automatically
  useEffect(() => {
    if (user) {
      setViewMode('dashboard');
    } else {
      setViewMode('public');
    }
  }, [user]);

  // Handlers
  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers(prev => [newTeacher, ...prev]);
  };

  const handleSaveAttendance = (newRecords: AttendanceRecord[]) => {
    setAttendance(prev => {
      const recordMap = new Map<string, AttendanceRecord>();
      prev.forEach(r => recordMap.set(r.id, r));
      newRecords.forEach(r => recordMap.set(r.id, r));
      return Array.from(recordMap.values());
    });
  };

  const handleUpdateGrade = (updatedGrade: GradeEntry) => {
    setGrades(prev => prev.map(g => (g.id === updatedGrade.id ? updatedGrade : g)));
  };

  const handleRecordPayment = (
    invoiceId: string,
    amount: number,
    method: 'MTN Mobile Money' | 'Airtel Money' | 'Bank Transfer'
  ) => {
    setFees(prev =>
      prev.map(f => {
        if (f.id === invoiceId) {
          const newPaid = f.amountPaid + amount;
          const newBalance = Math.max(0, f.amountTotal - newPaid);
          return {
            ...f,
            amountPaid: newPaid,
            balance: newBalance,
            status: newBalance === 0 ? 'Paid' : 'Partial',
          };
        }
        return f;
      })
    );
  };

  const handleAddAnnouncement = (newAnnouncement: Announcement) => {
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const handleApproveAdmission = (admissionId: string, assignedStream: string) => {
    const target = admissions.find(a => a.id === admissionId);
    if (!target) return;

    // 1. Update admission status
    setAdmissions(prev =>
      prev.map(a => (a.id === admissionId ? { ...a, status: 'Approved', assignedStream } : a))
    );

    // 2. Automatically enroll student into Student registry
    const nameParts = target.applicantName.trim().split(' ');
    const firstName = nameParts[0] || target.applicantName;
    const lastName = nameParts.slice(1).join(' ') || 'Pupil';

    const gradeLevel = target.level || (target.applyingGrade.includes('Nursery') ? 'Nursery' : ['Primary 1', 'Primary 2', 'Primary 3'].includes(target.applyingGrade) ? 'Lower Primary' : 'Upper Primary');

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      rollNo: `SSP-2026-${target.applyingGrade.replace(/\s+/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      firstName,
      lastName,
      gender: target.gender,
      dob: target.dob,
      grade: target.applyingGrade,
      level: gradeLevel,
      section: assignedStream.includes('Alpha') ? 'Alpha' : 'Beta',
      parentName: target.parentName,
      parentPhone: target.parentPhone,
      parentEmail: target.parentEmail,
      address: `${target.village} Village, ${target.cell} Cell, ${target.sector}, ${target.district}`,
      status: 'Active',
      enrollmentDate: new Date().toISOString().split('T')[0],
      feeStatus: 'Pending',
      photoUrl:
        target.gender === 'F'
          ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      attendanceRate: 100,
      overallGPA: 85.0,
    };

    setStudents(prev => [newStudent, ...prev]);
  };

  const handleRejectAdmission = (admissionId: string) => {
    setAdmissions(prev =>
      prev.map(a => (a.id === admissionId ? { ...a, status: 'Rejected' } : a))
    );
  };

  const handleNewAdmission = (newApp: AdmissionApplication) => {
    setAdmissions(prev => [newApp, ...prev]);
  };

  const handleAnswerAdmission = (
    admissionId: string,
    decision: 'Approved' | 'Rejected' | 'Under Review',
    answerText: string,
    assignedStream?: string
  ) => {
    setAdmissions(prev =>
      prev.map(a => {
        if (a.id === admissionId) {
          return {
            ...a,
            status: decision,
            assignedStream: assignedStream || a.assignedStream,
            adminResponse: answerText,
            adminResponseDate: new Date().toISOString().split('T')[0],
            adminResponder: 'Office of Head Teacher - Emmanuel Twahirwa',
          };
        }
        return a;
      })
    );

    if (decision === 'Approved') {
      handleApproveAdmission(admissionId, assignedStream || 'Alpha');
    }
  };

  // Render Dashboard View if authenticated and in dashboard mode
  if (user && viewMode === 'dashboard') {
    return (
      <DashboardLayout
        students={students}
        teachers={teachers}
        fees={fees}
        attendance={attendance}
        grades={grades}
        events={events}
        announcements={announcements}
        timetable={timetable}
        admissions={admissions}
        onAddStudent={handleAddStudent}
        onUpdateStudent={handleUpdateStudent}
        onAddTeacher={handleAddTeacher}
        onSaveAttendance={handleSaveAttendance}
        onUpdateGrade={handleUpdateGrade}
        onRecordPayment={handleRecordPayment}
        onAddAnnouncement={handleAddAnnouncement}
        onApproveAdmission={handleApproveAdmission}
        onRejectAdmission={handleRejectAdmission}
        onNewAdmission={handleNewAdmission}
        onAnswerAdmission={handleAnswerAdmission}
        onSwitchToPublic={() => setViewMode('public')}
      />
    );
  }

  // Otherwise, render Public-facing website
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Public Navbar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onNavigateToDashboard={() => setViewMode('dashboard')}
        onOpenMap={() => setIsMapModalOpen(true)}
      />

      {/* Main Public Sections */}
      <main className="flex-1">
        <Hero
          onOpenAuth={handleOpenAuth}
          onOpenMap={() => setIsMapModalOpen(true)}
        />
        <NationalSuccess onOpenAuth={handleOpenAuth} />
        <HomeInteractiveFeatures onOpenAuth={handleOpenAuth} />
        <About />
        <Academics />
        <Admissions onOpenAuth={handleOpenAuth} onNewAdmission={handleNewAdmission} />
        <NewsEvents />
        <Contact onOpenMap={() => setIsMapModalOpen(true)} />
      </main>

      {/* Public Footer */}
      <Footer onOpenAuth={handleOpenAuth} />

      {/* Interactive Google Map Modal (loaded on-demand when user clicks location) */}
      <GoogleMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
      />

      {/* Branded Authentication Gate Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setViewMode('dashboard');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
