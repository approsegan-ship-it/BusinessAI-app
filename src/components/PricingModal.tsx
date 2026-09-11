import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PLANS_ARRAY, PricingPlan, PlanId, PAYMENT_METHODS } from '../config/plans';
import {
  Crown,
  Check,
  Zap,
  X,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  Lock,
  Phone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPriceWithCurrency } from '../config/currency';
import { OFFICIAL_PAYMENT_NUMBER } from './PaymentInstructionModal';

export const PricingModal: React.FC = () => {
  const {
    isPricingModalOpen,
    setIsPricingModalOpen,
    user,
    upgradePlan,
    setCurrentTab,
    displayCurrency,
    openPaymentModal,
    startLemonSqueezyCheckout,
    submitActivationCode,
    addToast,
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'orange_money' | 'mtn' | 'moov' | 'card'>('wave');
  const [modalCode, setModalCode] = useState('');
  const [isActivatingCode, setIsActivatingCode] = useState(false);

  const handleActivateWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalCode.trim()) return;
    setIsActivatingCode(true);
    const res = await submitActivationCode(modalCode.trim());
    setIsActivatingCode(false);
    if (res.success) {
      setIsPricingModalOpen(false);
    }
  };

  if (!isPricingModalOpen) return null;

  const handleSelect = (planId: PlanId) => {
    if (planId === user.plan && user.plan !== 'free') {
      addToast('info', 'Forfait déjà actif', `Vous utilisez déjà le forfait ${planId.toUpperCase()}.`);
      return;
    }

    if (planId === 'free') {
      upgradePlan('free');
      setIsPricingModalOpen(false);
      return;
    }

    if (planId === 'starter' || planId === 'pro' || planId === 'business') {
      setIsPricingModalOpen(false);
      startLemonSqueezyCheckout(planId);
      return;
    }

    setIsPricingModalOpen(false);
    openPaymentModal(planId);
  };

  const handleOpenFullPage = () => {
    setIsPricingModalOpen(false);
    setCurrentTab('pricing');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden text-slate-900 my-6 max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setIsPricingModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer z-10"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Crown className="w-3.5 h-3.5 text-indigo-600" />
              <span>Accès Payant IA BusinessAI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Paiement & Activation de votre IA
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Pour utiliser l'IA générative (Assistant, Fiches Produits, WhatsApp & Réseaux Sociaux), envoyez votre paiement au <strong className="text-indigo-600 font-black">{OFFICIAL_PAYMENT_NUMBER}</strong> ou sélectionnez un forfait ci-dessous.
            </p>

            {/* Quick Payment Method Selector */}
            <div className="mt-4 inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold flex-wrap justify-center">
              <span className="text-slate-500 px-2 text-[11px]">Paiement disponible :</span>
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setSelectedMethod(pm.id as any)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] font-bold ${
                    selectedMethod === pm.id
                      ? 'bg-white text-indigo-600 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {pm.name}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch mb-6">
            {PLANS_ARRAY.map((plan: PricingPlan) => {
              const isCurrent = user.isPurchased ? user.plan === plan.id : plan.id === 'free';
              const isRecommended = Boolean(plan.isRecommended);
              const isFree = plan.id === 'free';
              const formattedPrice = formatPriceWithCurrency(plan.price, displayCurrency);

              return (
                <div
                  key={plan.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between relative transition-all ${
                    isRecommended
                      ? 'bg-indigo-50/40 border-2 border-indigo-600 shadow-md ring-1 ring-indigo-600/20'
                      : isCurrent
                      ? 'bg-slate-50 border-2 border-slate-900'
                      : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                        Recommandé PME
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Plan Top */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                        {plan.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                          Actuel
                        </span>
                      )}
                    </div>

                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
                      {formattedPrice}
                      <span className="text-[11px] font-normal text-slate-500 ml-1">{plan.period}</span>
                    </div>

                    <div
                      className={`text-[11px] font-bold py-1 px-2 rounded-lg mb-3 flex items-center gap-1.5 ${
                        isFree
                          ? 'bg-slate-100 text-slate-600'
                          : isRecommended
                          ? 'bg-indigo-600 text-white'
                          : plan.id === 'business'
                          ? 'bg-slate-900 text-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isFree ? <Lock className="w-3 h-3 text-slate-500" /> : <Zap className="w-3 h-3 shrink-0" />}
                      <span>{isFree ? '0 gén. (IA verrouillée)' : `${plan.monthlyGenerations} gén. / mois`}</span>
                    </div>

                    <ul className="space-y-1.5 text-[11px] text-slate-700 mb-4">
                      {plan.features.slice(0, 4).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isRecommended ? 'text-indigo-600' : isFree ? 'text-slate-400' : 'text-emerald-600'
                            }`}
                          />
                          <span className="leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelect(plan.id)}
                    disabled={isCurrent}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-slate-100 text-slate-400 cursor-default'
                        : isRecommended
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        : isFree
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isCurrent
                      ? 'Forfait Actif'
                      : isFree
                      ? 'Aperçu gratuit (Sans IA)'
                      : plan.id === 'starter'
                      ? 'Payer 9 900 FCFA'
                      : plan.id === 'pro'
                      ? 'Payer 19 900 FCFA'
                      : plan.id === 'business'
                      ? 'Payer 49 000 FCFA'
                      : `Payer & Activer ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Activation Code or WhatsApp Order */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-xs font-black text-slate-900 flex items-center justify-center md:justify-start gap-1.5">
                <span className="text-amber-600">🔑</span>
                <span>Vous avez acheté votre forfait par WhatsApp ?</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Entrez votre code d'activation confidentiel pour débloquer l'accès sans attendre.
              </p>
            </div>

            <form onSubmit={handleActivateWithCode} className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                value={modalCode}
                onChange={(e) => setModalCode(e.target.value.toUpperCase())}
                placeholder="Ex : BAI-PRO-229"
                className="px-3 py-2 rounded-xl border border-indigo-300 bg-white text-xs font-mono font-bold uppercase w-full md:w-44 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="submit"
                disabled={isActivatingCode || !modalCode.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isActivatingCode ? '...' : 'Valider'}
              </button>
            </form>

            <a
              href="https://businessai-app.lemonsqueezy.com/checkout/buy/301e87b4-22a6-4c76-b65a-0d8f2c73068a"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer w-full md:w-auto text-center"
            >
              <span>Payer en ligne (Lemon Squeezy)</span>
            </a>

            <a
              href={`https://wa.me/2290163638893?text=${encodeURIComponent(
                "Bonjour ! Je souhaite acheter BusinessAI et obtenir mon code secret d'activation."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer w-full md:w-auto text-center"
            >
              <span>Acheter sur WhatsApp (+229)</span>
            </a>
          </div>

          {/* Footer actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Paiement direct Wave, Orange Money, MTN, Moov au <strong>{OFFICIAL_PAYMENT_NUMBER}</strong> • Déblocage immédiat
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenFullPage}
              className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              <span>Voir le comparatif complet & FAQ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
