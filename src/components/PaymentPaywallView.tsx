import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  ShieldCheck,
  Zap,
  Crown,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  CreditCard,
  Smartphone,
  ExternalLink,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { PRICING_PLANS, PlanId } from '../config/plans';

export const PaymentPaywallView: React.FC = () => {
  const {
    user,
    serverSubscription,
    isCheckingServerSubscription,
    isCheckoutLoading,
    startLemonSqueezyCheckout,
    refreshSubscriptionStatus,
    openPaymentModal,
    addToast,
  } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'business'>('pro');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshSubscriptionStatus();
    setIsRefreshing(false);
    addToast('info', 'Statut actualisé', 'Vérification effectuée auprès du serveur BusinessAI.');
  };

  const handlePay = (plan: 'starter' | 'pro' | 'business') => {
    startLemonSqueezyCheckout(plan);
  };

  return (
    <div id="payment-paywall-view" className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Top Warning & Security Status */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold tracking-wide">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>STATUT ACTUEL : NON PAYÉ • ACCÈS IA VERROUILLÉ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Paiement obligatoire avant toute utilisation de l'IA
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              BusinessAI est une application payante. L'accès aux fonctionnalités d'intelligence artificielle
              (Assistant commercial, Générateur de posts, Fiches produits, Automatisation WhatsApp & Clôture de ventes)
              est débloqué <strong className="text-white">uniquement après confirmation sécurisée du paiement par le serveur</strong>.
            </p>
          </div>

          {/* Verification Box */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 w-full md:w-72 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold">Contrôle Serveur :</span>
              <span className="inline-flex items-center gap-1 font-bold text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Inactif
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              Identifiant client unique lié à votre session. Vérification cryptographique via webhook Lemon Squeezy.
            </p>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isCheckingServerSubscription}
              className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Vérification...' : 'Vérifier mon paiement'}</span>
            </button>
          </div>
        </div>

        {/* Primary Action Button Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Paiement 100% sécurisé via Lemon Squeezy (Cartes bancaires Visa/Mastercard & Mobile Money)</span>
          </div>

          <button
            id="btn-primary-pay"
            onClick={() => handlePay(selectedPlan)}
            disabled={isCheckoutLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>
              {isCheckoutLoading ? 'Redirection sécurisée...' : 'Payer pour accéder à BusinessAI'}
            </span>
          </button>
        </div>
      </div>

      {/* 3 Tier Pricing Cards Section */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Choisissez votre forfait pour activer l'IA
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Chaque forfait dispose de son propre produit Lemon Squeezy sécurisé côté serveur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* 1. STARTER - 9 900 FCFA */}
          <div
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative bg-white ${
              selectedPlan === 'starter'
                ? 'border-2 border-indigo-600 shadow-lg ring-2 ring-indigo-600/20'
                : 'border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  STARTER
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  PME & Débutants
                </span>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-black text-slate-900">
                  9 900 <span className="text-sm font-semibold text-slate-500">FCFA/mois</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  150 générations IA chaque mois pour vos réseaux et produits.
                </p>
              </div>

              <div className="py-2 px-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900 font-bold text-xs mb-5 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>150 générations IA / mois</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Générateur de posts réseaux sociaux</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Fiches produits et argumentaires de vente</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Partage WhatsApp direct</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Support standard sous 24h</span>
                </li>
              </ul>
            </div>

            <button
              id="btn-pay-starter"
              onClick={() => {
                setSelectedPlan('starter');
                handlePay('starter');
              }}
              disabled={isCheckoutLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              Payer 9 900 FCFA
            </button>
          </div>

          {/* 2. PRO - 19 900 FCFA (Recommandé) */}
          <div
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between relative bg-indigo-50/40 ${
              selectedPlan === 'pro'
                ? 'border-indigo-600 shadow-xl ring-2 ring-indigo-600/30'
                : 'border-indigo-400/80 shadow-md'
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Le Plus Populaire
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-900">
                  PRO
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  Croissance Rapide
                </span>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-black text-slate-900">
                  19 900 <span className="text-sm font-semibold text-slate-500">FCFA/mois</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  750 générations IA + Modèle Gemini 3.7 Flash ultra-rapide.
                </p>
              </div>

              <div className="py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs mb-5 flex items-center gap-2 shadow-xs">
                <Crown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>750 générations IA / mois</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 mb-6 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Toutes les fonctionnalités STARTER</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Modèle Gemini 3.7 Flash prioritaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Simulateur de remises & marges avancé</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Gestion des objections clients WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Support prioritaire sous 12h</span>
                </li>
              </ul>
            </div>

            <button
              id="btn-pay-pro"
              onClick={() => {
                setSelectedPlan('pro');
                handlePay('pro');
              }}
              disabled={isCheckoutLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              Payer 19 900 FCFA
            </button>
          </div>

          {/* 3. BUSINESS - 49 000 FCFA */}
          <div
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative bg-white ${
              selectedPlan === 'business'
                ? 'border-2 border-indigo-600 shadow-lg ring-2 ring-indigo-600/20'
                : 'border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  BUSINESS
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Multi-Comptes & Volume
                </span>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-black text-slate-900">
                  49 000 <span className="text-sm font-semibold text-slate-500">FCFA/mois</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  3 000 générations IA + 5 comptes pour votre équipe.
                </p>
              </div>

              <div className="py-2 px-3 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs mb-5 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>3 000 générations IA / mois</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Toutes les fonctionnalités PRO incluses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Jusqu'à 5 comptes collaborateurs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Tous les agents IA spécialisés & Voix</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Support VIP dédié direct WhatsApp</span>
                </li>
              </ul>
            </div>

            <button
              id="btn-pay-business"
              onClick={() => {
                setSelectedPlan('business');
                handlePay('business');
              }}
              disabled={isCheckoutLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              Payer 49 000 FCFA
            </button>
          </div>
        </div>
      </div>

      {/* Security & Anti-Bypass Notice */}
      <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Politique de Sécurité et Activation des Droits IA</span>
        </div>
        <p className="leading-relaxed text-slate-600">
          Conformément aux règles de sécurité de BusinessAI, aucun contournement local (modification du navigateur,
          localStorage, simple clic ou capture d'écran) ne peut débloquer l'accès. La validation est opérée par un
          webhook Lemon Squeezy signé cryptographiquement (HMAC-SHA256) avec contrôle strict du Variant ID correspondant au forfait.
          En cas d'expiration, remboursement ou échec, l'accès est révoqué automatiquement par le serveur.
        </p>
      </div>
    </div>
  );
};
