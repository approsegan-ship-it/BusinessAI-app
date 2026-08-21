import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Zap,
  Gift,
  Share2,
  Building2,
  Crown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const EarnCreditsModal: React.FC = () => {
  const {
    isEarnCreditsModalOpen,
    setIsEarnCreditsModalOpen,
    setCurrentTab,
    setIsPricingModalOpen,
    user,
  } = useApp();

  if (!isEarnCreditsModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={() => setIsEarnCreditsModalOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Crédits BusinessAI</h3>
              <p className="text-[11px] text-slate-500">
                Solde actuel :{' '}
                <strong className="text-slate-900 font-bold">
                  {user.plan === 'premium' ? 'Illimité' : `${user.availableCredits} crédits`}
                </strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEarnCreditsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Pour continuer à utiliser l'IA gratuitement, vous pouvez facilement obtenir des crédits
            supplémentaires :
          </p>

          <div className="space-y-2.5">
            {/* Action 1 */}
            <button
              onClick={() => {
                setIsEarnCreditsModalOpen(false);
                setCurrentTab('referrals');
              }}
              className="w-full p-3.5 rounded-2xl bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-100 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Inviter un entrepreneur</div>
                  <div className="text-[10px] text-slate-500">
                    Gagnez +15 crédits dès son inscription
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                +15 crédits
              </span>
            </button>

            {/* Action 2 */}
            <button
              onClick={() => {
                setIsEarnCreditsModalOpen(false);
                setCurrentTab('profile');
              }}
              className="w-full p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Compléter le profil d'entreprise</div>
                  <div className="text-[10px] text-slate-500">
                    Renseignez vos coordonnées & secteur
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                +10 crédits
              </span>
            </button>

            {/* Action 3: Upgrade to Pro */}
            <button
              onClick={() => {
                setIsEarnCreditsModalOpen(false);
                setIsPricingModalOpen(true);
              }}
              className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-between gap-3 text-left shadow-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Passer au Plan Premium</div>
                  <div className="text-[10px] text-slate-300">
                    Accès illimité sans quota de crédits
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={() => setIsEarnCreditsModalOpen(false)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
