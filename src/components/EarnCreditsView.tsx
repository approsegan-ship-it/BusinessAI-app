import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Gift,
  Share2,
  Building2,
  Compass,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Crown,
  HeartHandshake,
} from 'lucide-react';

export const EarnCreditsView: React.FC = () => {
  const {
    user,
    company,
    setCurrentTab,
    setIsPricingModalOpen,
    setIsViralPostModalOpen,
    badges,
    addBonusCredits,
  } = useApp();

  const isProfileComplete = Boolean(
    company.name && company.sector && (company.phone || company.whatsapp)
  );

  const earnMissions = [
    {
      id: 'invite',
      title: 'Inviter un entrepreneur',
      reward: '+15 crédits / ami',
      description: 'Partagez votre lien de parrainage avec un confrère commerçant ou artisan.',
      icon: Share2,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      actionLabel: 'Inviter des amis',
      completed: false,
      onClick: () => setCurrentTab('referrals'),
    },
    {
      id: 'profile',
      title: 'Compléter votre profil d’entreprise',
      reward: '+10 crédits',
      description: 'Renseignez le nom, téléphone WhatsApp, horaires et ton de communication.',
      icon: Building2,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      actionLabel: isProfileComplete ? 'Profil déjà complet' : 'Compléter mon profil',
      completed: isProfileComplete,
      onClick: () => setCurrentTab('profile'),
    },
    {
      id: 'viral_post',
      title: 'Créer une publication retour d’expérience',
      reward: '+10 crédits',
      description: 'Générez un témoignage authentique avec votre lien de parrainage.',
      icon: HeartHandshake,
      color: 'bg-pink-50 text-pink-700 border-pink-200',
      actionLabel: 'Générer le post',
      completed: false,
      onClick: () => setIsViralPostModalOpen(true),
    },
    {
      id: 'tools',
      title: 'Découvrir nos 7 outils PME',
      reward: '+5 crédits',
      description: 'Explorez le générateur de réseaux sociaux, les fiches produits et réponses clients.',
      icon: Compass,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      actionLabel: 'Explorer les outils',
      completed: false,
      onClick: () => setCurrentTab('social'),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header with Balance */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Centre de Crédits BusinessAI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gagner des Crédits Gratuits
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Complétez des actions utiles pour votre entreprise et invitez d'autres professionnels pour
            recharger votre solde sans rien payer.
          </p>
        </div>

        {/* Big Balance Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 shadow-sm min-w-[220px] text-center space-y-1">
          <div className="text-xs text-indigo-200 font-medium">Solde actuel</div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-300">
            {user.plan === 'premium' ? 'Illimité' : user.availableCredits}
          </div>
          <div className="text-[11px] text-slate-300">
            {user.plan === 'premium' ? 'Plan Premium Pro' : 'Crédits disponibles'}
          </div>
        </div>
      </div>

      {/* Grid of Missions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {earnMissions.map((mission) => {
          const Icon = mission.icon;
          return (
            <div
              key={mission.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4 hover:border-indigo-200 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center ${mission.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl">
                    {mission.reward}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{mission.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {mission.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {mission.completed ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Déjà complété
                  </span>
                ) : (
                  <button
                    onClick={mission.onClick}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>{mission.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Need Unlimited? Premium Callout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-indigo-50 border border-amber-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Crown className="w-4 h-4 text-amber-600" />
            <span>Besoin de volume intensif ?</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Débloquez le Plan Premium avec Crédits Illimités
          </h3>
          <p className="text-xs text-slate-600 max-w-lg">
            Générez des centaines de fiches produits, scripts publicitaires et réponses clients sans
            jamais surveiller votre compteur de crédits.
          </p>
        </div>

        <button
          onClick={() => setIsPricingModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs shrink-0 transition-transform active:scale-95 cursor-pointer"
        >
          Découvrir les offres Premium
        </button>
      </div>
    </div>
  );
};
