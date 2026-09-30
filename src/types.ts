export type Language = 'en' | 'fr' | 'rw';

export type Role = 'admin' | 'teacher' | 'student' | 'parent';

export type SchoolLevel = 'Nursery' | 'Lower Primary' | 'Upper Primary';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  phone?: string;
  department?: string;
  grade?: string;
  level?: SchoolLevel;
  assignedClass?: string;
  studentId?: string; // For parent to link to their primary child
  childrenIds?: string[]; // Multiple children for parents
  village?: string;
  cell?: string;
  sector?: string;
  district?: string;
  twoFactorEnabled?: boolean;
  emailVerified?: boolean;
}

export interface Student {
  id: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  dob: string;
  grade: string; // e.g. 'Nursery 1', 'Nursery 2', 'Nursery 3', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'
  level: SchoolLevel;
  section: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  status: 'Active' | 'Suspended' | 'Alumni';
  enrollmentDate: string;
  feeStatus: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  photoUrl: string;
  attendanceRate: number;
  overallGPA: number; // Percentage score (e.g. 88.5%)
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  department: string;
  level: SchoolLevel | 'All';
  qualification: string;
  assignedClasses: string[];
  status: 'Active' | 'On Leave';
  avatar: string;
  joinDate: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: string;
  subject: string;
  teacherName: string;
  classroom: string;
  grade: string;
  level?: SchoolLevel;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  level?: SchoolLevel;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  note?: string;
}

export interface GradeEntry {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  level?: SchoolLevel;
  subject: string;
  term: string;
  quiz: number;
  midTerm: number;
  finalExam: number;
  total: number;
  gradeLetter: string;
  remarks: string;
  teacherName?: string;
  quizScore?: number;
  midtermScore?: number;
  finalExamScore?: number;
  totalScore?: number;
  letterGrade?: string;
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  invoiceNo?: string;
  studentId: string;
  studentName: string;
  grade: string;
  level?: SchoolLevel;
  term: string;
  amountTotal: number;
  amountPaid: number;
  balance?: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  paymentMethod?: 'MTN MoMo' | 'Airtel Money' | 'Bank of Kigali' | 'Cash';
  paymentDate?: string;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  targetLevel?: SchoolLevel | 'All';
  totalCopies: number;
  availableCopies: number;
  location: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Academic' | 'Sports' | 'Cultural' | 'Meeting';
  description: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  targetRole: 'All' | 'Teachers' | 'Students' | 'Parents';
  date: string;
  priority: 'High' | 'Normal' | 'Urgent';
}

export interface AdmissionApplication {
  id: string;
  applicantName: string;
  gender: 'M' | 'F';
  dob: string;
  applyingGrade: string; // e.g. 'Nursery 1', 'Nursery 2', 'Nursery 3', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'
  level: SchoolLevel;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  district: string; // Gatsibo
  sector: string; // Kabarore
  cell: string; // Simbwa
  village: string; // Kibondo
  previousSchool?: string;
  birthCertificateSubmitted: boolean;
  immunizationCardSubmitted: boolean;
  status: 'Pending' | 'Approved' | 'Enrolled' | 'Rejected' | 'Under Review';
  applicationDate: string;
  notes?: string;
  assignedStream?: string;
  adminResponse?: string;
  adminResponseDate?: string;
  adminResponder?: string;
}

