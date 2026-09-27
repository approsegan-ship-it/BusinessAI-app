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
} from 'lucide-react';
import {
  PAYMENT_CHANNELS,
  openKkiapayPayment,
  openGumroadPayment,
} from '../services/paymentService';

export const PaymentPaywallView: React.FC = () => {
  const {
    user,
    serverSubscription,
    isCheckingServerSubscription,
    refreshSubscriptionStatus,
    submitActivationCode,
    startTrial,
    addToast,
  } = useApp();

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const [copiedKkiapay, setCopiedKkiapay] = useState(false);
  const [copiedGumroad, setCopiedGumroad] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const WHATSAPP_DISPLAY = PAYMENT_CHANNELS.support.whatsappDisplay;
  const WHATSAPP_RAW = PAYMENT_CHANNELS.support.whatsappRaw;

  const handleStartTrial = async () => {
    setIsStartingTrial(true);
    setFeedback(null);
    const res = await startTrial();
    setIsStartingTrial(false);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: '🎉 Votre essai de 7 jours est activé avec succès ! Accès immédiat déverrouillé.',
      });
      addToast('success', 'Essai activé !', 'Profitez de 7 jours gratuits sur BusinessAI.');
    } else {
      setFeedback({
        type: 'error',
        message: res.error || "Impossible d'activer l'essai gratuit.",
      });
    }
  };

  const handleCopyLink = (url: string, type: 'kkiapay' | 'gumroad') => {
    navigator.clipboard.writeText(url);
    if (type === 'kkiapay') {
      setCopiedKkiapay(true);
      setTimeout(() => setCopiedKkiapay(false), 2500);
      addToast('success', 'Lien copié !', 'Lien de paiement Kkiapay (Moov/MTN - 10.000F) copié.');
    } else {
      setCopiedGumroad(true);
      setTimeout(() => setCopiedGumroad(false), 2500);
      addToast('success', 'Lien copié !', 'Lien de paiement Gumroad (Carte Visa - $20) copié.');
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setFeedback({
        type: 'error',
        message: 'Veuillez coller le code reçu après votre paiement Kkiapay ou Gumroad.',
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
        message: result.message || 'Votre accès a été débloqué avec succès ! Chargement en cours...',
      });
      setCode('');
      addToast('success', 'Accès débloqué !', 'Bienvenue sur BusinessAI PRO.');
    } else {
      setFeedback({
        type: 'error',
        message:
          result.error ||
          "Code non reconnu. Vérifiez l'email / SMS reçu après paiement ou contactez notre support WhatsApp au " +
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
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-10 space-y-8">
          {/* 1. Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-xs sm:text-sm tracking-wide uppercase">
              <Lock className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>🔒 ACCÈS BLOQUÉ - PAIEMENT REQUIS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight pt-1">
              Pour utiliser cette IA, payez ici 👇
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              BusinessAI est un outil professionnel à accès payant. Choisissez ci-dessous le mode de paiement adapté à votre pays.
            </p>
          </div>

          {/* 2. LES 2 BOUTONS DE PAIEMENT OFFICIELS */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BOUTON 1 : KKIAPAY (Moov Money / MTN - 10.000F) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border-2 border-emerald-500/60 shadow-xl flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs border border-emerald-500/30">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>BOUTON 1 • AFRIQUE DE L’OUEST</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    10.000F
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Payer par Moov Money / MTN (Kkiapay) - 10.000F
                  </h3>
                  <p className="text-xs font-bold text-emerald-300 mt-1 flex items-center gap-1">
                    <span>→</span> Pour tes clients du Bénin, Togo, Sénégal
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Accepte Moov Money, MTN Mobile Money, Celtiis, Wave et Orange Money sans carte bancaire.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold bg-emerald-900/50 text-emerald-200 px-2 py-0.5 rounded">
                    🇧🇯 Bénin
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-900/50 text-emerald-200 px-2 py-0.5 rounded">
                    🇹🇬 Togo
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-900/50 text-emerald-200 px-2 py-0.5 rounded">
                    🇸🇳 Sénégal
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-900/50 text-emerald-200 px-2 py-0.5 rounded">
                    🇨🇮 Côte d’Ivoire
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => openKkiapayPayment({ email: user.email, name: user.name })}
                  className="w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-slate-950" />
                  <span>Payer 10.000F par Mobile Money</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyLink(PAYMENT_CHANNELS.kkiapay.url, 'kkiapay')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedKkiapay ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKkiapay ? 'Lien Kkiapay copié !' : 'Copier le lien Kkiapay (10.000F)'}</span>
                </button>
              </div>
            </div>

            {/* BOUTON 2 : GUMROAD (Carte Visa - $20) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border-2 border-indigo-500/60 shadow-xl flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-black text-xs border border-indigo-500/30">
                    <Globe className="w-3.5 h-3.5" />
                    <span>BOUTON 2 • INTERNATIONAL & CARTE</span>
                  </div>
                  <span className="text-xs font-black text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                    $20
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Payer par carte Visa (Gumroad) - $20
                  </h3>
                  <p className="text-xs font-bold text-indigo-300 mt-1 flex items-center gap-1">
                    <span>→</span> Pour les clients en France, USA
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Paiement sécurisé par Carte bancaire Visa, Mastercard, Apple Pay et PayPal.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold bg-indigo-900/50 text-indigo-200 px-2 py-0.5 rounded">
                    🇫🇷 France
                  </span>
                  <span className="text-[10px] font-semibold bg-indigo-900/50 text-indigo-200 px-2 py-0.5 rounded">
                    🇺🇸 USA
                  </span>
                  <span className="text-[10px] font-semibold bg-indigo-900/50 text-indigo-200 px-2 py-0.5 rounded">
                    🇪🇺 Europe
                  </span>
                  <span className="text-[10px] font-semibold bg-indigo-900/50 text-indigo-200 px-2 py-0.5 rounded">
                    🌍 International
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={openGumroadPayment}
                  className="w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-white" />
                  <span>Payer $20 par Carte Visa (Gumroad)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyLink(PAYMENT_CHANNELS.gumroad.url, 'gumroad')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedGumroad ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedGumroad ? 'Lien Gumroad copié !' : 'Copier le lien Gumroad ($20)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Option Essai Gratuit 7j */}
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pas encore prêt ? Testez gratuitement d’abord</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Activez immédiatement votre essai de 7 jours sans carte bancaire ni engagement.
            </p>
            <button
              type="button"
              onClick={handleStartTrial}
              disabled={isStartingTrial}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 text-xs font-extrabold transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isStartingTrial ? "Activation de l'essai..." : "🎁 Démarrer mes 7 jours d'essai gratuit"}</span>
            </button>
          </div>

          {/* 3. LES 3 ÉTAPES POST-PAIEMENT */}
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
                  Vous recevez un CODE par email ou SMS
                </div>
                <p className="text-[11px] text-slate-400">
                  Après validation Kkiapay ou Gumroad, conservez votre reçu.
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
                  Entrez votre référence ou clé de licence ci-dessous.
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
                  Toutes les fonctionnalités IA sont déverrouillées instantanément.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Code Input Section */}
          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-800/90 border-2 border-indigo-400 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-300">
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>Collez votre CODE reçu par email ou SMS ici :</span>
            </div>

            <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex : Référence Kkiapay, clé Gumroad ou code VIP"
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
                Assistance directe pour vos paiements Moov Money, MTN, Kkiapay ou carte Visa Gumroad.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <a
                href={`https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(
                  "Bonjour ! J'ai besoin d'aide pour le paiement Kkiapay (Moov/MTN 10.000F) ou Gumroad (Visa $20) pour BusinessAI."
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
        <span>Paiements cryptés SSL via Kkiapay (Afrique) & Gumroad (International) • Lemon Squeezy déconnecté</span>
      </div>
    </div>
  );
};
