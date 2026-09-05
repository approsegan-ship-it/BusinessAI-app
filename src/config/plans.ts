export type PlanId = 'free' | 'starter' | 'pro' | 'business';

export interface PlanFeature {
  name: string;
  includedIn: PlanId[];
  tooltip?: string;
  category?: 'ai' | 'tools' | 'customization' | 'collaboration' | 'support';
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  price: number;
  currency: string;
  formattedPrice: string;
  period: string;
  badge?: string;
  isRecommended?: boolean;
  monthlyGenerations: number;
  tagline: string;
  description: string;
  features: string[];
  maxUsers: number;
  historyLimit: number;
  supportLevel: string;
  priceLocked: boolean;
  priceLockGuarantee: string;
  colorScheme: {
    primary: string;
    border: string;
    bg: string;
    badgeBg: string;
    badgeText: string;
    buttonBg: string;
    buttonHover: string;
    buttonText: string;
  };
}

/**
 * Configuration centralisée des tarifs et limites BusinessAI.
 * Facilement modifiable pour ajuster les prix, quotas et fonctionnalités.
 */
export const PRICING_PLANS: Record<PlanId, PricingPlan> = {
  free: {
    id: 'free',
    name: 'FREE',
    price: 0,
    currency: 'FCFA',
    formattedPrice: '0 FCFA',
    period: '/mois',
    badge: 'Aperçu Sans IA',
    isRecommended: false,
    monthlyGenerations: 0,
    tagline: 'Aperçu & Découverte de l’application',
    description: 'Explorez l’interface, configurez votre entreprise et testez vos marges. Abonnement requis pour générer avec l’IA.',
    features: [
      'Accès au tableau de bord & catalogue produits',
      'Calculateur de marge & simulateur de promotions',
      'Configuration du profil d’entreprise & devises',
      'Générations IA verrouillées (Abonnement requis)',
      'Déblocage immédiat via Wave, Orange Money, MTN, Carte',
    ],
    maxUsers: 1,
    historyLimit: 5,
    supportLevel: 'FAQ & Centre d’aide',
    priceLocked: true,
    priceLockGuarantee: 'Tarif gratuit garanti sans frais cachés',
    colorScheme: {
      primary: 'text-slate-900',
      border: 'border-slate-200',
      bg: 'bg-white',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      buttonBg: 'bg-slate-100 hover:bg-slate-200',
      buttonHover: 'hover:bg-slate-200',
      buttonText: 'text-slate-900',
    },
  },
  starter: {
    id: 'starter',
    name: 'STARTER',
    price: 9900,
    currency: 'FCFA',
    formattedPrice: '9 900 FCFA',
    period: '/mois',
    badge: 'Recommandé PME',
    isRecommended: true,
    monthlyGenerations: 150,
    tagline: 'L’offre recommandée pour les commerçants & PME',
    description: 'Publiez régulièrement sur vos réseaux, rédigez vos offres et améliorez votre conversion client.',
    features: [
      '150 générations IA par mois',
      'Toutes les fonctionnalités essentielles',
      'Historique étendu (50 contenus sauvegardés)',
      'Outils marketing (calculateur de marge & promotions)',
      'Personnalisation de l’entreprise (coordonnées & ton)',
      'Partage et export WhatsApp immédiat',
    ],
    maxUsers: 1,
    historyLimit: 50,
    supportLevel: 'Support standard sous 24h',
    priceLocked: true,
    priceLockGuarantee: 'Prix bloqué à vie : 9 900 FCFA garanti sans aucune hausse future',
    colorScheme: {
      primary: 'text-indigo-900',
      border: 'border-indigo-600 ring-2 ring-indigo-600/30',
      bg: 'bg-indigo-50/30',
      badgeBg: 'bg-indigo-600',
      badgeText: 'text-white',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
      buttonHover: 'hover:bg-indigo-700',
      buttonText: 'text-white',
    },
  },
  pro: {
    id: 'pro',
    name: 'PRO',
    price: 19900,
    currency: 'FCFA',
    formattedPrice: '19 900 FCFA',
    period: '/mois',
    badge: 'Croissance Accélérée',
    isRecommended: false,
    monthlyGenerations: 750,
    tagline: 'Pour les entrepreneurs actifs et e-commerçants',
    description: 'Automatisez 100% de votre rédaction commerciale, vos argumentaires et vos campagnes de vente.',
    features: [
      '750 générations IA par mois',
      'Toutes les fonctionnalités Starter',
      'Outils marketing avancés (simulateur & relances)',
      'Historique plus important (200 contenus avec filtres)',
      'Personnalisation avancée (base de connaissances)',
      'Modèle Gemini 3.7 Flash ultra-rapide prioritaire',
    ],
    maxUsers: 2,
    historyLimit: 200,
    supportLevel: 'Support rapide sous 12h',
    priceLocked: true,
    priceLockGuarantee: 'Prix bloqué à vie : 19 900 FCFA garanti sans aucune hausse future',
    colorScheme: {
      primary: 'text-purple-900',
      border: 'border-purple-300',
      bg: 'bg-white',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      buttonBg: 'bg-slate-900 hover:bg-slate-800',
      buttonHover: 'hover:bg-slate-800',
      buttonText: 'text-white',
    },
  },
  business: {
    id: 'business',
    name: 'BUSINESS',
    price: 49000,
    currency: 'FCFA',
    formattedPrice: '49 000 FCFA',
    period: '/mois',
    badge: 'Équipes & Volume',
    isRecommended: false,
    monthlyGenerations: 3000,
    tagline: 'Pour les entreprises en expansion et agences',
    description: 'Utilisation intensive avec plusieurs collaborateurs, accès illimité aux agents et support prioritaire VIP.',
    features: [
      'Utilisation importante (3 000 générations IA / mois)',
      'Plusieurs utilisateurs (jusqu’à 5 comptes collaborateurs)',
      'Fonctionnalités avancées & tous les agents IA',
      'Support prioritaire (WhatsApp direct & assistance dédiée)',
      'Historique illimité avec export complet',
      'Directives de marque d’entreprise strictes',
    ],
    maxUsers: 5,
    historyLimit: 99999,
    supportLevel: 'Support VIP direct WhatsApp & hotline',
    priceLocked: true,
    priceLockGuarantee: 'Prix bloqué à vie : 49 000 FCFA garanti sans aucune hausse future',
    colorScheme: {
      primary: 'text-amber-950',
      border: 'border-amber-400',
      bg: 'bg-amber-50/20',
      badgeBg: 'bg-amber-500',
      badgeText: 'text-slate-950 font-black',
      buttonBg: 'bg-amber-600 hover:bg-amber-700',
      buttonHover: 'hover:bg-amber-700',
      buttonText: 'text-white',
    },
  },
};

export const PLANS_ARRAY: PricingPlan[] = [
  PRICING_PLANS.free,
  PRICING_PLANS.starter,
  PRICING_PLANS.pro,
  PRICING_PLANS.business,
];

/**
 * Matrice détaillée de comparaison des 4 offres pour l'affichage tableau / mobile Android
 */
export interface ComparisonRow {
  featureName: string;
  category: string;
  free: string | boolean;
  starter: string | boolean;
  pro: string | boolean;
  business: string | boolean;
  tooltip?: string;
}

export const COMPARISON_MATRIX: ComparisonRow[] = [
  {
    category: 'Générations & Utilisation',
    featureName: 'Générations IA par mois',
    free: '0 (Abonnement requis)',
    starter: '150 / mois',
    pro: '750 / mois',
    business: '3 000 / mois',
    tooltip: 'Nombre de textes, posts, réponses et fiches générés avec Gemini 3.7.',
  },
  {
    category: 'Générations & Utilisation',
    featureName: 'Vitesse de génération',
    free: 'Désactivé',
    starter: 'Rapide',
    pro: 'Ultra-rapide',
    business: 'Priorité maximale VIP',
  },
  {
    category: 'Générateurs & Outils IA',
    featureName: 'Générateur de publications réseaux',
    free: 'Aperçu (Paiement requis)',
    starter: true,
    pro: true,
    business: true,
  },
  {
    category: 'Générateurs & Outils IA',
    featureName: 'Générateur de fiches produits',
    free: 'Aperçu (Paiement requis)',
    starter: true,
    pro: true,
    business: true,
  },
  {
    category: 'Générateurs & Outils IA',
    featureName: 'Réponses clients WhatsApp & SMS',
    free: 'Aperçu (Paiement requis)',
    starter: true,
    pro: true,
    business: true,
  },
  {
    category: 'Générateurs & Outils IA',
    featureName: 'Outils marketing & marges',
    free: 'Calculateur basique',
    starter: 'Essentiels + Promotions',
    pro: 'Avancés + Simulateur',
    business: 'Complets & Stratégiques',
  },
  {
    category: 'Générateurs & Outils IA',
    featureName: 'Assistant conversationnel d’entreprise',
    free: 'Verrouillé (Paiement requis)',
    starter: 'Standard',
    pro: 'Avancé',
    business: 'Agent d’élite dédié',
  },
  {
    category: 'Gestion & Personnalisation',
    featureName: 'Personnalisation de l’entreprise',
    free: 'Standard',
    starter: 'Personnalisation étendue',
    pro: 'Base de connaissances mémorisée',
    business: 'Directives strictes & multi-marques',
  },
  {
    category: 'Gestion & Personnalisation',
    featureName: 'Historique des contenus',
    free: '10 derniers',
    starter: '50 contenus',
    pro: '200 contenus',
    business: 'Illimité + Export',
  },
  {
    category: 'Gestion & Personnalisation',
    featureName: 'Partage WhatsApp & Réseaux en 1 clic',
    free: true,
    starter: true,
    pro: true,
    business: true,
  },
  {
    category: 'Équipe & Support',
    featureName: 'Nombre d’utilisateurs',
    free: '1 utilisateur',
    starter: '1 utilisateur',
    pro: '2 utilisateurs',
    business: '5 utilisateurs',
  },
  {
    category: 'Équipe & Support',
    featureName: 'Support client',
    free: 'FAQ & Communauté',
    starter: 'Standard (< 24h)',
    pro: 'Prioritaire (< 12h)',
    business: 'VIP direct WhatsApp',
  },
];

/**
 * Architecture de paiement prête pour intégrations futures :
 * Mobile Money (Wave, Orange Money, MTN, Moov), Carte Bancaire, Stripe, CinetPay, FedaPay.
 */
export interface PaymentMethodOption {
  id: 'wave' | 'orange_money' | 'mtn' | 'moov' | 'card';
  name: string;
  category: 'mobile_money' | 'card';
  logoText: string;
  badge?: string;
  countries: string[];
  isReadyForIntegration: boolean;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'wave',
    name: 'Wave Mobile Money',
    category: 'mobile_money',
    logoText: 'Wave',
    badge: '0% frais',
    countries: ['Sénégal', 'Côte d’Ivoire', 'Mali', 'Burkina Faso'],
    isReadyForIntegration: true,
  },
  {
    id: 'orange_money',
    name: 'Orange Money',
    category: 'mobile_money',
    logoText: 'Orange Money',
    countries: ['Sénégal', 'Côte d’Ivoire', 'Cameroun', 'Mali', 'Guinée', 'Burkina Faso'],
    isReadyForIntegration: true,
  },
  {
    id: 'mtn',
    name: 'MTN Mobile Money',
    category: 'mobile_money',
    logoText: 'MTN MoMo',
    countries: ['Côte d’Ivoire', 'Bénin', 'Cameroun', 'Congo'],
    isReadyForIntegration: true,
  },
  {
    id: 'moov',
    name: 'Moov Money',
    category: 'mobile_money',
    logoText: 'Moov Money',
    countries: ['Côte d’Ivoire', 'Bénin', 'Togo', 'Burkina Faso'],
    isReadyForIntegration: true,
  },
  {
    id: 'card',
    name: 'Carte Bancaire (Visa / Mastercard)',
    category: 'card',
    logoText: 'Visa / Mastercard',
    badge: 'International',
    countries: ['Tous pays'],
    isReadyForIntegration: true,
  },
];

export function getPlanConfig(planId: PlanId | string): PricingPlan {
  if (planId === 'premium') return PRICING_PLANS.pro; // legacy fallback
  return PRICING_PLANS[planId as PlanId] || PRICING_PLANS.free;
}

export function canAccessFeature(
  userPlan: PlanId | string,
  feature: 'marketing_tools' | 'advanced_marketing' | 'multi_user' | 'knowledge_base'
): { allowed: boolean; minPlanRequired: PlanId; planName: string } {
  const normPlan = userPlan === 'premium' ? 'pro' : (userPlan as PlanId);

  switch (feature) {
    case 'marketing_tools':
      return {
        allowed: normPlan === 'starter' || normPlan === 'pro' || normPlan === 'business',
        minPlanRequired: 'starter',
        planName: 'STARTER',
      };
    case 'advanced_marketing':
    case 'knowledge_base':
      return {
        allowed: normPlan === 'pro' || normPlan === 'business',
        minPlanRequired: 'pro',
        planName: 'PRO',
      };
    case 'multi_user':
      return {
        allowed: normPlan === 'business',
        minPlanRequired: 'business',
        planName: 'BUSINESS',
      };
    default:
      return { allowed: true, minPlanRequired: 'free', planName: 'FREE' };
  }
}
