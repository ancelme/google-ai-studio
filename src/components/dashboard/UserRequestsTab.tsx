import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { UserRequest } from '../../types';
import {
  Inbox,
  Send,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Search,
  MessageSquare,
  AlertCircle,
  Tag,
  ShieldCheck,
  X,
  Sparkles
} from 'lucide-react';

interface UserRequestsTabProps {
  requests: UserRequest[];
  onRespondRequest: (requestId: string, responseMessage: string, actionTaken: string, newStatus: UserRequest['status']) => void;
}

export const UserRequestsTab: React.FC<UserRequestsTabProps> = ({ requests, onRespondRequest }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null);

  // Response form state
  const [replyMessage, setReplyMessage] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [replyStatus, setReplyStatus] = useState<UserRequest['status']>('Responded');
  const [successToast, setSuccessToast] = useState(false);

  // Security check: Only admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/50">
        <AlertCircle className="w-16 h-16 text-rose-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {t('accessDeniedTitle') || 'Access Restricted to Administrators'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {t('onlyAdminRequestsDesc') || 'Only the School Administrator (Umuyobozi w\'Ishuri) has authorization to inspect incoming parent, student, and teacher requests and send official responses.'}
        </p>
      </div>
    );
  }

  const filteredRequests = requests.filter(req => {
    const matchesSearch =
      req.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenReplyModal = (req: UserRequest) => {
    setSelectedRequest(req);
    setReplyMessage(req.response?.responseMessage || '');
    setActionTaken(req.response?.actionTaken || 'Request Reviewed & Approved');
    setReplyStatus(req.status === 'Pending' ? 'Responded' : req.status);
  };

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !replyMessage.trim()) return;

    onRespondRequest(selectedRequest.id, replyMessage, actionTaken, replyStatus);
    setSuccessToast(true);
    setSelectedRequest(null);

    setTimeout(() => {
      setSuccessToast(false);
    }, 4000);
  };

  const getStatusBadge = (status: UserRequest['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'Under Review':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300';
      case 'Responded':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      case 'Resolved':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold">
                {t('userRequestsTitle') || 'User Requests & Official Responses (Ubusabe n\'Ibisubizo)'}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Admin Exclusive
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {t('userRequestsDesc') || 'Review, evaluate, and provide official recorded responses to parent inquiries, admission requests, and staff petitions.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span>{requests.filter(r => r.status === 'Pending').length} Pending</span>
          <span>·</span>
          <span>{requests.filter(r => r.status === 'Responded' || r.status === 'Resolved').length} Handled</span>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">
            {t('responseSentSuccess') || 'Official response recorded and dispatched successfully to the applicant/parent.'}
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('searchRequestsPlaceholder') || 'Search requests by name, tracking number, category, or content...'}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending (Bitegerejwe)</option>
            <option value="Under Review">Under Review (Birimo Gusuzumwa)</option>
            <option value="Responded">Responded (Byasubijwe)</option>
            <option value="Resolved">Resolved (Byakemutse)</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            No user requests matching filter.
          </div>
        ) : (
          filteredRequests.map(req => (
            <div
              key={req.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                    {req.trackingNumber}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {req.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(req.status)}`}>
                    {req.status}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{req.createdAt}</span>
                  </span>
                </div>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{req.senderName}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">({req.senderRole})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{req.senderEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{req.senderPhone}</span>
                </div>
              </div>

              {/* Message Subject & Content */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {req.subject}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {req.message}
                </p>
              </div>

              {/* Existing Response Box (if already responded) */}
              {req.response && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Official Response from: {req.response.respondedBy}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{req.response.respondedAt}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                    {req.response.responseMessage}
                  </p>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    Action Taken: {req.response.actionTaken}
                  </div>
                </div>
              )}

              {/* Response Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenReplyModal(req)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{req.response ? 'Update Response (Hindura Igisubizo)' : 'Subiza Ubu Busabe (Respond to Request)'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {selectedRequest && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Gusubiza Ubusabe bw\'Umubyeyi / Umukoresha
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedRequest.trackingNumber} — {selectedRequest.senderName} ({selectedRequest.senderEmail})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSendResponse} className="p-6 overflow-y-auto space-y-4">
              {/* Original Request Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Subject: {selectedRequest.subject}
                </span>
                <p className="text-slate-600 dark:text-slate-400 italic">
                  "{selectedRequest.message}"
                </p>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  New Status (Imiterere y'Ubusabe):
                </label>
                <select
                  value={replyStatus}
                  onChange={e => setReplyStatus(e.target.value as UserRequest['status'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Responded">Responded (Byasubijwe)</option>
                  <option value="Resolved">Resolved (Byakemutse neza)</option>
                  <option value="Under Review">Under Review (Birimo Gusuzumwa)</option>
                  <option value="Rejected">Rejected (Byanzwe)</option>
                </select>
              </div>

              {/* Action Taken */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Action Taken (Icyemezo Cyafashwe):
                </label>
                <input
                  type="text"
                  required
                  value={actionTaken}
                  onChange={e => setActionTaken(e.target.value)}
                  placeholder="e.g. Approved Payment Plan / Assigned Stream / Dispatched Book Materials"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Official Response Message */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Official Response Message (Ubutumwa bwo Gusubiza):
                  </label>
                  <div className="flex gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setReplyMessage('Ubusabe bwanyu bwakiriwe neza kandi bwemejwe n\'ubuyobozi bwa St. Silas EAR Kibondo. Murihawe ikaze ku ishuri cyangwa mukoreshe MTN MoMo *182# kwishyura.')}
                      className="text-emerald-600 hover:underline"
                    >
                      Template (Kinyarwanda)
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => setReplyMessage('Your request has been officially reviewed and approved by St. Silas Primary School administration. You may proceed with the stated arrangements.')}
                      className="text-emerald-600 hover:underline"
                    >
                      Template (English)
                    </button>
                  </div>
                </div>
                <textarea
                  rows={5}
                  required
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  placeholder="Write clear official guidance and response to the parent/user..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel (Reka)
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/25 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Emeza Ubutumwa (Commit Response)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
