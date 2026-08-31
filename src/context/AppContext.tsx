import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppTab,
  CompanyProfile,
  SavedProduct,
  HistoryItem,
  UserAccount,
  UserPlan,
  ToastMessage,
  Badge,
  BadgeId,
  ReferralProgramState,
  GrowthAnalytics,
  InAppNotification,
  NotificationPreferences,
  OnboardingState,
} from '../types';
import { DEFAULT_COMPANY, INITIAL_PRODUCTS, INITIAL_HISTORY } from '../utils/defaultData';
import {
  DEFAULT_BADGES,
  DEFAULT_REFERRAL_STATE,
  DEFAULT_ANALYTICS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_NOTIF_PREFS,
  DEFAULT_ONBOARDING,
  generateReferralCode,
  validateReferralAttempt,
} from '../services/growthEngine';
import { PRICING_PLANS, getPlanConfig, PlanId } from '../config/plans';
import { generateUniqueId, ensureUniqueIds } from '../utils/idGenerator';
import { Language, getTranslation } from '../i18n/translations';
import { CurrencyCode, formatPriceWithCurrency } from '../config/currency';
import { OFFICIAL_PAYMENT_NUMBER } from '../components/PaymentInstructionModal';

interface ShareModalPayload {
  title: string;
  text: string;
  url?: string;
  channelHint?: 'whatsapp' | 'social';
}

interface AppContextType {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  company: CompanyProfile;
  updateCompany: (profile: Partial<CompanyProfile>) => void;
  products: SavedProduct[];
  addProduct: (product: Omit<SavedProduct, 'id' | 'createdAt'>) => SavedProduct;
  updateProduct: (id: string, product: Partial<SavedProduct>) => void;
  deleteProduct: (id: string) => void;
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, 'id' | 'createdAt'>) => HistoryItem;
  deleteHistory: (id: string) => void;
  clearHistory: () => void;
  user: UserAccount;
  upgradePlan: (plan: UserPlan) => void;
  consumeCredit: (cost?: number) => boolean;
  addBonusCredits: (amount: number, reason: string) => void;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, description?: string) => void;
  removeToast: (id: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isPricingModalOpen: boolean;
  setIsPricingModalOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  paymentPlan: PlanId;
  openPaymentModal: (planId?: PlanId) => void;
  loginUser: (email: string, name: string) => void;
  logoutUser: () => void;
  activePresetPrompt: string | null;
  setActivePresetPrompt: (prompt: string | null) => void;

  // Language & Multi-Currency
  language: Language;
  setLanguage: (lang: Language) => void;
  displayCurrency: CurrencyCode;
  setDisplayCurrency: (cur: CurrencyCode) => void;
  t: (key: string, params?: Record<string, any>) => string;
  formatMoney: (fcfaAmount: number) => string;

  // Growth & Virality state
  badges: Badge[];
  unlockBadge: (badgeId: BadgeId) => void;
  referralState: ReferralProgramState;
  addReferralInvite: (name: string, companyName?: string) => void;
  simulateReferralActivation: (referralId: string) => void;
  redeemReferralCode: (code: string) => { success: boolean; error?: string };
  analytics: GrowthAnalytics;
  trackGrowthEvent: (
    event: 'content_created' | 'share' | 'whatsapp_share' | 'referral_click' | 'referral_signup'
  ) => void;
  notifications: InAppNotification[];
  unreadNotifsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (type: InAppNotification['type'], title: string, message: string, actionTab?: AppTab) => void;
  notifPrefs: NotificationPreferences;
  updateNotifPrefs: (prefs: Partial<NotificationPreferences>) => void;
  onboarding: OnboardingState;
  completeOnboarding: (data: { businessName?: string; sector?: any; mainGoal?: string; targetTab?: AppTab }) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;

  // Modals for Virality
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  shareModalData: ShareModalPayload | null;
  openShareModal: (payload: ShareModalPayload) => void;
  isViralPostModalOpen: boolean;
  setIsViralPostModalOpen: (open: boolean) => void;
  isViralModalOpen?: boolean;
  setIsViralModalOpen?: (open: boolean) => void;
  isEarnCreditsModalOpen: boolean;
  setIsEarnCreditsModalOpen: (open: boolean) => void;
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  openWhatsAppTutorialModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMPANY: 'businessai_company_v2',
  PRODUCTS: 'businessai_products_v2',
  HISTORY: 'businessai_history_v2',
  USER: 'businessai_user_v2',
  BADGES: 'businessai_badges_v2',
  REFERRALS: 'businessai_referrals_v2',
  ANALYTICS: 'businessai_analytics_v2',
  NOTIFICATIONS: 'businessai_notifications_v2',
  NOTIF_PREFS: 'businessai_notif_prefs_v2',
  ONBOARDING: 'businessai_onboarding_v2',
  LANGUAGE: 'businessai_lang_v1',
  CURRENCY: 'businessai_currency_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [activePresetPrompt, setActivePresetPrompt] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalData, setShareModalData] = useState<ShareModalPayload | null>(null);
  const [isViralPostModalOpen, setIsViralPostModalOpen] = useState(false);
  const [isEarnCreditsModalOpen, setIsEarnCreditsModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<PlanId>('starter');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent Language
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
      return saved && ['fr', 'en', 'es', 'pt', 'ar'].includes(saved) ? saved : 'fr';
    } catch {
      return 'fr';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    } catch (e) {
      console.warn('LocalStorage error on language save', e);
    }
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Persistent Display Currency
  const [displayCurrency, setDisplayCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencyCode;
      return saved && ['FCFA', 'EUR', 'USD', 'GHS', 'NGN', 'CAD'].includes(saved) ? saved : 'FCFA';
    } catch {
      return 'FCFA';
    }
  });

  const setDisplayCurrency = (cur: CurrencyCode) => {
    setDisplayCurrencyState(cur);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, cur);
    } catch (e) {
      console.warn('LocalStorage error on currency save', e);
    }
  };

  const t = (key: string, params?: Record<string, any>): string => {
    return getTranslation(language, key, params);
  };

  const formatMoney = (fcfaAmount: number): string => {
    return formatPriceWithCurrency(fcfaAmount, displayCurrency);
  };

  const openPaymentModal = (planId: PlanId = 'starter') => {
    setPaymentPlan(planId === 'free' ? 'starter' : planId);
    setIsPaymentModalOpen(true);
  };

  // Persistent Company Profile
  const [company, setCompany] = useState<CompanyProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPANY);
      return saved ? JSON.parse(saved) : DEFAULT_COMPANY;
    } catch {
      return DEFAULT_COMPANY;
    }
  });

  // Persistent Products
  const [products, setProducts] = useState<SavedProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const parsed = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
      const valid = Array.isArray(parsed) ? parsed : INITIAL_PRODUCTS;
      return ensureUniqueIds(valid, 'prod');
    } catch {
      return ensureUniqueIds(INITIAL_PRODUCTS, 'prod');
    }
  });

  // Persistent History
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      const parsed = saved ? JSON.parse(saved) : INITIAL_HISTORY;
      const valid = Array.isArray(parsed) ? parsed : INITIAL_HISTORY;
      return ensureUniqueIds(valid, 'hist');
    } catch {
      return ensureUniqueIds(INITIAL_HISTORY, 'hist');
    }
  });

  // User Account
  const [user, setUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Normalize plan if legacy 'premium' was stored
        const plan: UserPlan = parsed.plan === 'premium' ? 'pro' : (parsed.plan || 'free');
        const planLimit = plan === 'business' ? 2000 : plan === 'pro' ? 500 : plan === 'starter' ? 100 : 0;
        const creditsUsed = parsed.creditsUsed ?? 0;
        return {
          ...parsed,
          plan,
          maxCredits: planLimit,
          availableCredits: plan === 'free' ? 0 : (parsed.availableCredits ?? Math.max(0, planLimit - creditsUsed)),
          referralCode: parsed.referralCode || generateReferralCode(DEFAULT_COMPANY.name),
        };
      }
    } catch {
      // ignore
    }
    const initialCode = generateReferralCode('PRO');
    return {
      name: 'Entrepreneur',
      email: 'demo@businessai.app',
      plan: 'free',
      creditsUsed: 0,
      maxCredits: 0,
      availableCredits: 0,
      isLoggedIn: true,
      companyName: DEFAULT_COMPANY.name,
      referralCode: initialCode,
      joinedAt: new Date().toISOString(),
    };
  });

  // Badges
  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BADGES);
      const parsed = saved ? JSON.parse(saved) : DEFAULT_BADGES;
      return Array.isArray(parsed) ? parsed : DEFAULT_BADGES;
    } catch {
      return DEFAULT_BADGES;
    }
  });

  // Referral Program
  const [referralState, setReferralState] = useState<ReferralProgramState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REFERRALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_REFERRAL_STATE,
          ...parsed,
          referrals: ensureUniqueIds(Array.isArray(parsed.referrals) ? parsed.referrals : [], 'ref'),
          history: ensureUniqueIds(Array.isArray(parsed.history) ? parsed.history : [], 'rew'),
        };
      }
    } catch {
      // ignore
    }
    const code = user?.referralCode || generateReferralCode('PRO');
    return {
      ...DEFAULT_REFERRAL_STATE,
      code,
      link: `https://businessai.app/r/${code}`,
    };
  });

  // Growth Analytics
  const [analytics, setAnalytics] = useState<GrowthAnalytics>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
      return saved ? JSON.parse(saved) : DEFAULT_ANALYTICS;
    } catch {
      return DEFAULT_ANALYTICS;
    }
  });

  // In-App Notifications
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const parsed = saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
      const valid = Array.isArray(parsed) ? parsed : DEFAULT_NOTIFICATIONS;
      return ensureUniqueIds(valid, 'notif');
    } catch {
      return ensureUniqueIds(DEFAULT_NOTIFICATIONS, 'notif');
    }
  });

  // Notification Preferences
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIF_PREFS);
      return saved ? JSON.parse(saved) : DEFAULT_NOTIF_PREFS;
    } catch {
      return DEFAULT_NOTIF_PREFS;
    }
  });

  // Onboarding State
  const [onboarding, setOnboarding] = useState<OnboardingState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
      return saved ? JSON.parse(saved) : DEFAULT_ONBOARDING;
    } catch {
      return DEFAULT_ONBOARDING;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company));
    } catch (e) {
      console.warn('LocalStorage error on company save', e);
    }
  }, [company]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('LocalStorage error on products save', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage error on history save', e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage error on user save', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
    } catch (e) {
      console.warn('LocalStorage error on badges save', e);
    }
  }, [badges]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referralState));
    } catch (e) {
      console.warn('LocalStorage error on referrals save', e);
    }
  }, [referralState]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
    } catch (e) {
      console.warn('LocalStorage error on analytics save', e);
    }
  }, [analytics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('LocalStorage error on notifs save', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIF_PREFS, JSON.stringify(notifPrefs));
    } catch (e) {
      console.warn('LocalStorage error on notif prefs save', e);
    }
  }, [notifPrefs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(onboarding));
    } catch (e) {
      console.warn('LocalStorage error on onboarding save', e);
    }
  }, [onboarding]);

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = generateUniqueId('toast');
    const newToast: ToastMessage = { id, type, title, description };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addNotification = (
    type: InAppNotification['type'],
    title: string,
    message: string,
    actionTab?: AppTab
  ) => {
    // Respect user preferences
    if (type === 'credit' && !notifPrefs.credits) return;
    if (type === 'reward' && !notifPrefs.rewards) return;
    if (type === 'referral' && !notifPrefs.referrals) return;
    if (type === 'tip' && !notifPrefs.tips) return;

    const newNotif: InAppNotification = {
      id: generateUniqueId('notif'),
      type,
      title,
      message,
      date: 'À l’instant',
      read: false,
      actionTab,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('info', 'Toutes les notifications marquées comme lues');
  };

  const updateNotifPrefs = (prefs: Partial<NotificationPreferences>) => {
    setNotifPrefs((prev) => ({ ...prev, ...prefs }));
    addToast('success', 'Préférences de notification enregistrées');
  };

  const updateCompany = (updates: Partial<CompanyProfile>) => {
    setCompany((prev) => {
      const next = { ...prev, ...updates };
      return next;
    });
    // Check for profile completed badge
    if (updates.name && (updates.whatsapp || updates.phone)) {
      unlockBadge('profile_completed');
    }
    addToast('success', 'Profil mis à jour', "L'IA utilise maintenant ces informations.");
  };

  const addProduct = (prodData: Omit<SavedProduct, 'id' | 'createdAt'>): SavedProduct => {
    const newProduct: SavedProduct = {
      ...prodData,
      id: generateUniqueId('prod'),
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    trackGrowthEvent('content_created');
    unlockBadge('first_content');
    addToast('success', 'Produit enregistré', `"${newProduct.name}" a été ajouté au catalogue.`);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<SavedProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addToast('info', 'Fiche produit modifiée', 'Les modifications ont été sauvegardées.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('info', 'Produit supprimé', 'Le produit a été retiré de votre liste.');
  };

  const addHistory = (item: Omit<HistoryItem, 'id' | 'createdAt'>): HistoryItem => {
    const newItem: HistoryItem = {
      ...item,
      id: generateUniqueId('hist'),
      createdAt: new Date().toISOString(),
    };
    setHistory((prev) => [newItem, ...prev]);
    trackGrowthEvent('content_created');
    unlockBadge('first_content');
    return newItem;
  };

  const deleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    addToast('info', 'Historique supprimé', "L'élément a été retiré.");
  };

  const clearHistory = () => {
    setHistory([]);
    addToast('info', 'Historique réinitialisé', 'Toutes les entrées ont été effacées.');
  };

  const upgradePlan = (newPlan: UserPlan) => {
    const normPlan: PlanId = newPlan === 'premium' ? 'pro' : (newPlan as PlanId);
    const planConfig = getPlanConfig(normPlan);
    const monthlyLimit = planConfig.monthlyGenerations;

    setUser((prev) => {
      // If staying or switching to free, keep used credits up to new limit
      const isSwitchToFree = normPlan === 'free';
      const creditsUsed = isSwitchToFree ? Math.min(prev.creditsUsed, monthlyLimit) : 0;
      const availableCredits = Math.max(0, monthlyLimit - creditsUsed);

      return {
        ...prev,
        plan: normPlan,
        maxCredits: monthlyLimit,
        availableCredits,
        creditsUsed,
      };
    });

    setIsPricingModalOpen(false);

    const isPaid = normPlan !== 'free';
    addNotification(
      'reward',
      `Forfait ${planConfig.name} Activé !`,
      isPaid
        ? `Félicitations ! Vous disposez maintenant de ${planConfig.monthlyGenerations} générations IA par mois (${planConfig.formattedPrice}/mois).`
        : `Vous êtes sur le forfait Découverte gratuit (${planConfig.monthlyGenerations} générations/mois).`,
      'dashboard'
    );

    addToast(
      'success',
      `Forfait ${planConfig.name} activé !`,
      isPaid
        ? `${planConfig.monthlyGenerations} générations/mois débloquées (${planConfig.formattedPrice}${planConfig.period}). Mode test actif : aucun prélèvement bancaire réel.`
        : `Forfait Découverte activé avec ${planConfig.monthlyGenerations} générations IA par mois.`
    );
  };

  const consumeCredit = (cost: number = 1): boolean => {
    const planConfig = getPlanConfig(user.plan);

    // Free plan has 0 generations: must pay first to use AI
    if (user.plan === 'free' || user.maxCredits <= 0) {
      addToast(
        'warning',
        'Paiement requis pour activer l’IA',
        `L’utilisation de l’Assistant et des générateurs IA nécessite un forfait actif (Starter dès ${PRICING_PLANS.starter.formattedPrice}, Pro ou Business).`
      );
      setIsPricingModalOpen(true);
      return false;
    }

    // Strict quota check: prevent generating if limit is reached
    if (user.availableCredits < cost || user.creditsUsed >= user.maxCredits) {
      addToast(
        'error',
        'Quota mensuel atteint !',
        `Vous avez utilisé toutes vos ${user.maxCredits} générations pour le forfait ${planConfig.name}. Passez au forfait supérieur pour continuer.`
      );
      setIsPricingModalOpen(true);
      return false;
    }

    setUser((prev) => ({
      ...prev,
      creditsUsed: prev.creditsUsed + cost,
      availableCredits: Math.max(0, prev.availableCredits - cost),
    }));
    setAnalytics((prev) => ({ ...prev, creditsUsed: prev.creditsUsed + cost }));
    return true;
  };

  const addBonusCredits = (amount: number, reason: string) => {
    setUser((prev) => ({
      ...prev,
      availableCredits: prev.availableCredits + amount,
      maxCredits: prev.maxCredits + amount,
    }));
    setAnalytics((prev) => ({
      ...prev,
      creditsEarned: prev.creditsEarned + amount,
    }));
    addNotification('credit', `+${amount} Crédits Gratuits reçus !`, reason, 'earn_credits');
    addToast('success', `+${amount} Crédits ajoutés !`, reason);
  };

  const unlockBadge = (badgeId: BadgeId) => {
    setBadges((prev) => {
      const target = prev.find((b) => b.id === badgeId);
      if (!target || target.unlocked) return prev;

      // Award bonus credits for this badge
      addBonusCredits(target.rewardCredits, `Badge débloqué : « ${target.title} »`);
      addNotification(
        'reward',
        `Nouveau Badge : ${target.title}`,
        `${target.description} (+${target.rewardCredits} crédits reçus)`,
        'profile'
      );

      return prev.map((b) =>
        b.id === badgeId ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b
      );
    });
  };

  const trackGrowthEvent = (
    event: 'content_created' | 'share' | 'whatsapp_share' | 'referral_click' | 'referral_signup'
  ) => {
    setAnalytics((prev) => {
      const updated = { ...prev };
      if (event === 'content_created') updated.contentsCreated += 1;
      if (event === 'share') updated.sharesDone += 1;
      if (event === 'whatsapp_share') {
        updated.whatsappShares += 1;
        updated.sharesDone += 1;
      }
      if (event === 'referral_click') updated.referralClicks += 1;
      if (event === 'referral_signup') updated.referralSignups += 1;
      return updated;
    });

    if (event === 'share' || event === 'whatsapp_share') {
      unlockBadge('first_share');
    }
    if (event === 'whatsapp_share') {
      if (analytics.whatsappShares + 1 >= 3) {
        unlockBadge('whatsapp_master');
      }
    }
  };

  const addReferralInvite = (name: string, companyName?: string) => {
    const newRef = {
      id: generateUniqueId('ref'),
      referralCode: referralState.code,
      referredName: name,
      referredCompany: companyName,
      date: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
      creditsAwarded: 0,
    };

    setReferralState((prev) => ({
      ...prev,
      totalInvited: (prev.totalInvited || 0) + 1,
      referrals: [newRef, ...(prev.referrals || [])],
    }));

    addNotification(
      'referral',
      'Invitation envoyée',
      `Vous avez invité ${name}. Vous recevrez des crédits dès son inscription validée.`,
      'referrals'
    );
    addToast('success', 'Invitation enregistrée', `Lien partagé avec ${name}.`);
  };

  const simulateReferralActivation = (referralId: string) => {
    setReferralState((prev) => {
      const currentRefs = prev.referrals || [];
      const target = currentRefs.find((r) => r.id === referralId);
      if (!target || target.status === 'active' || target.status === 'rewarded') return prev;

      const rewardAmount = 15;
      const updatedReferrals = currentRefs.map((r) =>
        r.id === referralId ? { ...r, status: 'active' as const, creditsAwarded: rewardAmount } : r
      );

      const newHistoryItem = {
        id: generateUniqueId('rew'),
        date: new Date().toISOString().split('T')[0],
        action: 'Parrainage validé',
        credits: rewardAmount,
        description: `Inscription confirmée pour ${target.referredName}`,
      };

      const newTotalActive = (prev.activeInvited || 0) + 1;
      const newTotalEarned = (prev.totalCreditsEarned || 0) + rewardAmount;

      // Credit bonus
      addBonusCredits(rewardAmount, `Parrainage réussi : ${target.referredName} a rejoint BusinessAI !`);

      // Unlock badges accordingly
      if (newTotalActive >= 1) unlockBadge('first_referral');
      if (newTotalActive >= 3) unlockBadge('three_referrals');
      if (newTotalActive >= 5) unlockBadge('five_referrals');

      return {
        ...prev,
        activeInvited: newTotalActive,
        totalCreditsEarned: newTotalEarned,
        referrals: updatedReferrals,
        history: [newHistoryItem, ...(prev.history || [])],
      };
    });
  };

  const redeemReferralCode = (inputCode: string): { success: boolean; error?: string } => {
    const existingUsedCodes: string[] = [];
    const validation = validateReferralAttempt(referralState.code, inputCode, existingUsedCodes);

    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const bonusCredits = 15;
    addBonusCredits(bonusCredits, `Code de parrainage activé : ${inputCode.toUpperCase()}`);
    addToast('success', 'Parrainage validé !', `Vous avez reçu ${bonusCredits} crédits de bienvenue.`);
    return { success: true };
  };

  const openShareModal = (payload: ShareModalPayload) => {
    setShareModalData(payload);
    setIsShareModalOpen(true);
  };

  const openWhatsAppTutorialModal = () => {
    setIsWhatsAppModalOpen(true);
  };

  const completeOnboarding = (data: {
    businessName?: string;
    sector?: any;
    mainGoal?: string;
    targetTab?: AppTab;
  }) => {
    if (data.businessName || data.sector) {
      updateCompany({
        name: data.businessName || company.name,
        sector: data.sector || company.sector,
      });
    }

    setOnboarding({
      isCompleted: true,
      step: 3,
      businessName: data.businessName,
      sector: data.sector,
      mainGoal: data.mainGoal,
    });
    setIsOnboardingOpen(false);

    if (data.targetTab) {
      setCurrentTab(data.targetTab);
    }
  };

  const loginUser = (email: string, name: string) => {
    setUser((prev) => ({
      ...prev,
      email,
      name,
      isLoggedIn: true,
    }));
    setIsAuthModalOpen(false);
    addToast('success', 'Connexion réussie', `Bienvenue sur BusinessAI, ${name} !`);
  };

  const logoutUser = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
    addToast('info', 'Déconnexion', 'Vous êtes maintenant en mode invité.');
  };

  const unreadNotifsCount = (Array.isArray(notifications) ? notifications : []).filter((n) => !n?.read).length;

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        company,
        updateCompany,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        history,
        addHistory,
        deleteHistory,
        clearHistory,
        user,
        upgradePlan,
        consumeCredit,
        addBonusCredits,
        toasts,
        addToast,
        removeToast,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isPricingModalOpen,
        setIsPricingModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        paymentPlan,
        openPaymentModal,
        loginUser,
        logoutUser,
        activePresetPrompt,
        setActivePresetPrompt,

        // Language & Multi-Currency
        language,
        setLanguage,
        displayCurrency,
        setDisplayCurrency,
        t,
        formatMoney,

        // Growth & Virality
        badges,
        unlockBadge,
        referralState,
        addReferralInvite,
        simulateReferralActivation,
        redeemReferralCode,
        analytics,
        trackGrowthEvent,
        notifications,
        unreadNotifsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        notifPrefs,
        updateNotifPrefs,
        onboarding,
        completeOnboarding,
        isOnboardingOpen,
        setIsOnboardingOpen,

        // Modals
        isShareModalOpen,
        setIsShareModalOpen,
        shareModalData,
        openShareModal,
        isViralPostModalOpen,
        setIsViralPostModalOpen,
        isViralModalOpen: isViralPostModalOpen,
        setIsViralModalOpen: setIsViralPostModalOpen,
        isEarnCreditsModalOpen,
        setIsEarnCreditsModalOpen,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        openWhatsAppTutorialModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé à l’intérieur de AppProvider');
  }
  return context;
};

