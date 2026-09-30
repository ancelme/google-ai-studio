import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FeeInvoice } from '../../types';
import { Wallet, Smartphone, Building2, CheckCircle2, X, Receipt, Download, ArrowUpRight } from 'lucide-react';

interface FeesTabProps {
  fees: FeeInvoice[];
  onRecordPayment: (invoiceId: string, amount: number, method: 'MTN Mobile Money' | 'Airtel Money' | 'Bank Transfer') => void;
}

export const FeesTab: React.FC<FeesTabProps> = ({ fees, onRecordPayment }) => {
  const { t } = useLanguage();
  const [activeInvoice, setActiveInvoice] = useState<FeeInvoice | null>(null);
  const [payMethod, setPayMethod] = useState<'MTN Mobile Money' | 'Airtel Money' | 'Bank Transfer'>('MTN Mobile Money');
  const [momoPhone, setMomoPhone] = useState('+250 788 888 123');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [receiptData, setReceiptData] = useState<any>(null);

  const totalBilled = fees.reduce((acc, f) => acc + f.amountTotal, 0);
  const totalPaid = fees.reduce((acc, f) => acc + f.amountPaid, 0);
  const totalBalance = totalBilled - totalPaid;

  const formatRWF = (n: number) => {
    return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 })
      .format(n)
      .replace('RWF', '')
      .trim() + ' RWF';
  };

  const openPaymentModal = (invoice: FeeInvoice) => {
    setActiveInvoice(invoice);
    const bal = invoice.balance ?? (invoice.amountTotal - invoice.amountPaid);
    setPayAmount(bal);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvoice || payAmount <= 0) return;

    onRecordPayment(activeInvoice.id, payAmount, payMethod);

    // Generate receipt
    setReceiptData({
      txnId: `TXN-SSP-${Math.floor(100000 + Math.random() * 900000)}`,
      invoiceNo: activeInvoice.invoiceNumber || activeInvoice.invoiceNo || activeInvoice.id,
      studentName: activeInvoice.studentName,
      amount: payAmount,
      method: payMethod,
      phone: momoPhone,
      date: new Date().toLocaleString(),
    });

    setActiveInvoice(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('dashFees')}
          </h2>
          <p className="text-xs text-slate-500">
            Tuition billing, MTN MoMo integration, and financial clearance tracking
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Total Term Billing</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{formatRWF(totalBilled)}</span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Collected Revenue</span>
          <span className="text-2xl font-black text-emerald-600">{formatRWF(totalPaid)}</span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Outstanding Balance</span>
          <span className="text-2xl font-black text-rose-600">{formatRWF(totalBalance)}</span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-850 text-slate-500 font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Total Billed</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {fees.map(inv => {
                const bal = inv.balance ?? (inv.amountTotal - inv.amountPaid);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750">
                    <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-300">
                      {inv.invoiceNumber || inv.invoiceNo}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {inv.studentName}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {inv.grade}
                    </td>
                    <td className="py-3 px-4 font-bold">
                      {formatRWF(inv.amountTotal)}
                    </td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">
                      {formatRWF(inv.amountPaid)}
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-600">
                      {formatRWF(bal)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {inv.dueDate}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'Partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {bal > 0 ? (
                        <button
                          type="button"
                          onClick={() => openPaymentModal(inv)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        >
                          Pay Online
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Money Payment Modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              type="button"
              onClick={() => setActiveInvoice(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                Instant Fee Settlement
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Settle School Fees
              </h3>
              <p className="text-xs text-slate-500">
                Invoice {activeInvoice.invoiceNumber || activeInvoice.invoiceNo || activeInvoice.id} • {activeInvoice.studentName}
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'MTN Mobile Money', label: 'MTN MoMo', color: 'border-yellow-400 bg-yellow-50/40 text-yellow-800 dark:text-yellow-300' },
                { id: 'Airtel Money', label: 'Airtel Money', color: 'border-rose-400 bg-rose-50/40 text-rose-800 dark:text-rose-300' },
                { id: 'Bank Transfer', label: 'Bank of Kigali', color: 'border-blue-400 bg-blue-50/40 text-blue-800 dark:text-blue-300' },
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPayMethod(m.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                    payMethod === m.id
                      ? `${m.color} ring-2 ring-emerald-500`
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payer Phone Number (Prompt will be sent)
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={momoPhone}
                    onChange={e => setMomoPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Amount (RWF)
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  max={activeInvoice.balance ?? (activeInvoice.amountTotal - activeInvoice.amountPaid)}
                  value={payAmount}
                  onChange={e => setPayAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Remaining balance: {formatRWF(activeInvoice.balance ?? (activeInvoice.amountTotal - activeInvoice.amountPaid))}
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Authorize & Pay {formatRWF(payAmount)}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {receiptData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white text-slate-900 p-6 sm:p-8 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setReceiptData(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1 border-b border-slate-200 pb-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Payment Successful</h3>
              <p className="text-xs text-slate-500 font-mono">{receiptData.txnId}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold">{receiptData.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-mono font-bold">{receiptData.invoiceNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-bold">{receiptData.method}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-black text-emerald-700 text-sm">{formatRWF(receiptData.amount)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Timestamp:</span>
                <span className="font-mono text-[11px]">{receiptData.date}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setReceiptData(null);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
            >
              Done & Save Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
