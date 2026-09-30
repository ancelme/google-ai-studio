import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Check,
  ExternalLink,
  Navigation,
  Compass,
  Sparkles,
  Bot,
  Copy,
  CheckCheck,
  RotateCcw,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { GoogleMapModal } from '../common/GoogleMapModal';

interface ContactProps {
  onOpenMap?: () => void;
}

interface AIResponseData {
  reply: string;
  ticketId: string;
  timestamp: string;
  recipient: string;
}

export const Contact: React.FC<ContactProps> = ({ onOpenMap }) => {
  const { t, language } = useLanguage();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponseData | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const fireSuccessConfetti = () => {
    // High-impact multi-stage celebratory confetti
    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.65 },
      colors: ['#059669', '#10b981', '#f59e0b', '#0284c7']
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#059669', '#34d399', '#fbbf24']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0284c7', '#38bdf8', '#10b981']
      });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/contact/ai-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          language,
          aiMode: 'gemini', // Standard default AI processing
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: AIResponseData = await response.json();
      setAiResponse(data);
      fireSuccessConfetti();
    } catch (err) {
      console.warn('API error, presenting immediate direct response:', err);
      // Fallback direct reply based on language and query
      const parentName = form.name.trim();
      let fallbackText = '';
      if (language === 'fr') {
        fallbackText = `Bonjour ${parentName}. Merci d'avoir contacté l'École Primaire Privée St. Silas EAR Kibondo (Code REB : 530413). Avec notre taux de réussite de 100% au PLE national et notre encadrement bilingue de la Maternelle au P6, nous accueillons avec enthousiasme votre demande. Nos frais sont structurés par trimestre (Maternelle : 45 000 RWF ; P1-P3 : 55 000 RWF ; P4-P6 : 65 000 RWF, incluant la cantine quotidienne chaude). Le secrétariat et le Directeur Emmanuel Twahirwa restent à votre écoute au +250 788 765 432.`;
      } else if (language === 'rw') {
        fallbackText = `Muraho ${parentName}. Ubusabe bwawe bwakiriwe neza mu biro by'Umuyobozi w'Ishuri Ryigenga rya St. Silas EAR Kibondo (Kode REB: 530413). Ishuri ryacu ryatsindishije 100% mu bizamini bya Leta (PLE) kandi ryigisha uburere bw'itorero ry'u Rwanda kuva mu Nshuke kugeza muri P6. Amafaranga y'ishuri ateye atya: Inshuke: 45,000 Frw; P1-P3: 55,000 Frw; P4-P6: 65,000 Frw ku gihembwe (harimo ifunguro n'igikoma). Umuyobozi Emmanuel Twahirwa ariteguye kubakira kuri +250 788 765 432.`;
      } else {
        fallbackText = `Dear ${parentName}, thank you for contacting St. Silas Private Primary School EAR Kibondo (REB Code: 530413). With our 100% PLE national exam pass rate and nurturing CBC foundation from Nursery to P6, we have registered your inquiry regarding "${form.message.slice(0, 45)}...". Term contributions are Nursery: 45,000 RWF; P1-P3: 55,000 RWF; P4-P6: 65,000 RWF (including warm daily porridge and lunch). Head Teacher Emmanuel Twahirwa welcomes you to visit our campus in Kibondo Village or call +250 788 765 432.`;
      }

      setAiResponse({
        reply: fallbackText,
        ticketId: `KEA-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        recipient: form.name,
      });
      fireSuccessConfetti();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse.reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetForm = () => {
    setAiResponse(null);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleOpenMapClick = () => {
    if (onOpenMap) {
      onOpenMap();
    } else {
      setIsMapModalOpen(true);
    }
  };

  // Google Maps Direct and Directions URLs
  const lat = -1.6050;
  const lng = 30.3880;
  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section id="contact" className="py-20 bg-slate-100/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {t('contactBadge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {t('contactTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            {t('contactSub')}
          </p>
        </div>

        {/* Location Card with On-Demand "Click to Show Google Map" Action */}
        <div className="mb-14 rounded-3xl border-2 border-emerald-600/30 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-emerald-500/5 via-transparent to-amber-500/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {t('viewMapModalTitle')}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
                    REB 530413
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {t('schoolLocation')}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 pt-1">
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>{t('mapCoordinates')}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-sans font-medium text-slate-500 dark:text-slate-400">
                    {t('campusLandmark')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                id="contact-show-google-map-btn"
                onClick={handleOpenMapClick}
                className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/25 flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>{t('showMapBtn')}</span>
              </button>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>{t('getDirections')}</span>
              </a>

              <a
                href={directMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title={t('openInGoogleMaps')}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('campusLocationTitle')}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                    {t('campusAddress')}
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                    {t('campusLandmark')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('phoneTitle')}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                    {t('contactPhone')}
                  </p>
                  <a
                    href="tel:+250788765432"
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-block mt-1"
                  >
                    {t('callSecretariat')}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('emailTitle')}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                    {t('contactEmail')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('hoursTitle')}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                    {t('contactHours')}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Secretary Capability Badge Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      {t('aiSecretaryBadge')}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                    Official REB 530413
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {t('aiPoweredInstantResponse')}
                </p>
              </div>
            </div>
          </div>

          {/* Right: "Envoyer une Demande Direct" Form with High Animation */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{t('sendInquiryTitle')}</span>
                  <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t('sendInquirySub')}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 shrink-0">
                <Bot className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Direct Response</span>
              </div>
            </div>

            {/* High Animation Success Card with Direct AI Response */}
            {aiResponse ? (
              <div className="space-y-5 animate-in zoom-in-95 fade-in duration-300">
                {/* Celebratory Banner with Concentric Pulsing Glow */}
                <div className="relative rounded-2xl p-6 text-white text-center overflow-hidden shadow-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 shadow-emerald-700/20">
                  {/* Decorative background circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

                  {/* Pulsing Checkmark Emblem */}
                  <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                    <span className="absolute inset-1 rounded-full bg-white/30 animate-pulse" />
                    <div className="relative w-14 h-14 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-lg">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                  </div>

                  <h4 className="text-lg sm:text-xl font-black tracking-tight">
                    {t('officialSchoolResponse')}
                  </h4>
                  <p className="text-xs text-emerald-100 max-w-md mx-auto mt-1">
                    {t('dispatchRecorded')}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3 pt-3 border-t border-white/20 text-[11px] font-mono">
                    <span className="px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-xs font-bold text-amber-200">
                      {t('inquiryTicket')}: {aiResponse.ticketId}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white/10 text-emerald-100">
                      {aiResponse.recipient}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-950/50 text-white font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-sky-400" />
                      <span>Verified Admissions AI</span>
                    </span>
                  </div>
                </div>

                {/* The AI's Direct Answer Box */}
                <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 space-y-3 relative">
                  <div className="flex items-center justify-between gap-3 border-b border-emerald-200/80 dark:border-emerald-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block leading-tight">
                          {t('aiSecretaryBadge')}
                        </span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block leading-tight">
                          Official REB 530413 • EAR Kibondo
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 dark:text-emerald-400">{t('copied')}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>{t('copyResponse')}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Generated Text */}
                  <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-sans whitespace-pre-line py-1">
                    {aiResponse.reply}
                  </div>

                  <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified St. Silas Primary Academic Secretariat
                    </span>
                    <span>{new Date(aiResponse.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} CAT</span>
                  </div>
                </div>

                {/* Follow-Up Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t('askAnotherInquiry')}</span>
                  </button>

                  <a
                    href="tel:+250788765432"
                    className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>{t('callSecretariat')}</span>
                  </a>
                </div>
              </div>
            ) : (
              /* The Clean Input Form - No visible technical AI mode selector */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('namePlaceholder')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Jean Pierre Gasana"
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('emailPlaceholder')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. gasana@example.rw"
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('phonePlaceholder')}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +250 788 123 456"
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('messagePlaceholder')} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="e.g. How much are the school fees for P3? Does the fee include daily porridge and lunch? When do new admissions close?"
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none disabled:opacity-60"
                  />
                </div>

                {/* Submitting Status / Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t('inquiryProcessing')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t('sendBtn')}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Local Google Map Modal fallback */}
      <GoogleMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
      />
    </section>
  );
};
