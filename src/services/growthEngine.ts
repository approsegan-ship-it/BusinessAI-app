import {
  Badge,
  BadgeId,
  ReferralProgramState,
  GrowthAnalytics,
  InAppNotification,
  NotificationPreferences,
  OnboardingState,
  CompanyProfile,
} from '../types';

export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first_content',
    title: 'Premier Contenu',
    description: 'A généré son premier contenu marketing avec BusinessAI.',
    category: 'content',
    unlocked: true,
    unlockedAt: '2026-08-15',
    rewardCredits: 5,
  },
  {
    id: 'first_share',
    title: 'Premier Partage',
    description: 'A partagé une publication ou un devis vers WhatsApp ou ses réseaux.',
    category: 'growth',
    unlocked: false,
    rewardCredits: 5,
  },
  {
    id: 'first_referral',
    title: 'Premier Parrainage',
    description: 'A invité 1 entrepreneur qui a rejoint BusinessAI.',
    category: 'growth',
    unlocked: false,
    rewardCredits: 15,
  },
  {
    id: 'three_referrals',
    title: 'Ambassadeur PME',
    description: '3 entrepreneurs parrainés et actifs sur la plateforme.',
    category: 'growth',
    unlocked: false,
    rewardCredits: 30,
  },
  {
    id: 'five_referrals',
    title: 'Leader Communauté',
    description: '5 entrepreneurs invités avec succès.',
    category: 'growth',
    unlocked: false,
    rewardCredits: 50,
  },
  {
    id: 'profile_completed',
    title: 'Identité Entreprise',
    description: 'Profil complet renseigné (Nom, téléphone WhatsApp, horaires, ton).',
    category: 'profile',
    unlocked: true,
    unlockedAt: '2026-08-15',
    rewardCredits: 10,
  },
  {
    id: 'whatsapp_master',
    title: 'Expert WhatsApp',
    description: 'A envoyé plus de 3 réponses clients via WhatsApp Direct.',
    category: 'content',
    unlocked: false,
    rewardCredits: 10,
  },
  {
    id: 'power_seller',
    title: 'Vendeur Pro',
    description: 'A utilisé les outils de vente et de marge pour ses tarifs.',
    category: 'content',
    unlocked: false,
    rewardCredits: 10,
  },
];

export const DEFAULT_REFERRAL_STATE: ReferralProgramState = {
  code: 'BUSINESSAI-PRO789',
  link: 'https://businessai.app/r/BUSINESSAI-PRO789',
  totalInvited: 0,
  activeInvited: 0,
  totalCreditsEarned: 0,
  referrals: [],
  history: [],
};

export const DEFAULT_ANALYTICS: GrowthAnalytics = {
  contentsCreated: 3,
  sharesDone: 0,
  whatsappShares: 0,
  referralClicks: 0,
  referralSignups: 0,
  creditsUsed: 3,
  creditsEarned: 15,
};

export const DEFAULT_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    type: 'reward',
    title: 'Bienvenue sur BusinessAI !',
    message: 'Vos premiers crédits d’essai gratuits ont été activés pour tester toutes les fonctionnalités.',
    date: 'Aujourd’hui',
    read: false,
    actionTab: 'assistant',
  },
  {
    id: 'notif-2',
    type: 'tip',
    title: 'Astuce : WhatsApp Business',
    message: 'Activez WhatsApp Direct pour répondre à vos clients en 1 clic sans ressaisir vos coordonnées.',
    date: 'Hier',
    read: false,
    actionTab: 'profile',
  },
];

export const DEFAULT_NOTIF_PREFS: NotificationPreferences = {
  credits: true,
  rewards: true,
  referrals: true,
  tips: true,
};

export const DEFAULT_ONBOARDING: OnboardingState = {
  isCompleted: true,
  step: 1,
};

// Growth Watermark
export const VIRAL_FOOTER = '\n\n✨ Créé avec BusinessAI (https://businessai.app)';

/**
 * Generate a unique, professional referral code for an entrepreneur
 */
export function generateReferralCode(companyName?: string): string {
  const cleanName = companyName
    ? companyName.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4)
    : 'PRO';
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BUSINESSAI-${cleanName || 'PRO'}${randomPart}`;
}

/**
 * Share helper with fallback for WhatsApp and native web share
 */
export async function shareContentNativeOrWeb(options: {
  title: string;
  text: string;
  url?: string;
}): Promise<{ success: boolean; method: 'native' | 'clipboard' | 'failed' }> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return { success: true, method: 'native' };
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        console.warn('Native share failed, falling back', e);
      }
    }
  }

  try {
    await navigator.clipboard.writeText(options.text + (options.url ? ` ${options.url}` : ''));
    return { success: true, method: 'clipboard' };
  } catch (err) {
    return { success: false, method: 'failed' };
  }
}

/**
 * Prepares direct WhatsApp sharing URL
 */
export function buildWhatsAppShareUrl(text: string, phone?: string): string {
  const cleanText = encodeURIComponent(text);
  if (phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${cleanText}`;
  }
  return `https://api.whatsapp.com/send?text=${cleanText}`;
}

/**
 * Anti-Abuse validation for referral redemption
 */
export function validateReferralAttempt(
  userCode: string,
  inputCode: string,
  existingCodes: string[]
): { valid: boolean; error?: string } {
  const cleanInput = inputCode.trim().toUpperCase();
  const cleanUser = userCode.trim().toUpperCase();

  if (!cleanInput) {
    return { valid: false, error: 'Veuillez saisir un code de parrainage.' };
  }

  if (cleanInput === cleanUser) {
    return { valid: false, error: 'Vous ne pouvez pas utiliser votre propre code de parrainage.' };
  }

  if (existingCodes.includes(cleanInput)) {
    return { valid: false, error: 'Ce code de parrainage a déjà été utilisé sur cet appareil.' };
  }

  if (!cleanInput.startsWith('BUSINESSAI-')) {
    return { valid: false, error: 'Format de code invalide. Exemple : BUSINESSAI-ABC123' };
  }

  return { valid: true };
}

/**
 * Generates an authentic viral post sharing the entrepreneur's experience with BusinessAI
 */
export function generateViralPostTemplate(
  company: CompanyProfile,
  referralLink: string,
  sectorProblem?: string
): { title: string; postText: string; shortSnippet: string } {
  const sector = company.sector || 'notre activité';
  const companyName = company.name || 'notre entreprise';

  const postText = `En tant qu'entrepreneur dans le secteur "${sector}", l'un de nos plus grands défis a toujours été de rédiger des publications régulières et de répondre rapidement aux clients sans y passer des heures.

Récemment, j'ai commencé à utiliser BusinessAI pour ${companyName}.
Résultat : 
✅ Rédaction de nos fiches produits et publications en quelques clics
✅ Réponses professionnelles et polies envoyées directement sur WhatsApp
✅ Calculs de marges et promotions optimisés en 30 secondes

Si vous gérez une PME ou un commerce et cherchez à gagner du temps chaque jour, testez l'outil gratuitement avec mon lien :
👉 ${referralLink}

#Entrepreneuriat #PME #Productivité #BusinessAI #Croissance`;

  const shortSnippet = `J'utilise BusinessAI pour booster les ventes de ${companyName}. Testez-le gratuitement avec mon lien : ${referralLink}`;

  return {
    title: `Publication d'expérience - ${companyName}`,
    postText,
    shortSnippet,
  };
}
