import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  ExternalLink,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Copy,
  Check,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Smartphone,
  Globe,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PlanId } from '../config/plans';
import {
  PAYMENT_CHANNELS,
  openKkiapayPayment,
  openGumroadPayment,
} from '../services/paymentService';

interface PaymentInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPlan?: PlanId;
}

export const OFFICIAL_PAYMENT_NUMBER = '0163638893';
export const OFFICIAL_PAYMENT_DISPLAY = '+229 01 63 63 88 93';

export const PaymentInstructionModal: React.FC<PaymentInstructionModalProps> = ({
  isOpen,
  onClose,
  preselectedPlan = 'starter',
}) => {
  const { submitActivationCode, addToast, refreshSubscriptionStatus, user } = useApp();

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKkiapay, setCopiedKkiapay] = useState(false);
  const [copiedGumroad, setCopiedGumroad] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const WHATSAPP_DISPLAY = PAYMENT_CHANNELS.support.whatsappDisplay;
  const WHATSAPP_RAW = PAYMENT_CHANNELS.support.whatsappRaw;

  if (!isOpen) return null;

  const handleCopyLink = (url: string, type: 'kkiapay' | 'gumroad') => {
    navigator.clipboard.writeText(url);
    if (type === 'kkiapay') {
      setCopiedKkiapay(true);
      setTimeout(() => setCopiedKkiapay(false), 2500);
      addToast('success', 'Lien copié !', 'Lien Kkiapay (Moov/MTN - 10.000F) copié.');
    } else {
      setCopiedGumroad(true);
      setTimeout(() => setCopiedGumroad(false), 2500);
      addToast('success', 'Lien copié !', 'Lien Gumroad (Carte Visa - $20) copié.');
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setFeedback({
        type: 'error',
        message: 'Veuillez saisir le code reçu après votre paiement Kkiapay ou Gumroad.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const result = await submitActivationCode(code.trim());
    setIsSubmitting(false);

    if (result.success) {
      setFeedback({
        type: 'success',
        message: result.message || 'Votre accès a été débloqué avec succès ! Chargement...',
      });
      setCode('');
      addToast('success', 'Accès débloqué !', 'Votre compte BusinessAI PRO est actif.');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setFeedback({
        type: 'error',
        message:
          result.error ||
          "Code non reconnu. Vérifiez l'email ou SMS reçu, ou contactez le support WhatsApp au " +
            WHATSAPP_DISPLAY,
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-5 sm:p-8 shadow-2xl text-white my-8 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2 max-w-md mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-xs uppercase tracking-wide">
                <Lock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>🔒 DÉVERROUILLER L’ACCÈS COMPLET</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                Pour utiliser cette IA, payez ici 👇
              </h2>
              <p className="text-xs text-slate-300">
                Paiement direct sécurisé adapté à votre localisation.
              </p>
            </div>

            {/* LES 2 BOUTONS OFFICIELS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* BOUTON 1 : KKIAPAY */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/90 to-slate-900 border-2 border-emerald-500/60 shadow-lg flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Bouton 1
                    </span>
                    <span className="text-xs font-black text-emerald-300">10.000F</span>
                  </div>
                  <h3 className="text-sm font-black text-white leading-snug">
                    Payer par Moov Money / MTN (Kkiapay) - 10.000F
                  </h3>
                  <p className="text-[11px] font-bold text-emerald-300">
                    → Pour tes clients du Bénin, Togo, Sénégal
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Moov Money, MTN MoMo, Celtiis, Wave & Orange Money.
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => openKkiapayPayment({ email: user?.email, name: user?.name })}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-slate-950" />
                    <span>Payer 10.000F (Kkiapay)</span>
                    <ExternalLink className="w-3 h-3 text-slate-950" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(PAYMENT_CHANNELS.kkiapay.url, 'kkiapay')}
                    className="w-full py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-semibold hover:bg-slate-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedKkiapay ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKkiapay ? 'Lien copié !' : 'Copier lien Kkiapay'}</span>
                  </button>
                </div>
              </div>

              {/* BOUTON 2 : GUMROAD */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/90 to-slate-900 border-2 border-indigo-500/60 shadow-lg flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                      Bouton 2
                    </span>
                    <span className="text-xs font-black text-indigo-300">$20 USD</span>
                  </div>
                  <h3 className="text-sm font-black text-white leading-snug">
                    Payer par carte Visa (Gumroad) - $20
                  </h3>
                  <p className="text-[11px] font-bold text-indigo-300">
                    → Pour les clients en France, USA
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Carte Visa, Mastercard, Apple Pay, PayPal international.
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    onClick={openGumroadPayment}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-white" />
                    <span>Payer $20 (Gumroad)</span>
                    <ExternalLink className="w-3 h-3 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(PAYMENT_CHANNELS.gumroad.url, 'gumroad')}
                    className="w-full py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-semibold hover:bg-slate-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedGumroad ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedGumroad ? 'Lien copié !' : 'Copier lien Gumroad'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* The 3 Steps */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-amber-300 uppercase tracking-wide text-center">
                Après paiement :
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center space-y-1">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-black text-xs flex items-center justify-center mx-auto border border-indigo-500/40">
                    1
                  </div>
                  <div className="text-[11px] font-bold text-white">
                    Vous recevez un CODE par email ou SMS
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center space-y-1">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center mx-auto border border-amber-500/40">
                    2
                  </div>
                  <div className="text-[11px] font-bold text-white">
                    Collez ce code dans l’IA pour la débloquer
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center space-y-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs flex items-center justify-center mx-auto border border-emerald-500/40">
                    3
                  </div>
                  <div className="text-[11px] font-bold text-white">
                    Accès immédiat et illimité
                  </div>
                </div>
              </div>
            </div>

            {/* Code Input */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-indigo-400/60 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-300">
                <KeyRound className="w-4 h-4 text-amber-300" />
                <span>Collez votre CODE reçu par email ou SMS ici :</span>
              </div>

              <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex : Référence Kkiapay, clé Gumroad ou code VIP"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-indigo-400/50 bg-slate-900 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !code.trim()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>{isSubmitting ? 'Validation...' : 'Débloquer l’IA'}</span>
                </button>
              </form>

              {feedback && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}
            </div>

            {/* Need Help WhatsApp */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Besoin d’aide ? WhatsApp : <strong>{WHATSAPP_DISPLAY}</strong></span>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(
                  "Bonjour ! J'ai besoin d'aide pour le paiement Kkiapay (10.000F) ou Gumroad ($20) pour BusinessAI."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ouvrir WhatsApp</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
