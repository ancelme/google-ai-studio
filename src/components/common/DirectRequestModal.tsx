import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { generateDirectAIAnswer, DirectInquiryPayload } from '../../services/aiService';
import { UserRequest } from '../../types';
import {
  Sparkles,
  Send,
  X,
  CheckCircle2,
  Clock,
  User,
  Mail,
  Phone,
  HelpCircle,
  Copy,
  Check,
  Bot,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

interface DirectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewRequestLogged?: (request: UserRequest) => void;
}

export const DirectRequestModal: React.FC<DirectRequestModalProps> = ({
  isOpen,
  onClose,
  onNewRequestLogged,
}) => {
  const { t, language } = useLanguage();

  const [form, setForm] = useState<DirectInquiryPayload>({
    name: '',
    email: '',
    phone: '',
    role: 'parent',
    childGrade: 'Primary 1 (P1)',
    category: 'Admission & Inscription',
    subject: '',
    message: '',
    language,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [aiAnswerResult, setAiAnswerResult] = useState<{
    trackingNumber: string;
    answer: string;
    timestamp: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;

    setIsLoading(true);

    try {
      const result = await generateDirectAIAnswer({
        ...form,
        language,
      });

      setAiAnswerResult({
        trackingNumber: result.trackingNumber,
        answer: result.aiResponse,
        timestamp: result.timestamp,
      });

      // Commit to parent registry if handler provided
      if (onNewRequestLogged) {
        const newReq: UserRequest = {
          id: `req-${Date.now()}`,
          trackingNumber: result.trackingNumber,
          senderName: form.name,
          senderEmail: form.email,
          senderPhone: form.phone,
          senderRole: form.role,
          category: form.category as UserRequest['category'],
          subject: form.subject,
          message: form.message,
          status: 'Responded',
          createdAt: result.timestamp,
          response: {
            respondedAt: result.timestamp,
            respondedBy: 'St. Silas AI Admissions Assistant (Verified)',
            responseMessage: result.aiResponse,
            actionTaken: 'Direct AI Response Provided & Recorded in Registry',
          },
        };
        onNewRequestLogged(newReq);
      }
    } catch (err) {
      console.error('Error generating direct response:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (aiAnswerResult) {
      navigator.clipboard.writeText(aiAnswerResult.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setAiAnswerResult(null);
    setForm({
      name: '',
      email: '',
      phone: '',
      role: 'parent',
      childGrade: 'Primary 1 (P1)',
      category: 'Admission & Inscription',
      subject: '',
      message: '',
      language,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-sky-600 text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {language === 'rw'
                    ? 'Ohereza Ubusabe bwawe & Usubizwe ako Kanya na AI'
                    : language === 'fr'
                    ? 'Envoyer une Demande Directe (Réponse IA Immédiate)'
                    : 'Send Direct Request (Instant AI Answer)'}
                </h3>
                <span className="hidden sm:inline-flex text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Direct AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                St. Silas Private Primary School • REB Code: 530413 • Kibondo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {aiAnswerResult ? (
            /* Result View: Instant AI Answer */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      {language === 'rw'
                        ? 'Ubusabe Bwakiriwe & Bwasubijwe Ako Kanya!'
                        : language === 'fr'
                        ? 'Demande Enregistrée & Réponse Directe Fournie !'
                        : 'Request Logged & Answered Directly by AI!'}
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                      Tracking No: {aiAnswerResult.trackingNumber} · {aiAnswerResult.timestamp}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 transition-colors shrink-0 shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copier'}</span>
                </button>
              </div>

              {/* Formatted Answer Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>
                    {language === 'rw'
                      ? 'Igisubizo cy\'Ubuhanga bwa AI (St. Silas School AI Assistant):'
                      : language === 'fr'
                      ? 'Réponse Immédiate de l\'IA de l\'École St. Silas :'
                      : 'Immediate Response from St. Silas AI Assistant:'}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {aiAnswerResult.answer}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Logged in Admin Portal for Fr. Silas Nkurunziza's review</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Institution
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {language === 'rw' ? 'Ohereza Ubundi Busabe' : language === 'fr' ? 'Envoyer une Autre Demande' : 'Submit Another Request'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                >
                  {language === 'rw' ? 'Funga' : language === 'fr' ? 'Fermer' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            /* Input Form: Credentials & Direct Inquiry */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {language === 'rw'
                    ? 'Andika imyirondoro yawe n\'ikibazo cyangwa ubusabe ufite, urahita usubizwa ako kanya na AI ya St. Silas!'
                    : language === 'fr'
                    ? 'Renseignez vos coordonnées et votre question, notre IA vous répondra immédiatement et enregistrera votre demande pour la direction !'
                    : 'Enter your credentials and question to receive an immediate personalized AI answer, automatically recorded in the school registry!'}
                </span>
              </div>

              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'rw' ? 'Amazina Yombi (Full Name) *' : language === 'fr' ? 'Nom Complet *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Marie Claire Mukamana"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. mukamana@example.rw"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Row 2: Phone and Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'rw' ? 'Telefoni (Phone) *' : language === 'fr' ? 'Téléphone *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +250 788 123 456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'rw' ? 'Icyiciro Urimo (Status / Role)' : language === 'fr' ? 'Votre Statut' : 'Your Role'}
                  </label>
                  <select
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value as DirectInquiryPayload['role'] })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="parent">Parent / Umubyeyi</option>
                    <option value="student">Pupil / Umunyeshuri</option>
                    <option value="visitor">Prospective Applicant / Umushyitsi</option>
                    <option value="teacher">Educator / Mwalimu</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Category & Class of Interest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'rw' ? 'Icyiciro cy\'Ubusabe (Category)' : language === 'fr' ? 'Catégorie de la Demande' : 'Request Category'}
                  </label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Admission">Admission & Inscription (Kwandika Umwana)</option>
                    <option value="Fee Payment Plan">Frais de Scolarité & Échelonnement (Amafaranga y'Ishuri)</option>
                    <option value="Academic Report">Rapport Académique & PLE (Amanota n'Imitsindire)</option>
                    <option value="School Bus / Transport">Transport Scolaire & Bus (Imodoka y'Ishuri)</option>
                    <option value="General Inquiry">Autre Question Générale (Ikindi Kibazo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'rw' ? 'Ishuri ry\'Umwana (Grade Level)' : language === 'fr' ? 'Classe Concernée' : 'Target Grade Level'}
                  </label>
                  <select
                    value={form.childGrade}
                    onChange={e => setForm({ ...form, childGrade: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Nursery 1">Nursery 1 (Baby Class)</option>
                    <option value="Nursery 2">Nursery 2 (Middle Class)</option>
                    <option value="Nursery 3">Nursery 3 (Top Class)</option>
                    <option value="Primary 1 (P1)">Primary 1 (P1)</option>
                    <option value="Primary 2 (P2)">Primary 2 (P2)</option>
                    <option value="Primary 3 (P3)">Primary 3 (P3)</option>
                    <option value="Primary 4 (P4)">Primary 4 (P4)</option>
                    <option value="Primary 5 (P5)">Primary 5 (P5)</option>
                    <option value="Primary 6 (P6)">Primary 6 (P6 - PLE)</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'rw' ? 'Umutwe w\'Ubusabe (Subject) *' : language === 'fr' ? 'Objet de votre Demande *' : 'Request Subject *'}
                </label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Demande d'admission en P3 et questions sur les frais de cantine"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Detailed Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'rw' ? 'Ubutumwa cyangwa Ikibazo cyawe (Detailed Message) *' : language === 'fr' ? 'Votre Message / Question Précise *' : 'Detailed Question / Message *'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder={
                    language === 'fr'
                      ? 'Expliquez en détail votre demande pour obtenir une réponse précise...'
                      : language === 'rw'
                      ? 'Sobanura mu buryo burambuye ubusabe cyangwa ikibazo ufite...'
                      : 'Detail your inquiry so the AI can provide an accurate response...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/25 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>
                        {language === 'rw'
                          ? 'AI irimo gutegura igisubizo...'
                          : language === 'fr'
                          ? 'L\'IA génère votre réponse...'
                          : 'Generating Direct AI Answer...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {language === 'rw'
                          ? 'Ohereza & Usubizwe na AI'
                          : language === 'fr'
                          ? 'Envoyer la Demande & Réponse Directe IA'
                          : 'Send Request & Get Instant AI Answer'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
