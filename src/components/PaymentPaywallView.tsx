import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  ExternalLink,
  Mail,
  KeyRound,
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Copy,
  Check,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const PaymentPaywallView: React.FC = () => {
  const {
    user,
    serverSubscription,
    isCheckingServerSubscription,
    refreshSubscriptionStatus,
    submitActivationCode,
    addToast,
  } = useApp();

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const LEMON_CHECKOUT_URL =
    'https://businessai-app.lemonsqueezy.com/checkout/buy/301e87b4-22a6-4c76-b65a-0d8f2c73068a';
  const WHATSAPP_DISPLAY = '+229 01 63 63 88 93';
  const WHATSAPP_RAW = '2290163638893';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(LEMON_CHECKOUT_URL);
    setCopiedLink(true);
    addToast('success', 'Lien copié !', 'Le lien de paiement Lemon Squeezy a été copié dans votre presse-papier.');
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
        message: result.message || 'Votre accès a été débloqué avec succès ! Rechargement...',
      });
      setCode('');
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshSubscriptionStatus();
    setIsRefreshing(false);
    addToast('info', 'Statut actualisé', 'Vérification du paiement effectuée auprès du serveur.');
  };

  return (
    <div id="payment-paywall-view" className="max-w-4xl mx-auto py-4 px-2 sm:px-4 space-y-6">
      {/* Main Lock & Payment Card */}
      <div className="rounded-3xl bg-slate-900 text-white border-2 border-indigo-500/40 shadow-2xl overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-10 space-y-8">
          {/* 1. Header with exact requested text */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-xs sm:text-sm tracking-wide uppercase">
              <Lock className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>🔒 ACCÈS BLOQUÉ - PAIEMENT REQUIS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight pt-1">
              Pour utiliser cette IA, payez ici 👇
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              BusinessAI est un outil professionnel à accès payant. Cliquez sur le lien ci-dessous pour régler votre abonnement en ligne de manière 100% sécurisée.
            </p>
          </div>

          {/* 2. Direct Lemon Squeezy Link Box */}
          <div className="max-w-2xl mx-auto p-5 sm:p-6 rounded-2xl bg-indigo-950/60 border-2 border-indigo-400/50 space-y-4 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                id="btn-lemonsqueezy-checkout"
                href={LEMON_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer text-center"
              >
                <CreditCard className="w-5 h-5 text-emerald-100" />
                <span>Payer sur Lemon Squeezy (Lien Direct)</span>
                <ExternalLink className="w-4 h-4 text-emerald-100" />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                title="Copier le lien"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Lien copié !' : 'Copier le lien'}</span>
              </button>
            </div>

            <div className="text-[11px] sm:text-xs text-slate-400 font-mono break-all bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
              {LEMON_CHECKOUT_URL}
            </div>
          </div>

          {/* 3. The 3 Steps requested by User */}
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-sm sm:text-base font-black text-amber-300 uppercase tracking-wide text-center">
              Après paiement :
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 font-black text-sm flex items-center justify-center border border-indigo-500/40">
                  1
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  Vous recevez un CODE par email de Lemon Squeezy
                </div>
                <p className="text-[11px] text-slate-400">
                  Consultez votre boîte mail ou reçu d'achat instantané.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 font-black text-sm flex items-center justify-center border border-amber-500/40">
                  2
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  Collez ce code dans l’IA pour la débloquer
                </div>
                <p className="text-[11px] text-slate-400">
                  Entrez la clé dans le champ ci-dessous et validez.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-sm flex items-center justify-center border border-emerald-500/40">
                  3
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  Accès immédiat et illimité
                </div>
                <p className="text-[11px] text-slate-400">
                  Toutes les fonctionnalités IA sont déverrouillées.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Code Input Section */}
          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-800/90 border-2 border-indigo-400 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-300">
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>Collez votre CODE reçu par email ici :</span>
            </div>

            <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex : 301e87b4... ou clé de licence / commande"
                className="flex-1 px-4 py-3.5 rounded-xl border border-indigo-400/50 bg-slate-900 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-500"
              />

              <button
                type="submit"
                disabled={isSubmitting || !code.trim()}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                <span>{isSubmitting ? 'Validation...' : 'Débloquer l’IA'}</span>
              </button>
            </form>

            {feedback && (
              <div
                className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
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

          {/* 5. Need help? WhatsApp Support */}
          <div className="max-w-2xl mx-auto pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <div className="text-xs sm:text-sm font-black text-white flex items-center justify-center sm:justify-start gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Besoin d’aide ? WhatsApp : {WHATSAPP_DISPLAY}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Paiement Wave / Mobile Money disponible ou assistance pour votre code.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <a
                href={`https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(
                  "Bonjour ! J'ai besoin d'aide concernant le paiement ou mon code de déblocage pour BusinessAI."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ouvrir WhatsApp</span>
              </a>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing || isCheckingServerSubscription}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                title="Vérifier le statut"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? '...' : 'Vérifier'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Paiement crypté SSL via Lemon Squeezy • Validation instantanée côté serveur</span>
      </div>
    </div>
  );
};
