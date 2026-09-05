import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquareText,
  Share2,
  Video,
  Package,
  MessageCircleReply,
  TrendingUp,
  History,
  Building2,
  Zap,
  Crown,
  ArrowRight,
  Copy,
  Plus,
  Sparkles,
  Check,
  Gift,
  Users,
  Award,
  Flame,
  Rocket,
  CheckCircle2,
  Smartphone,
  Receipt,
  PhoneCall,
  ShieldCheck,
  Lock,
  FileText,
  Code2,
} from 'lucide-react';
import { AppTab } from '../types';

export const Dashboard: React.FC = () => {
  const {
    company,
    products,
    history,
    user,
    referralState,
    badges,
    setCurrentTab,
    setIsPricingModalOpen,
    openPaymentModal,
    openReceiptModal,
    openCodeHubModal,
    formatMoney,
    setIsViralPostModalOpen,
    openWhatsAppTutorialModal,
    setActivePresetPrompt,
    addToast,
    t,
  } = useApp();

  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('success', 'Texte copié !', 'Le contenu est dans votre presse-papiers.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTriggerPreset = (prompt: string, targetTab: AppTab = 'assistant') => {
    setActivePresetPrompt(prompt);
    setCurrentTab(targetTab);
  };

  // Profile completion calculation
  const profileFields = [
    company?.name,
    company?.sector,
    company?.description,
    company?.phone,
    company?.whatsapp,
    company?.address,
    company?.hours,
  ];
  const filledFieldsCount = profileFields.filter(Boolean).length;
  const profileCompletionPercent = Math.round((filledFieldsCount / (profileFields.length || 1)) * 100);

  const safeBadges = badges || [];
  const safeProducts = products || [];
  const safeHistory = history || [];

  const unlockedBadgesCount = safeBadges.filter((b) => b.unlocked).length;

  // Retention suggestions logic based on real user state
  const retentionActions = [];
  if (profileCompletionPercent < 100) {
    retentionActions.push({
      title: "Complétez le profil de votre entreprise",
      desc: "Renseignez vos horaires et numéro WhatsApp pour des réponses ultra-personnalisées (+10 crédits).",
      actionText: "Compléter le profil",
      tab: 'profile' as AppTab,
      badge: "+10 crédits",
    });
  }
  if (safeProducts.length === 0) {
    retentionActions.push({
      title: "Créez votre première fiche produit",
      desc: "Transformez vos articles en descriptions persuasives avec arguments de vente et appel à l'action.",
      actionText: "Créer un produit",
      tab: 'products' as AppTab,
      badge: "+5 crédits",
    });
  } else if (safeHistory.filter((h) => h.type === 'social').length === 0) {
    retentionActions.push({
      title: `Générez une publication pour "${safeProducts[0]?.name || 'votre produit'}"`,
      desc: "Créez vos posts Instagram, Facebook et WhatsApp en un clic pour booster la visibilité de vos produits.",
      actionText: "Générer les posts",
      tab: 'social' as AppTab,
      badge: "Recommandé",
    });
  }
  if ((referralState?.referrals?.length || 0) === 0) {
    retentionActions.push({
      title: "Invitez un commerçant ou entrepreneur ami",
      desc: "Offrez-lui 15 crédits et gagnez vous-même 15 crédits dès sa première utilisation.",
      actionText: "Inviter & gagner",
      tab: 'referrals' as AppTab,
      badge: "+15 crédits / ami",
    });
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Free Plan Lock Banner */}
      {user.plan === 'free' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shrink-0">
              🔒
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Paiement requis pour utiliser l'IA générative BusinessAI
              </h3>
              <p className="text-xs text-slate-600">
                Vos fonctionnalités d'IA sont verrouillées. Envoyez votre paiement au <strong>0163638893</strong> ou souscrivez à un forfait dès <strong>{formatMoney(4900)}/mois</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => openPaymentModal('starter')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Payer au 0163638893 & Débloquer l'IA
          </button>
        </div>
      )}

      {/* Top Welcome & Quota Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>{company.name || 'Votre Entreprise'}</span>
            <span className="text-slate-400">• {company.sector}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tableau de Bord BusinessAI
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Retrouvez vos outils de rédaction, vos fiches produits et vos leviers de croissance.
          </p>
        </div>

        {/* Quota / Plan Status Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shrink-0 w-full md:w-80 relative z-10 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xs text-slate-400 font-semibold">Forfait & Quota</span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                user.plan === 'starter'
                  ? 'text-indigo-900 bg-indigo-100 border border-indigo-200'
                  : user.plan === 'business'
                  ? 'text-amber-900 bg-amber-100 border border-amber-200'
                  : user.plan === 'pro'
                  ? 'text-purple-900 bg-purple-100 border border-purple-200'
                  : 'text-amber-300 bg-amber-950/80 border border-amber-700/60'
              }`}
            >
              <Crown className="w-3 h-3" /> {user.plan === 'free' ? 'Sans IA' : `Plan ${user.plan}`}
              {user.plan === 'starter' && ' ★'}
            </span>
          </div>

          <div className="text-sm font-bold text-white flex items-baseline gap-2 mb-1">
            <span className="text-2xl sm:text-3xl text-indigo-300 font-black">
              {user.plan === 'free' ? 0 : Math.max(0, user.maxCredits - user.creditsUsed)}
            </span>
            <span className="text-xs text-slate-400 font-normal">
              / {user.maxCredits} générations {user.plan === 'free' ? '(Abonnement requis)' : 'restantes'}
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full ${
                user.plan === 'free'
                  ? 'bg-amber-500 w-0'
                  : user.creditsUsed / (user.maxCredits || 1) > 0.8
                  ? 'bg-rose-500'
                  : user.creditsUsed / (user.maxCredits || 1) > 0.5
                  ? 'bg-amber-400'
                  : 'bg-indigo-400'
              }`}
              style={{
                width: user.plan === 'free' ? '0%' : `${Math.min(100, (user.creditsUsed / (user.maxCredits || 1)) * 100)}%`,
              }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>{user.plan === 'free' ? 'Payer & Activer l’IA' : 'Gérer l’offre'}</span>
            </button>
            <button
              onClick={() => setCurrentTab('pricing')}
              className="py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
              title="Voir toutes les offres en FCFA"
            >
              <span>Tarifs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Verified Purchase & Price Lock Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-extrabold uppercase tracking-wide">
                <Check className="w-3 h-3 text-emerald-700" /> Achat Confirmé & Actif
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-[11px] font-extrabold">
                <Lock className="w-3 h-3 text-amber-700" /> Tarif Bloqué à Vie (0% de hausse)
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Réf: {user.activeReceipt?.transactionRef || 'TRX-0163638893-VALID'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Forfait {user.plan.toUpperCase()} garanti • Transfert réglé au 0163638893
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Votre tarif est scellé sans augmentation possible. Vos générateurs d'images, de vidéos, de textes et d'appels IA sont 100% débloqués.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={() => openCodeHubModal()}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer border border-slate-700 active:scale-95"
          >
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Codes & Blueprint 2.0</span>
          </button>
          <button
            onClick={() => openReceiptModal()}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Reçu Officiel</span>
          </button>
          <button
            onClick={() => setCurrentTab('video')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Générateur Vidéo</span>
          </button>
        </div>
      </div>

      {/* Real Performance & Growth Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Demandes effectuées */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Demandes IA</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {(user?.creditsUsed || 0) + safeHistory.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requêtes traitées avec succès</p>
        </div>

        {/* Metric 2: Contenus générés */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Contenus créés</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{safeHistory.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Sauvegardés dans l'historique</p>
        </div>

        {/* Metric 3: Fiches Produits */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Fiches Produits</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{safeProducts.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Articles au catalogue</p>
        </div>

        {/* Metric 4: Réseau & Parrainages */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Entrepreneurs Invités</span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {referralState?.referrals?.length || 0}
            </span>
            <span className="text-xs text-emerald-600 font-bold">
              +{referralState?.totalCreditsEarned || 0} crédits gagnés
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{unlockedBadgesCount} / {safeBadges.length} badges obtenus</p>
        </div>
      </div>

      {/* Next Best Actions & Retention Hub */}
      {retentionActions.length > 0 && (
        <div className="p-6 rounded-3xl bg-linear-to-r from-indigo-900 to-slate-900 text-white border border-indigo-800/60 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-amber-400" />
              <h2 className="font-extrabold text-base sm:text-lg">Prochaines actions recommandées pour booster vos ventes</h2>
            </div>
            <span className="text-xs bg-indigo-800/80 px-2.5 py-1 rounded-full text-indigo-200 font-semibold">
              Recommandations personnalisées
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {retentionActions.map((action, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-md">
                      {action.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white mb-1">{action.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{action.desc}</p>
                </div>

                <button
                  onClick={() => setCurrentTab(action.tab)}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{action.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Launchers Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            <span>Outils & Générateurs Business</span>
          </h2>
          <span className="text-xs text-slate-500">Accès rapide</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Action 1 */}
          <button
            onClick={() => setCurrentTab('assistant')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm text-left transition-all group cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
              Assistant IA Business
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Conseils de vente, reformulation de mails, offres commerciales et stratégie.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 mt-3">
              <span>Ouvrir l'Assistant</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 2: Posts */}
          <button
            onClick={() => setCurrentTab('social')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-sm text-left transition-all group cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-700 transition-colors">
              Générateur de Posts Sociaux
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Facebook, Instagram, messages WhatsApp groupés et slogans percutants.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-sky-700 mt-3">
              <span>Générer mes posts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 3: Video Generator */}
          <button
            onClick={() => setCurrentTab('video')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 hover:shadow-sm text-left transition-all group cursor-pointer shadow-2xs relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold text-[10px]">
              Nouveau
            </div>
            <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-pink-700 transition-colors">
              Générateur Vidéo & TikTok
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Storyboards complets, voix-off minutée, sous-titres .SRT et simulateur interactif.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-pink-700 mt-3">
              <span>Créer une vidéo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 3 */}
          <button
            onClick={() => setCurrentTab('products')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm text-left transition-all group cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
              Fiches Produits & Catalogue
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Descriptifs persuasifs avec bénéfices clients, prix et boutons WhatsApp.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 mt-3">
              <span>Gérer le catalogue</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 4 */}
          <button
            onClick={() => setCurrentTab('clients')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-sm text-left transition-all group cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MessageCircleReply className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-violet-700 transition-colors">
              Réponses aux Clients
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Demande de prix, disponibilité, délais et réclamations avec diplomatie.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-violet-700 mt-3">
              <span>Préparer une réponse</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 5 */}
          <button
            onClick={() => setCurrentTab('sales')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm text-left transition-all group cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-800 transition-colors">
              Calcul de Prix & Marges
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Calculez vos coefficients, taux de marge et simulez vos promotions rentables.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-800 mt-3">
              <span>Outils financiers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action: Invoices & Quotes */}
          <button
            onClick={() => setCurrentTab('invoices')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm text-left transition-all group cursor-pointer shadow-2xs relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px]">
              Essentiel
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-700 transition-colors">
              Devis & Factures Pro
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Générez devis et factures conformes avec TVA, partage WhatsApp direct et export PDF imprimable.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-700 mt-3">
              <span>Créer un devis / facture</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action: AI Voice Calls */}
          <button
            onClick={() => setCurrentTab('ai_calls')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-sm text-left transition-all group cursor-pointer shadow-2xs relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px]">
              Voix IA
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-700 transition-colors">
              Appels Vocaux IA
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              L'IA téléphone à vos clients à votre place pour vos relances de factures et confirmations de livraison.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-purple-700 mt-3">
              <span>Lancer un appel IA</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 6: Growth & Referrals */}
          <button
            onClick={() => setCurrentTab('referrals')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm text-left transition-all group cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-700 transition-colors">
              Programme de Parrainage
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Partagez votre lien de parrainage et gagnez 15 crédits pour chaque entrepreneur invité.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-700 mt-3">
              <span>Voir mes invitations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 7: WhatsApp Integration */}
          <button
            onClick={openWhatsAppTutorialModal}
            className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm text-left transition-all group cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-2xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-800 transition-colors flex items-center gap-2">
              <span>Connecter à WhatsApp</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                Tutoriel
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Découvrez comment relier l'assistant IA à votre WhatsApp Business via Meta Cloud API, Twilio ou ManyChat.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800 mt-3">
              <span>Ouvrir le guide pas-à-pas</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Viral Post Trigger Box */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              Faites connaître votre expérience
            </span>
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">
            Partagez vos résultats sur vos réseaux (+10 crédits)
          </h3>
          <p className="text-xs text-slate-600">
            Publiez un témoignage ou vos résultats obtenus avec BusinessAI sur LinkedIn, Facebook ou Twitter.
          </p>
        </div>

        <button
          onClick={() => setIsViralPostModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Share2 className="w-4 h-4 text-indigo-300" />
          <span>Créer un post de partage</span>
        </button>
      </div>

      {/* Suggested Fast Prompts */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Suggestions de requêtes fréquentes</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            'Rédige une offre spéciale de bienvenue -15% pour mes nouveaux clients',
            'Comment répondre poliment à un client qui trouve nos prix trop chers ?',
            'Donne-moi 3 idées concrètes pour augmenter mon panier moyen ce mois-ci',
            'Rédige un message WhatsApp chaleureux pour annoncer une vente flash de 48h',
            'Prépare un texte pour demander gentiment un avis Google 5 étoiles après un achat',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleTriggerPreset(prompt)}
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-slate-300 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition-all text-left cursor-pointer"
            >
              « {prompt} »
            </button>
          ))}
        </div>
      </div>

      {/* Recent History Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <span>Historique Récent</span>
          </h2>
          <button
            onClick={() => setCurrentTab('history')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Voir tout ({safeHistory.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {safeHistory.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-sm shadow-2xs">
            Aucun contenu généré pour le moment. Lancez votre première demande ci-dessus !
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safeHistory.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {item.type}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5 line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    {item.output}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleCopy(item.output, item.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copié</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
