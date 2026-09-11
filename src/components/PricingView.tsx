import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PLANS_ARRAY,
  PRICING_PLANS,
  COMPARISON_MATRIX,
  PricingPlan,
  PlanId,
  getPlanConfig,
} from '../config/plans';
import {
  Crown,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  Phone,
  Copy,
  ChevronDown,
  ChevronUp,
  Coins,
  KeyRound,
  Send,
  MessageSquare,
  CreditCard,
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatPriceWithCurrency, SUPPORTED_CURRENCIES, CurrencyCode } from '../config/currency';
import { OFFICIAL_PAYMENT_NUMBER, OFFICIAL_PAYMENT_DISPLAY } from './PaymentInstructionModal';

export const PricingView: React.FC = () => {
  const {
    user,
    displayCurrency,
    setDisplayCurrency,
    openPaymentModal,
    startLemonSqueezyCheckout,
    submitActivationCode,
    addToast,
    t,
  } = useApp();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [activationCodeInput, setActivationCodeInput] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  const currentPlanConfig = getPlanConfig(user.plan);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(OFFICIAL_PAYMENT_NUMBER);
    setCopied(true);
    addToast('success', 'Numéro copié !', `Numéro ${OFFICIAL_PAYMENT_NUMBER} copié dans le presse-papier.`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleActivateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCodeInput.trim()) return;
    setIsActivating(true);
    await submitActivationCode(activationCodeInput.trim());
    setIsActivating(false);
    setActivationCodeInput('');
  };

  const handleSelectPlan = (planId: PlanId) => {
    if (planId === 'free') {
      addToast('info', 'Forfait gratuit', 'Le forfait gratuit sans IA est déjà actif.');
      return;
    }
    if (planId === 'starter' || planId === 'pro' || planId === 'business') {
      startLemonSqueezyCheckout(planId);
      return;
    }
    openPaymentModal(planId);
  };

  const faqs = [
    {
      q: 'Comment payer et envoyer l’argent pour activer l’IA ?',
      a: `Vous pouvez envoyer votre paiement par Wave, Orange Money, MTN MoMo ou Moov Money au numéro officiel ${OFFICIAL_PAYMENT_NUMBER} (+229 01 63 63 88 93). Votre compte est débloqué immédiatement après confirmation ou saisie de votre code d'activation.`,
    },
    {
      q: 'Est-il possible de payer dans d’autres devises (EUR, USD, GHS, NGN, CAD) ?',
      a: 'Oui ! Vous pouvez basculer l’affichage de la devise en haut de page ou dans le sélecteur pour voir la conversion exacte en Euros, Dollars, Cedis, Nairas ou Dollars canadiens.',
    },
    {
      q: 'Comment fonctionne le décompte des générations IA ?',
      a: 'Chaque génération de publication, fiche produit, réponse client ou discussion avec l’assistant IA consomme 1 génération mensuelle. Les quotas sont automatiquement réinitialisés au début de chaque mois.',
    },
    {
      q: 'Pourquoi l’offre STARTER est-elle recommandée ?',
      a: `L’offre STARTER à ${formatPriceWithCurrency(PRICING_PLANS.starter.price, displayCurrency)}/mois offre ${PRICING_PLANS.starter.monthlyGenerations} générations, l’historique étendu et tous les générateurs marketing. C’est le meilleur rapport qualité/prix pour animer quotidiennement ses réseaux et convertir ses prospects.`,
    },
    {
      q: 'Y a-t-il un engagement ou des frais cachés ?',
      a: 'Aucun engagement ! Vous pouvez changer de formule ou renouveler à tout moment en 1 clic sans frais cachés.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5 text-indigo-600" />
          <span>Tarification & Forfaits BusinessAI</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Des forfaits simples et accessibles pour booster vos ventes
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Choisissez l’offre adaptée à votre activité. Débloquez l’IA en effectuant un transfert direct vers le numéro officiel.
        </p>

        {/* Currency Switcher Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-indigo-600" />
            Afficher les prix en :
          </span>
          <div className="inline-flex flex-wrap p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs gap-1">
            {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((cCode) => {
              const cur = SUPPORTED_CURRENCIES[cCode];
              const isSelected = displayCurrency === cCode;
              return (
                <button
                  key={cCode}
                  type="button"
                  onClick={() => setDisplayCurrency(cCode)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="mr-1">{cur.flag}</span>
                  <span>{cCode}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Active Plan Alert */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs sm:text-sm text-slate-700">
          <span>Votre forfait actuel :</span>
          <span className="font-extrabold text-indigo-600 uppercase bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
            {currentPlanConfig.name}
          </span>
          <span className="text-slate-400">•</span>
          <span className="font-medium text-slate-500">
            {user.availableCredits} / {user.maxCredits} générations restantes
          </span>
        </div>
      </div>

      {/* Official Payment Number Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.8 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Paiement Direct Wave & Mobile Money</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Envoi d'argent sur le numéro officiel : <span className="text-amber-300">{OFFICIAL_PAYMENT_NUMBER}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Envoyez le montant de votre forfait par Wave, Orange Money, MTN ou Moov au <strong>{OFFICIAL_PAYMENT_DISPLAY}</strong> pour activer l'IA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopyNumber}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-300" />}
            <span>{copied ? 'Copié !' : 'Copier le 0163638893'}</span>
          </button>

          <button
            type="button"
            onClick={() => openPaymentModal('starter')}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Payer & Débloquer l'IA</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Secret Code Unlock Form */}
      <div className="p-6 rounded-3xl bg-indigo-50/80 border-2 border-indigo-200/80 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs">
        <div className="space-y-1 text-center md:text-left max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider">
            <KeyRound className="w-3.5 h-3.5 text-amber-300" />
            <span>Déblocage par Code Secret WhatsApp</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            Vous avez acheté votre forfait au +229 01 63 63 88 93 ?
          </h3>
          <p className="text-xs text-slate-600">
            Saisissez le code d'activation fourni par l'administrateur pour débloquer immédiatement votre forfait.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <form onSubmit={handleActivateCode} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={activationCodeInput}
              onChange={(e) => setActivationCodeInput(e.target.value.toUpperCase())}
              placeholder="Ex : BAI-PRO-229"
              className="px-4 py-2.5 rounded-xl border border-indigo-300 bg-white font-mono font-bold text-xs uppercase w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="submit"
              disabled={isActivating || !activationCodeInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isActivating ? <Send className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{isActivating ? 'Validation...' : 'Débloquer'}</span>
            </button>
          </form>

          <a
            href="https://businessai-app.lemonsqueezy.com/checkout/buy/301e87b4-22a6-4c76-b65a-0d8f2c73068a"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer w-full sm:w-auto justify-center text-center"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payer sur Lemon Squeezy</span>
          </a>

          <a
            href={`https://wa.me/2290163638893?text=${encodeURIComponent(
              "Bonjour ! Je souhaite commander BusinessAI et obtenir mon code d'activation secret."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer w-full sm:w-auto justify-center text-center"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp (+229)</span>
          </a>
        </div>
      </div>

      {/* 4 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {PLANS_ARRAY.map((plan: PricingPlan) => {
          const isCurrent = user.plan === plan.id;
          const isRecommended = Boolean(plan.isRecommended);
          const convertedPrice = formatPriceWithCurrency(plan.price, displayCurrency);

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                isRecommended
                  ? 'bg-gradient-to-b from-indigo-50/70 via-white to-white border-2 border-indigo-600 shadow-xl shadow-indigo-100/50 scale-[1.02] z-10'
                  : isCurrent
                  ? 'bg-white border-2 border-slate-900 shadow-md'
                  : 'bg-white border border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Badge for Recommended */}
              {isRecommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3.5 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Offre Recommandée
                  </span>
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.8 rounded-md ${
                      isRecommended
                        ? 'bg-indigo-100 text-indigo-800'
                        : plan.id === 'business'
                        ? 'bg-amber-100 text-amber-900 font-bold'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {plan.name}
                  </span>

                  {isCurrent && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Actif
                    </span>
                  )}
                </div>

                {/* Price converted */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      {convertedPrice}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{plan.period}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{plan.tagline}</p>
                </div>

                {/* Quota Highlight Box */}
                <div
                  className={`p-3 rounded-2xl mb-6 text-xs font-semibold flex items-center gap-2.5 ${
                    isRecommended
                      ? 'bg-indigo-600 text-white'
                      : plan.id === 'business'
                      ? 'bg-slate-900 text-amber-300'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>{plan.monthlyGenerations} générations</strong> / mois
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Ce qui est inclus :
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-snug">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isRecommended
                              ? 'text-indigo-600'
                              : plan.id === 'business'
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        />
                        <span className="font-medium text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98 ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default'
                      : isRecommended
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-md'
                      : plan.id === 'business'
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Votre Forfait Actuel</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {plan.id === 'free'
                          ? 'Forfait Gratuit'
                          : plan.id === 'starter'
                          ? 'Payer 9 900 FCFA'
                          : plan.id === 'pro'
                          ? 'Payer 19 900 FCFA'
                          : plan.id === 'business'
                          ? 'Payer 49 000 FCFA'
                          : `Payer & Débloquer ${plan.name}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Matrix Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Tableau Comparatif Détaillé
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Comparez en un coup d'œil toutes les fonctionnalités incluses dans chaque formule.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3.5 pr-4 font-bold text-slate-700 w-2/5">Fonctionnalité</th>
                <th className="py-3.5 px-3 text-center font-bold text-slate-600">Gratuit</th>
                <th className="py-3.5 px-3 text-center font-bold text-indigo-700 bg-indigo-50/50 rounded-t-xl">
                  Starter ({formatPriceWithCurrency(4900, displayCurrency)})
                </th>
                <th className="py-3.5 px-3 text-center font-bold text-purple-700">
                  Pro ({formatPriceWithCurrency(9900, displayCurrency)})
                </th>
                <th className="py-3.5 px-3 text-center font-bold text-amber-800">
                  Business ({formatPriceWithCurrency(24900, displayCurrency)})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPARISON_MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pr-4 font-medium text-slate-800">
                    {row.featureName}
                    {row.tooltip && (
                      <span className="block text-[11px] text-slate-400 font-normal mt-0.5">
                        {row.tooltip}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-600">
                    {typeof row.free === 'boolean' ? (
                      row.free ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">—</span>
                    ) : (
                      <span className="font-semibold text-xs text-slate-700">{row.free}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center bg-indigo-50/30 font-bold text-indigo-950">
                    {typeof row.starter === 'boolean' ? (
                      row.starter ? <Check className="w-4 h-4 text-indigo-600 mx-auto" /> : <span className="text-slate-300">—</span>
                    ) : (
                      <span className="font-bold text-xs text-indigo-900">{row.starter}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-700">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? <Check className="w-4 h-4 text-purple-600 mx-auto" /> : <span className="text-slate-300">—</span>
                    ) : (
                      <span className="font-semibold text-xs text-purple-950">{row.pro}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-700">
                    {typeof row.business === 'boolean' ? (
                      row.business ? <Check className="w-4 h-4 text-amber-600 mx-auto" /> : <span className="text-slate-300">—</span>
                    ) : (
                      <span className="font-bold text-xs text-amber-900">{row.business}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Questions Fréquemment Posées
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Paiements au 0163638893, devises internationales et activation immédiate.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
