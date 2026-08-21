import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Store,
  UtensilsCrossed,
  ShoppingBag,
  Briefcase,
  Wrench,
  Sparkle,
  Share2,
  Package,
  MessageCircleReply,
  TrendingUp,
  ShieldCheck,
  Zap,
  Crown,
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const { setCurrentTab, setIsPricingModalOpen } = useApp();

  const targetAudiences = [
    {
      title: 'Boutiques & Commerces',
      icon: Store,
      desc: 'Publications attirantes, fiches produits élégantes et messages promotionnels.',
      tag: 'Mode, Déco, Vente',
    },
    {
      title: 'Restaurants & Cafés',
      icon: UtensilsCrossed,
      desc: 'Menus du jour percutants, événements gourmands et réponses soignées aux avis.',
      tag: 'Gastronomie & Traiteurs',
    },
    {
      title: 'Vendeurs en Ligne',
      icon: ShoppingBag,
      desc: 'Descriptions de produits à fort taux de conversion et campagnes publicitaires percutantes.',
      tag: 'E-commerce & Dropshipping',
    },
    {
      title: 'Prestataires & B2B',
      icon: Briefcase,
      desc: 'Propositions commerciales claires, devis argumentés et messages de prospection.',
      tag: 'Consulting & Agences',
    },
    {
      title: 'Artisans & Indépendants',
      icon: Wrench,
      desc: 'Réponses rapides sur WhatsApp, calculs de marge précis et mise en valeur du savoir-faire.',
      tag: 'BTP, Créateurs, Services',
    },
  ];

  const features = [
    {
      tab: 'assistant',
      title: 'Assistant IA Intelligent',
      icon: Sparkles,
      desc: 'Rédigez des messages pros, préparez des offres, trouvez des idées marketing et reformulez vos textes instantanément.',
      iconColor: 'text-indigo-600',
    },
    {
      tab: 'social',
      title: 'Générateur de Publications',
      icon: Share2,
      desc: 'Créez en 1 clic vos posts Facebook, Instagram avec hashtags, messages WhatsApp et slogans percutants.',
      iconColor: 'text-blue-600',
    },
    {
      tab: 'products',
      title: 'Fiches Produits Persuasives',
      icon: Package,
      desc: 'Transformez de simples caractéristiques en descriptions captivantes qui incitent à l’achat immédiat.',
      iconColor: 'text-emerald-600',
    },
    {
      tab: 'clients',
      title: 'Réponses aux Clients',
      icon: MessageCircleReply,
      desc: 'Modèles intelligents pour prix, stock, délais, réclamations ou remerciements prêts à être envoyés sur WhatsApp.',
      iconColor: 'text-violet-600',
    },
    {
      tab: 'sales',
      title: 'Outils de Vente & Marges',
      icon: TrendingUp,
      desc: 'Calculez vos marges bénéficiaires, concevez des offres promotionnelles irrésistibles et stimulez votre CA.',
      iconColor: 'text-amber-600',
    },
    {
      tab: 'profile',
      title: 'Profil Entreprise Sur-Mesure',
      icon: ShieldCheck,
      desc: 'L’IA mémorise votre nom, vos coordonnées, vos horaires et votre ton pour des réponses 100% personnalisées.',
      iconColor: 'text-rose-600',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Sparkle className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
            L'IA conçue pour les PME & Entrepreneurs
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            BusinessAI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xl sm:text-2xl font-semibold text-indigo-600 mt-4 leading-snug"
          >
            Votre assistant intelligent pour développer votre entreprise.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed"
          >
            Gagnez un temps précieux, communiquez avec élégance avec vos clients et augmentez vos
            ventes au quotidien grâce à une suite d’outils marketing et commerciaux sur-mesure.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-xs flex items-center justify-center gap-2 group transition-all transform active:scale-95 cursor-pointer"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentTab('assistant')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-base shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Tester l'Assistant IA</span>
            </button>
          </motion.div>

          {/* Quick value propositions badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sans carte de crédit requise</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Personnalisé à votre activité</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Compatible WhatsApp & Réseaux Sociaux</span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Conçu pour tous les professionnels de terrain
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Que vous vendiez des produits physiques, des plats cuisinés ou des prestations de
            services, BusinessAI s'adapte à votre réalité.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {targetAudiences.map((audience, idx) => {
            const Icon = audience.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    {audience.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{audience.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{audience.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Features Overview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Tout ce dont vous avez besoin pour vendre plus
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Une boîte à outils complète sans jargon technique, directement prête à l’emploi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                onClick={() => setCurrentTab(feat.tab as any)}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs hover:border-slate-300 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                    <Icon className={`w-6 h-6 ${feat.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{feat.desc}</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 group">
                  <span>Ouvrir cet outil</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing / Monetization Teaser */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-left max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
                <Crown className="w-3.5 h-3.5 text-indigo-600" />
                Tarifs adaptés en FCFA
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                4 offres claires pour faire grandir votre entreprise
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                De l’offre <strong>FREE (0 FCFA)</strong> à l’offre <strong>STARTER (1 500 FCFA/mois — Recommandée)</strong>, <strong>PRO (3 500 FCFA)</strong> et <strong>BUSINESS (10 000 FCFA)</strong>, choisissez la formule idéale pour votre rythme de vente.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setCurrentTab('pricing')}
                className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-all text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Voir les 4 offres</span>
              </button>
              <button
                onClick={() => setCurrentTab('dashboard')}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <span>Accéder au Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
