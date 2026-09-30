import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import {
  GraduationCap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Check,
  AlertCircle,
  X,
  KeyRound,
  ArrowRight,
  Sparkles,
  Smartphone,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  MapPin,
  ShieldCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { login, register, quickDemoLogin, pending2FAUser, verify2FACode, cancel2FA } = useAuth();

  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);
  const [role, setRole] = useState<Role>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [enable2FA, setEnable2FA] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Profile Image Upload State
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);
  const [avatarFileName, setAvatarFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen && !pending2FAUser) return null;

  // Password Strength Calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0 to 4
  };

  const strengthScore = getPasswordStrength(password);
  const strengthLabels = ['', t('weak'), t('medium'), t('strong'), t('strong')];
  const strengthColors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-600'];

  // Handle Profile Image Upload from Device
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, JPEG, or WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 5MB.');
      return;
    }

    setErrorMsg('');
    setAvatarFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedAvatar(reader.result);
        setInfoMsg(t('photoUploaded'));
        setTimeout(() => setInfoMsg(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemoveAvatar = () => {
    setUploadedAvatar(null);
    setAvatarFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your email or identifier.');
      return;
    }

    const result = login(email, role, password, enable2FA, uploadedAvatar || undefined);
    if (result.success && !result.requires2FA) {
      onSuccess();
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const result = register(
      name,
      email,
      role,
      uploadedAvatar || undefined,
      {
        district: 'Gatsibo',
        sector: 'Kabarore',
        cell: 'Simbwa',
        village: 'Kibondo',
      }
    );

    if (result.success) {
      setInfoMsg('Account created successfully! Welcome to St. Silas Private Primary School.');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the 2FA code.');
      return;
    }

    const success = verify2FACode(fullCode);
    if (success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg('Invalid verification code. Use demo code 123456.');
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otpCode];
    updated[index] = val;
    setOtpCode(updated);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleDemoClick = (targetRole: Role) => {
    quickDemoLogin(targetRole);
    onSuccess();
    onClose();
  };

  const rolesConfig: { id: Role; label: string; icon: string; desc: string; sampleEmail: string }[] = [
    {
      id: 'admin',
      label: t('roleAdmin'),
      icon: '🏛️',
      desc: 'Head Teacher • Full operations & admissions',
      sampleEmail: 'headteacher@stslasprimary.rw'
    },
    {
      id: 'teacher',
      label: t('roleTeacher'),
      icon: '👩‍🏫',
      desc: 'Mwalimu • P5 Alpha attendance, marks & schedule',
      sampleEmail: 'jeanbosco.mugabo@stslasprimary.rw'
    },
    {
      id: 'student',
      label: t('roleStudent'),
      icon: '🎒',
      desc: 'Pupil • Keza Aline (P5) timetable & report card',
      sampleEmail: 'keza.aline@stslasprimary.rw'
    },
    {
      id: 'parent',
      label: t('roleParent'),
      icon: '👨‍👩‍👧',
      desc: 'Umubyeyi • Kibondo village parent fees & progress',
      sampleEmail: 'emmanuel.habimana@parents.rw'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/20 dark:border-slate-800 shadow-2xl overflow-hidden my-6"
      >
        {/* Top Rwandan Cultural Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-amber-400 to-emerald-600" />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            cancel2FA();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 2FA Mode View */}
        {pending2FAUser ? (
          <div className="p-8 sm:p-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
                {t('twoFactorTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {t('twoFactorDesc')} (Demo Code: <span className="font-mono font-bold text-emerald-600">123456</span>)
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otpCode.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    className="w-11 h-13 text-center font-mono text-xl font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                ))}
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 transition-all"
                >
                  {t('verifyCodeBtn')}
                </button>
                <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                  <button
                    type="button"
                    onClick={() => setOtpCode(['1', '2', '3', '4', '5', '6'])}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    Auto-fill Demo Code (123456)
                  </button>
                  <button
                    type="button"
                    onClick={cancel2FA}
                    className="hover:underline text-slate-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : tab === 'forgot' ? (
          /* Password Reset View */
          <div className="p-8 sm:p-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Reset Portal Access
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Enter your registered mobile phone or school email to receive an instant recovery code via SMS.
              </p>
            </div>

            {forgotSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                  Password Reset SMS Dispatched!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  A verification token has been transmitted to your device. Follow instructions to set a new password.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setForgotSubmitted(false);
                  }}
                  className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-sm"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (email) setForgotSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number or School Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+250 788 000 000 or name@stslasprimary.rw"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                >
                  Request Reset SMS & Token
                </button>

                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Main Auth View (Sign In & Register) */
          <div className="p-6 sm:p-8 space-y-5 max-h-[88vh] overflow-y-auto">
            {/* School Header Identity */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Gatsibo • Kabarore • Simbwa • Kibondo</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                {t('authPortalTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('authPortalSubtitle')}
              </p>
            </div>

            {/* Tab switch */}
            <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  tab === 'login'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {t('tabSignIn')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  tab === 'register'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {t('tabRegister')}
              </button>
            </div>

            {/* Error / Info alerts */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {infoMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2"
              >
                <Check className="w-4 h-4 shrink-0" />
                <span>{infoMsg}</span>
              </motion.div>
            )}

            {/* Form */}
            <form
              onSubmit={tab === 'login' ? handleLoginSubmit : handleRegisterSubmit}
              className="space-y-4"
            >
              {/* Profile Image Upload Feature from Device */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('uploadProfilePhoto')}</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Device upload (PNG/JPG)</span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="profile-device-upload-input"
                />

                {uploadedAvatar ? (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700/60 shadow-xs">
                    <div className="relative">
                      <img
                        src={uploadedAvatar}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                        {avatarFileName || 'Custom Profile Image'}
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Ready to apply to your session
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Change photo"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title={t('removePhoto')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={e => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-xl p-3 text-center transition-all ${
                      isDragging
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                        : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 hover:bg-slate-100/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <UploadCloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {t('chooseFromDevice')}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Click to browse your photos or drop an image here
                    </p>
                  </div>
                )}
              </div>

              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('roleLabel')} *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {rolesConfig.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setRole(r.id);
                        if (!email) setEmail(r.sampleEmail);
                      }}
                      className={`p-2.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        role === r.id
                          ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{r.icon}</span>
                        {role === r.id && (
                          <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold mt-1 block truncate">{r.label}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {r.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name (if Register) */}
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aline Keza or Jean Bosco Mugabo"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Email / Identifier */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('emailLabel')} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder={
                      role === 'admin'
                        ? 'headteacher@stslasprimary.rw'
                        : role === 'teacher'
                        ? 'jeanbosco.mugabo@stslasprimary.rw'
                        : role === 'student'
                        ? 'keza.aline@stslasprimary.rw'
                        : 'emmanuel.habimana@parents.rw'
                    }
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t('passwordLabel')} *
                  </label>
                  {tab === 'login' && (
                    <button
                      type="button"
                      onClick={() => setTab('forgot')}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      {t('forgotPassword')}
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter on Register */}
                {tab === 'register' && password.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                      <span>{t('passwordStrength')}: {strengthLabels[strengthScore]}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map(idx => (
                        <div
                          key={idx}
                          className={`h-full flex-1 rounded-full transition-all ${
                            idx <= strengthScore ? strengthColors[strengthScore] : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Remember me & 2FA checkbox */}
              {tab === 'login' && (
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400">{t('rememberMe')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enable2FA}
                      onChange={e => setEnable2FA(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('twoFactorTitle')}</span>
                    </span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>{tab === 'login' ? t('signInBtn') : t('registerBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick One-Click Demo Personas */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-2 text-center">
                {t('orQuickDemo')}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoClick('admin')}
                  className="px-3 py-2 rounded-xl text-left border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-400 transition-all group"
                >
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">
                    {t('roleAdmin')}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
                    Fr. Silas Nkurunziza
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoClick('teacher')}
                  className="px-3 py-2 rounded-xl text-left border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-400 transition-all group"
                >
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 block uppercase">
                    {t('roleTeacher')}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
                    Jean Bosco Mugabo
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoClick('student')}
                  className="px-3 py-2 rounded-xl text-left border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-400 transition-all group"
                >
                  <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 block uppercase">
                    {t('roleStudent')}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
                    Keza Aline (P5)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoClick('parent')}
                  className="px-3 py-2 rounded-xl text-left border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-400 transition-all group"
                >
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block uppercase">
                    {t('roleParent')}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
                    Emmanuel Habimana
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
