import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PLANS_ARRAY,
  COMPARISON_MATRIX,
  PAYMENT_METHODS,
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
  HelpCircle,
  Smartphone,
  CreditCard,
  Layers,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion } from 'motion/react';

export const PricingView: React.FC = () => {
  const { user, upgradePlan, setCurrentTab, addToast } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'orange_money' | 'mtn' | 'moov' | 'card'>('wave');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileComparisonCategory, setMobileComparisonCategory] = useState<string>('all');
  const [simulatedPlanSuccess, setSimulatedPlanSuccess] = useState<string | null>(null);

  const currentPlanConfig = getPlanConfig(user.plan);

  const handleSelectPlan = (planId: PlanId) => {
    if (planId === user.plan) {
      addToast('info', 'Forfait déjà actif', `Vous utilisez actuellement le forfait ${planId.toUpperCase()}.`);
      return;
    }

    upgradePlan(planId);
    setSimulatedPlanSuccess(planId);
    setTimeout(() => setSimulatedPlanSuccess(null), 4000);
  };

  const categories = Array.from(new Set(COMPARISON_MATRIX.map((row) => row.category)));

  const filteredMatrix =
    mobileComparisonCategory === 'all'
      ? COMPARISON_MATRIX
      : COMPARISON_MATRIX.filter((row) => row.category === mobileComparisonCategory);

  const faqs = [
    {
      q: 'Comment fonctionne le décompte des générations IA ?',
      a: 'Chaque génération de publication, fiche produit, réponse client ou discussion avec l’assistant IA consomme 1 génération mensuelle. Les quotas sont automatiquement réinitialisés au début de chaque mois.',
    },
    {
      q: 'Pourquoi l’offre STARTER est-elle recommandée ?',
      a: 'L’offre STARTER à 1 500 FCFA/mois offre 100 générations, l’historique étendu et les outils marketing. C’est le meilleur rapport qualité/prix pour animer quotidiennement ses réseaux et convertir ses prospects.',
    },
    {
      q: 'Y a-t-il un engagement ou des frais cachés ?',
      a: 'Aucun engagement ! Vous pouvez changer de formule ou basculer sur le forfait gratuit à tout moment en 1 clic sans frais de résiliation.',
    },
    {
      q: 'Quels moyens de paiement seront supportés lors de la mise en production ?',
      a: 'BusinessAI intègrera directement Wave, Orange Money, MTN MoMo, Moov Money ainsi que les cartes Visa et Mastercard pour un paiement simple et sécurisé dans toute l’Afrique et à l’international.',
    },
    {
      q: 'Que se passe-t-il si j’atteins ma limite de générations ?',
      a: 'L’accès aux outils IA est temporairement bloqué dès que vous atteignez la limite mensuelle de votre forfait. Vous pouvez débloquer instantanément de nouvelles générations en passant au forfait supérieur.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5 text-indigo-600" />
          <span>Tarification BusinessAI en FCFA</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Des forfaits simples et accessibles pour booster vos ventes
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Choisissez l’offre adaptée à la taille de votre entreprise. Démarrez gratuitement et passez à la vitesse supérieure quand vous le souhaitez.
        </p>

        {/* Current Active Plan Alert */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs sm:text-sm text-slate-700">
          <span>Votre forfait actuel :</span>
          <span className="font-extrabold text-indigo-600 uppercase bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
            {currentPlanConfig.name}
          </span>
          <span className="text-slate-400">•</span>
          <span className="font-medium text-slate-500">
            {user.availableCredits} / {user.maxCredits} générations restantes ce mois-ci
          </span>
        </div>
      </div>

      {/* Success alert when plan changed */}
      {simulatedPlanSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-4 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs sm:text-sm">
              <strong className="font-bold">Forfait {simulatedPlanSuccess.toUpperCase()} activé !</strong>
              <div className="text-emerald-700">Vos nouvelles limites de générations sont prêtes à l’emploi. (Mode test)</div>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shrink-0"
          >
            Aller au tableau de bord
          </button>
        </motion.div>
      )}

      {/* 4 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {PLANS_ARRAY.map((plan: PricingPlan) => {
          const isCurrent = user.plan === plan.id;
          const isRecommended = Boolean(plan.isRecommended);

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
                  <span className="px-3.5 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Offre Recommandée PME
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

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      {plan.formattedPrice}
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
                      <span>{plan.id === 'free' ? 'Choisir Free' : `Passer à ${plan.name}`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <div className="text-[10px] text-center text-slate-400 mt-2">
                  Sans engagement • Changement immédiat
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Gateway Architecture Preview (No real payment yet) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Smartphone className="w-4 h-4" />
              <span>Modes de Paiement Prévus</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Paiement Local & Mobile Money Sécurisé
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Architecture prête pour intégrer Wave, Orange Money, MTN MoMo, Moov et cartes bancaires.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-amber-300 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Mode test actif (0 FCFA débité)</span>
          </div>
        </div>

        {/* Method selector tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedMethod === method.id
                  ? 'bg-slate-800 border-indigo-400 shadow-xs'
                  : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white">{method.name}</span>
                {method.badge && (
                  <span className="text-[9px] font-bold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded">
                    {method.badge}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {method.countries.slice(0, 2).join(', ')}...
              </div>
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2 pt-2">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            Le paiement réel sera activé lors de la prochaine phase. Vous pouvez tester toutes les offres librement dès aujourd'hui.
          </span>
        </div>
      </div>

      {/* Comparison Matrix - Optimized for Android Mobile & Desktop */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Tableau comparatif détaillé des 4 offres
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Visualisez précisément les différences entre FREE, STARTER, PRO et BUSINESS.
            </p>
          </div>

          {/* Category Filter for Mobile Android */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 shrink-0 hidden sm:inline">Filtrer :</span>
            <button
              onClick={() => setMobileComparisonCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                mobileComparisonCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tout afficher
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setMobileComparisonCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  mobileComparisonCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table Container (Horizontal scroll on mobile with sticky feature column) */}
        <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3.5 pr-4 font-bold text-slate-900 w-2/5">Fonctionnalité</th>
                <th className="py-3.5 px-3 font-bold text-slate-700 text-center w-[15%]">FREE</th>
                <th className="py-3.5 px-3 font-extrabold text-indigo-700 bg-indigo-50/80 rounded-t-xl text-center w-[15%] border-x border-indigo-100">
                  STARTER ★
                </th>
                <th className="py-3.5 px-3 font-bold text-purple-800 text-center w-[15%]">PRO</th>
                <th className="py-3.5 px-3 font-bold text-amber-900 text-center w-[15%]">BUSINESS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMatrix.map((row, index) => {
                const isNewCategory =
                  index === 0 || row.category !== filteredMatrix[index - 1].category;

                return (
                  <React.Fragment key={index}>
                    {isNewCategory && (
                      <tr className="bg-slate-50/80">
                        <td
                          colSpan={5}
                          className="py-2.5 px-3 font-bold text-[11px] uppercase tracking-wider text-slate-500"
                        >
                          {row.category}
                        </td>
                      </tr>
                    )}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 pr-4 font-medium text-slate-800">
                        {row.featureName}
                        {row.tooltip && (
                          <span className="block text-[11px] text-slate-400 font-normal mt-0.5">
                            {row.tooltip}
                          </span>
                        )}
                      </td>

                      {/* FREE column */}
                      <td className="py-3 px-3 text-center text-slate-600">
                        {typeof row.free === 'boolean' ? (
                          row.free ? (
                            <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                          ) : (
                            <span className="text-slate-300 text-base leading-none">—</span>
                          )
                        ) : (
                          <span className="font-semibold text-xs text-slate-700">{row.free}</span>
                        )}
                      </td>

                      {/* STARTER column (Highlighted) */}
                      <td className="py-3 px-3 text-center bg-indigo-50/30 border-x border-indigo-100 text-indigo-950 font-bold">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? (
                            <Check className="w-4 h-4 text-indigo-600 mx-auto" />
                          ) : (
                            <span className="text-slate-300 text-base leading-none">—</span>
                          )
                        ) : (
                          <span className="font-bold text-xs text-indigo-900">{row.starter}</span>
                        )}
                      </td>

                      {/* PRO column */}
                      <td className="py-3 px-3 text-center text-slate-700 font-medium">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <Check className="w-4 h-4 text-purple-600 mx-auto" />
                          ) : (
                            <span className="text-slate-300 text-base leading-none">—</span>
                          )
                        ) : (
                          <span className="font-semibold text-xs text-purple-950">{row.pro}</span>
                        )}
                      </td>

                      {/* BUSINESS column */}
                      <td className="py-3 px-3 text-center text-slate-700 font-medium">
                        {typeof row.business === 'boolean' ? (
                          row.business ? (
                            <Check className="w-4 h-4 text-amber-600 mx-auto" />
                          ) : (
                            <span className="text-slate-300 text-base leading-none">—</span>
                          )
                        ) : (
                          <span className="font-bold text-xs text-amber-900">{row.business}</span>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
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
            Tout ce que vous devez savoir sur notre tarification et la gestion de vos forfaits.
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
