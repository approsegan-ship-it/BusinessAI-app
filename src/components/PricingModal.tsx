import React from 'react';
import { useApp } from '../context/AppContext';
import { PLANS_ARRAY, PricingPlan, PlanId } from '../config/plans';
import {
  Crown,
  Check,
  Zap,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PricingModal: React.FC = () => {
  const { isPricingModalOpen, setIsPricingModalOpen, user, upgradePlan, setCurrentTab } = useApp();

  if (!isPricingModalOpen) return null;

  const handleSelect = (planId: PlanId) => {
    upgradePlan(planId);
  };

  const handleOpenFullPage = () => {
    setIsPricingModalOpen(false);
    setCurrentTab('pricing');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden text-slate-900 my-6 max-h-[90vh] overflow-y-auto"
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
              <span>Forfaits & Tarifs BusinessAI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Passez à l’offre supérieure
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
              Débloquez instantanément de nouvelles générations IA et des outils de vente avancés pour votre entreprise.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch mb-6">
            {PLANS_ARRAY.map((plan: PricingPlan) => {
              const isCurrent = user.plan === plan.id;
              const isRecommended = Boolean(plan.isRecommended);

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
                        Recommandé
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
                      {plan.formattedPrice}
                      <span className="text-[11px] font-normal text-slate-500 ml-1">{plan.period}</span>
                    </div>

                    <div
                      className={`text-[11px] font-bold py-1 px-2 rounded-lg mb-3 flex items-center gap-1.5 ${
                        isRecommended
                          ? 'bg-indigo-600 text-white'
                          : plan.id === 'business'
                          ? 'bg-slate-900 text-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Zap className="w-3 h-3 shrink-0" />
                      <span>{plan.monthlyGenerations} gén. / mois</span>
                    </div>

                    <ul className="space-y-1.5 text-[11px] text-slate-700 mb-4">
                      {plan.features.slice(0, 4).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isRecommended ? 'text-indigo-600' : 'text-emerald-600'
                            }`}
                          />
                          <span className="leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSelect(plan.id)}
                    disabled={isCurrent}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-slate-100 text-slate-400 cursor-default'
                        : isRecommended
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        : plan.id === 'business'
                        ? 'bg-slate-900 hover:bg-slate-800 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isCurrent ? 'Forfait Actif' : `Choisir ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Paiement en FCFA • Sans engagement • Mode test</span>
            </div>

            <button
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
