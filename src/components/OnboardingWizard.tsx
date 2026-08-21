import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BusinessSector, AppTab } from '../types';
import {
  Sparkles,
  ArrowRight,
  Megaphone,
  MessageCircleReply,
  Share2,
  Package,
  TrendingUp,
  X,
  CheckCircle2,
} from 'lucide-react';

const SECTORS: BusinessSector[] = [
  'Boutique & Prêt-à-porter',
  'Restaurant & Alimentation',
  'E-commerce & Vente en ligne',
  'Artisanat & Fait-main',
  'Prestation de Services & B2B',
  'Beauté, Coiffure & Bien-être',
  'Immobilier & Travaux',
  'Autre Entreprise',
];

export const OnboardingWizard: React.FC = () => {
  const { isOnboardingOpen, completeOnboarding, company, setIsOnboardingOpen, setActivePresetPrompt } =
    useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [businessName, setBusinessName] = useState(company.name || '');
  const [sector, setSector] = useState<BusinessSector>(
    company.sector || 'Boutique & Prêt-à-porter'
  );
  const [mainGoal, setMainGoal] = useState('Augmenter mes ventes et attirer des clients');

  if (!isOnboardingOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleActionChoice = (actionKey: string, targetTab: AppTab, promptPreset?: string) => {
    if (promptPreset) {
      setActivePresetPrompt(promptPreset);
    }
    completeOnboarding({
      businessName,
      sector,
      mainGoal,
      targetTab,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Sparkles className="w-4 h-4 text-indigo-200" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Bienvenue sur BusinessAI</h3>
              <p className="text-[11px] text-slate-500">Configuration express en 30 secondes</p>
            </div>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Business profile setup */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="p-6 space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Parlez-nous de votre entreprise
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                L'IA adaptera immédiatement son vocabulaire et son style à votre activité.
              </p>
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom de votre entreprise <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Maison Gourmande, Studio Beauté, Auto-Clean..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
                required
              />
            </div>

            {/* Sector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Secteur d'activité
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as BusinessSector)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
              >
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Objectif principal
              </label>
              <select
                value={mainGoal}
                onChange={(e) => setMainGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
              >
                <option value="Augmenter mes ventes et attirer des clients">
                  Augmenter mes ventes et attirer des clients
                </option>
                <option value="Gagner du temps sur les réseaux et messages">
                  Gagner du temps sur les réseaux et messages
                </option>
                <option value="Professionnaliser mes réponses clients WhatsApp">
                  Professionnaliser mes réponses clients WhatsApp
                </option>
                <option value="Optimiser mes tarifs, marges et devis">
                  Optimiser mes tarifs, marges et devis
                </option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!businessName.trim()}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <span>Continuer vers mon premier résultat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Instant Action Choice */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Que voulez-vous faire aujourd'hui ?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cliquez pour obtenir votre premier résultat en moins d'une minute pour{' '}
                <strong className="text-slate-800 font-semibold">{businessName}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Créer une publicité */}
              <button
                onClick={() =>
                  handleActionChoice(
                    'ad',
                    'social',
                    `Rédige un texte publicitaire accrocheur pour ${businessName} (${sector}) afin d'attirer de nouveaux clients ce mois-ci.`
                  )
                }
                className="p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 text-left transition-all hover:scale-[1.01] cursor-pointer flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-950">Créer une publicité</div>
                  <div className="text-[10px] text-amber-800">Post sponsorisé ou accroche</div>
                </div>
              </button>

              {/* Option 2: Répondre à un client */}
              <button
                onClick={() => handleActionChoice('client', 'clients')}
                className="p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 text-left transition-all hover:scale-[1.01] cursor-pointer flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircleReply className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950">Répondre à un client</div>
                  <div className="text-[10px] text-emerald-800">
                    Prix, devis, livraison WhatsApp
                  </div>
                </div>
              </button>

              {/* Option 3: Créer une publication */}
              <button
                onClick={() => handleActionChoice('post', 'social')}
                className="p-3.5 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200 text-left transition-all hover:scale-[1.01] cursor-pointer flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-950">Créer une publication</div>
                  <div className="text-[10px] text-indigo-800">
                    Instagram, Facebook & WhatsApp
                  </div>
                </div>
              </button>

              {/* Option 4: Créer une fiche produit */}
              <button
                onClick={() => handleActionChoice('product', 'products')}
                className="p-3.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100/80 border border-sky-200 text-left transition-all hover:scale-[1.01] cursor-pointer flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-sky-950">Créer une fiche produit</div>
                  <div className="text-[10px] text-sky-800">Titre vendeur & description SEO</div>
                </div>
              </button>

              {/* Option 5: Obtenir des idées pour vendre */}
              <button
                onClick={() =>
                  handleActionChoice(
                    'ideas',
                    'assistant',
                    `Donne-moi 5 idées d'actions concrètes et rapides pour booster le chiffre d'affaires de mon entreprise "${businessName}" (${sector}) dès cette semaine.`
                  )
                }
                className="p-3.5 rounded-2xl bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200 text-left transition-all hover:scale-[1.01] cursor-pointer flex items-start gap-3 sm:col-span-2"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-950">
                    Obtenir des idées pour vendre
                  </div>
                  <div className="text-[10px] text-rose-800">
                    5 stratégies concrètes générées sur mesure pour votre PME
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
