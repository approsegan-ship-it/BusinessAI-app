import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Printer,
  Copy,
  Check,
  X,
  Smartphone,
  Sparkles,
  Phone,
  FileCheck,
  Calendar,
  Building2,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OFFICIAL_PAYMENT_NUMBER, OFFICIAL_PAYMENT_DISPLAY } from './PaymentInstructionModal';

interface PurchaseReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PurchaseReceiptModal: React.FC<PurchaseReceiptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, company, formatMoney, addToast, openPaymentModal } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  if (!user.isPurchased || user.plan === 'free') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-slate-900"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900">
            Aucun Paiement Validé
          </h3>

          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Votre compte est actuellement sur la version non payée. Les reçus d'achat officiels et la garantie de tarif bloqué à vie sont délivrés dès réception de votre transfert vers le <strong>{OFFICIAL_PAYMENT_DISPLAY}</strong>.
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                openPaymentModal('starter');
              }}
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Régler mon Forfait (01 63 63 88 93)</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const receipt = user.activeReceipt || {
    receiptId: 'REC-0163638893-BLQ',
    orderNumber: `CMD-${new Date().getFullYear()}-016363`,
    planId: user.plan || 'pro',
    planName: (user.plan || 'pro').toUpperCase(),
    amount: user.plan === 'business' ? 49000 : user.plan === 'starter' ? 9900 : 19900,
    currency: 'FCFA',
    formattedAmount: user.plan === 'business' ? '49 000 FCFA' : user.plan === 'starter' ? '9 900 FCFA' : '19 900 FCFA',
    buyerName: user.name || company.name || 'Client BusinessAI',
    buyerEmail: user.email || 'client@businessai.app',
    buyerPhone: company.whatsapp || company.phone || '+225 01 63 63 88 93',
    paymentNumber: OFFICIAL_PAYMENT_NUMBER,
    paymentMethod: 'Wave / Mobile Money Direct',
    purchasedAt: new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    status: 'completed',
    priceLocked: true,
    priceLockGuarantee: 'Tarif ferme et bloqué à vie sans aucune hausse future',
    transactionRef: `TRX-${OFFICIAL_PAYMENT_NUMBER}-VALID`,
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(receipt.transactionRef);
    setCopied(true);
    addToast('success', 'Référence copiée', receipt.transactionRef);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `✅ Reçu Officiel d'Achat BusinessAI\n- Forfait : ${receipt.planName}\n- Montant : ${receipt.formattedAmount}\n- Numéro de paiement : ${OFFICIAL_PAYMENT_NUMBER}\n- Réf : ${receipt.transactionRef}\n- Statut : PAYÉ & PRIX BLOQUÉ À VIE\n- Accès IA : 100% Débloqué`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-900 my-6 max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Certificate Header Banner */}
          <div className="text-center space-y-2 pb-4 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Achat Vérifié &amp; Paiement Confirmé</span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Reçu Officiel &amp; Certificat d'Achat
            </h2>

            <p className="text-xs text-slate-500">
              Transaction enregistrée et certifiée pour <strong>{receipt.buyerName}</strong>
            </p>
          </div>

          {/* Price Lock Guaranteed Badge */}
          <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-emerald-50 to-indigo-50 border border-amber-300/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Prix Bloqué à Vie &bull; Aucune Hausse Future
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-black text-[9px]">
                  GARANTI
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Le montant de votre forfait ({receipt.formattedAmount}) est scellé et ne subira jamais d'augmentation.
              </p>
            </div>
          </div>

          {/* Receipt Content Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3 font-mono">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-sans">N° de Reçu :</span>
              <span className="font-bold text-slate-900">{receipt.receiptId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-sans">Date du Paiement :</span>
              <span className="font-semibold text-slate-800">{receipt.purchasedAt}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-sans">Forfait Souscrit :</span>
              <span className="font-extrabold text-indigo-700 uppercase">{receipt.planName} (Actif)</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-sans">Générations IA Incluses :</span>
              <span className="font-bold text-emerald-700">{user.maxCredits || 750} gén. / mois</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-sans">Numéro de Réception :</span>
              <span className="font-extrabold text-slate-900 flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>{receipt.paymentNumber}</span>
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-sans">Mode de Paiement :</span>
              <span className="text-slate-800">{receipt.paymentMethod}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-sans font-bold">Montant Total Réglé :</span>
              <span className="text-base font-black text-emerald-700">{receipt.formattedAmount}</span>
            </div>

            <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-sans">Réf. Transaction :</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-[11px]">{receipt.transactionRef}</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                  title="Copier la référence"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Official Stamp Box */}
          <div className="my-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-emerald-900 block">Sceau Officiel : ACQUITTÉ &amp; DÉFINITIF</span>
                <span className="text-emerald-700 text-[11px]">
                  Toutes les fonctionnalités et générateurs IA sont actifs sans limitation.
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le Reçu</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Partager sur WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
