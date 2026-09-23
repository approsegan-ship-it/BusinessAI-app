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
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PlanId, PRICING_PLANS } from '../config/plans';

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
  const { submitActivationCode, addToast, refreshSubscriptionStatus } = useApp();

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const LEMON_CHECKOUT_URL =
    'https://businessai-app.lemonsqueezy.com/checkout/buy/301e87b4-22a6-4c76-b65a-0d8f2c73068a';
  const WHATSAPP_DISPLAY = '+229 01 63 63 88 93';
  const WHATSAPP_RAW = '2290163638893';

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(LEMON_CHECKOUT_URL);
    setCopiedLink(true);
    addToast('success', 'Lien copié !', 'Le lien de paiement Lemon Squeezy a été copié.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setFeedback({
        type: 'error',
        message: 'Veuillez coller le code reçu par email de Lemon Squeezy.',
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
        message: result.message || 'Votre accès a été débloqué avec succès !',
      });
      setCode('');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setFeedback({
        type: 'error',
        message:
          result.error ||
          "Code non reconnu. Vérifiez l'email reçu de Lemon Squeezy ou contactez-nous sur WhatsApp au " +
            WHATSAPP_DISPLAY,
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-6 max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2.5 max-w-md mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-xs uppercase tracking-wide">
                <Lock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>🔒 ACCÈS BLOQUÉ - PAIEMENT REQUIS</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Pour utiliser cette IA, payez ici 👇
              </h2>

              <p className="text-xs sm:text-sm text-slate-300">
                Abonnement sécurisé en ligne par carte bancaire ou paiement international via Lemon Squeezy.
              </p>
            </div>

            {/* Direct Lemon Squeezy Checkout Link */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/60 border border-indigo-400/40 space-y-3 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <a
                  href={LEMON_CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <CreditCard className="w-4 h-4 text-emerald-100" />
                  <span>Payer sur Lemon Squeezy</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-100" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Lien copié !' : 'Copier le lien'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-mono break-all bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                {LEMON_CHECKOUT_URL}
              </div>
            </div>

            {/* The 3 Steps */}
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wide text-center">
                Après paiement :
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 font-black text-xs flex items-center justify-center mx-auto border border-indigo-500/40">
                    1
                  </div>
                  <div className="text-xs font-bold text-white">
                    Vous recevez un CODE par email de Lemon Squeezy
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center mx-auto border border-amber-500/40">
                    2
                  </div>
                  <div className="text-xs font-bold text-white">
                    Collez ce code dans l’IA pour la débloquer
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs flex items-center justify-center mx-auto border border-emerald-500/40">
                    3
                  </div>
                  <div className="text-xs font-bold text-white">
                    Accès immédiat et illimité
                  </div>
                </div>
              </div>
            </div>

            {/* Code Input */}
            <div className="p-5 rounded-2xl bg-slate-800/90 border border-indigo-400/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-300">
                <KeyRound className="w-4 h-4 text-amber-300" />
                <span>Collez votre CODE reçu par email ici :</span>
              </div>

              <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex : 301e87b4... ou clé de licence"
                  className="flex-1 px-3.5 py-3 rounded-xl border border-indigo-400/50 bg-slate-900 text-white font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-500"
                />

                <button
                  type="submit"
                  disabled={isSubmitting || !code.trim()}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
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
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
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
                  "Bonjour ! J'ai besoin d'aide pour le paiement Lemon Squeezy ou mon code de déblocage pour BusinessAI."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
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
