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
  InvoiceDocument,
  AICallSession,
  PurchaseReceipt,
  ServerSubscriptionStatus,
} from '../types';
import {
  DEFAULT_COMPANY,
  INITIAL_PRODUCTS,
  INITIAL_HISTORY,
  INITIAL_INVOICES,
  INITIAL_CALL_SESSIONS,
} from '../utils/defaultData';
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
import {
  fetchServerSubscriptionStatus,
  createLemonSqueezyCheckout,
  activateSubscriptionCode,
} from '../services/paymentService';
import { getClientUserId } from '../utils/userId';

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

  // Invoices & Quotes
  invoices: InvoiceDocument[];
  addInvoice: (inv: Omit<InvoiceDocument, 'id' | 'createdAt' | 'updatedAt'>) => InvoiceDocument;
  updateInvoice: (id: string, inv: Partial<InvoiceDocument>) => void;
  deleteInvoice: (id: string) => void;
  duplicateInvoice: (id: string) => InvoiceDocument;
  convertQuoteToInvoice: (quoteId: string) => InvoiceDocument | null;

  // AI Voice Calls
  callSessions: AICallSession[];
  addCallSession: (session: Omit<AICallSession, 'id' | 'createdAt'>) => AICallSession;
  updateCallSession: (id: string, session: Partial<AICallSession>) => void;
  deleteCallSession: (id: string) => void;
  user: UserAccount;
  serverSubscription: ServerSubscriptionStatus | null;
  isCheckingServerSubscription: boolean;
  isCheckoutLoading: boolean;
  startLemonSqueezyCheckout: (planId: 'starter' | 'pro' | 'business') => Promise<void>;
  refreshSubscriptionStatus: () => Promise<void>;
  submitActivationCode: (code: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  upgradePlan: (
    plan: UserPlan,
    paymentDetails?: { senderName?: string; senderPhone?: string; transactionRef?: string }
  ) => void;
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
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  openReceiptModal: () => void;
  isCodeHubModalOpen: boolean;
  setIsCodeHubModalOpen: (open: boolean) => void;
  openCodeHubModal: () => void;
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
  INVOICES: 'businessai_invoices_v2',
  CALL_SESSIONS: 'businessai_call_sessions_v2',
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

  // Persistent Invoices & Quotes
  const [invoices, setInvoices] = useState<InvoiceDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      const parsed = saved ? JSON.parse(saved) : INITIAL_INVOICES;
      const valid = Array.isArray(parsed) ? parsed : INITIAL_INVOICES;
      return ensureUniqueIds(valid, 'inv');
    } catch {
      return ensureUniqueIds(INITIAL_INVOICES, 'inv');
    }
  });

  // Persistent AI Voice Call Sessions
  const [callSessions, setCallSessions] = useState<AICallSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CALL_SESSIONS);
      const parsed = saved ? JSON.parse(saved) : INITIAL_CALL_SESSIONS;
      const valid = Array.isArray(parsed) ? parsed : INITIAL_CALL_SESSIONS;
      return ensureUniqueIds(valid, 'call');
    } catch {
      return ensureUniqueIds(INITIAL_CALL_SESSIONS, 'call');
    }
  });

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const openReceiptModal = () => {
    setIsReceiptModalOpen(true);
  };

  const [isCodeHubModalOpen, setIsCodeHubModalOpen] = useState(false);

  const openCodeHubModal = () => {
    setIsCodeHubModalOpen(true);
  };

  const [serverSubscription, setServerSubscription] = useState<ServerSubscriptionStatus | null>(null);
  const [isCheckingServerSubscription, setIsCheckingServerSubscription] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // User Account (Par défaut: Non Payé - Paiement obligatoire avant toute utilisation)
  const [user, setUser] = useState<UserAccount>(() => {
    const defaultPlan: UserPlan = 'free';

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Si ancien profil démo ou faux reçu démo automatique, forcer en non payé
        const isFakeDemo =
          parsed.activeReceipt?.receiptId === 'REC-0163638893-BLQ' ||
          parsed.email === 'demo@businessai.app' ||
          !parsed.isPurchased ||
          parsed.plan === 'free';

        if (isFakeDemo) {
          return {
            ...parsed,
            plan: 'free',
            isPurchased: false,
            purchaseStatus: undefined,
            priceLocked: false,
            activeReceipt: undefined,
            maxCredits: 0,
            availableCredits: 0,
            creditsUsed: 0,
          };
        }

        const plan: UserPlan = parsed.plan || 'free';
        const currentConfig = getPlanConfig(plan);
        const planLimit = currentConfig.monthlyGenerations;
        const creditsUsed = parsed.creditsUsed ?? 0;
        const availableCredits = parsed.availableCredits && parsed.availableCredits > 0
          ? parsed.availableCredits
          : Math.max(0, planLimit - creditsUsed);

        return {
          ...parsed,
          plan,
          isPurchased: parsed.isPurchased === true,
          purchaseStatus: parsed.isPurchased ? 'completed' : undefined,
          priceLocked: parsed.isPurchased === true,
          activeReceipt: parsed.activeReceipt,
          maxCredits: planLimit,
          availableCredits,
          referralCode: parsed.referralCode || generateReferralCode(DEFAULT_COMPANY.name),
        };
      }
    } catch {
      // ignore
    }
    const initialCode = generateReferralCode('CLIENT');
    return {
      name: 'Client',
      email: '',
      plan: defaultPlan,
      creditsUsed: 0,
      maxCredits: 0,
      availableCredits: 0,
      isLoggedIn: true,
      isPurchased: false,
      purchaseStatus: undefined,
      priceLocked: false,
      activeReceipt: undefined,
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
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    } catch (e) {
      console.warn('LocalStorage error on invoices save', e);
    }
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CALL_SESSIONS, JSON.stringify(callSessions));
    } catch (e) {
      console.warn('LocalStorage error on call sessions save', e);
    }
  }, [callSessions]);

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

  const syncServerSubscription = async () => {
    setIsCheckingServerSubscription(true);
    try {
      const status = await fetchServerSubscriptionStatus();
      if (status) {
        setServerSubscription(status);
        if (status.isPaid && status.status === 'active') {
          setUser((prev) => {
            const planLimit = status.monthlyGenerations || 100;
            return {
              ...prev,
              id: getClientUserId(),
              plan: status.plan,
              isPurchased: true,
              serverVerified: true,
              purchaseStatus: 'completed',
              maxCredits: planLimit,
              availableCredits: Math.max(0, planLimit - prev.creditsUsed),
            };
          });
        } else {
          // Explicitly enforce unpaid status from server
          setUser((prev) => ({
            ...prev,
            id: getClientUserId(),
            plan: 'free',
            isPurchased: false,
            serverVerified: false,
            purchaseStatus: undefined,
            maxCredits: 0,
            availableCredits: 0,
          }));
        }
      }
    } catch (err) {
      console.warn('[AppContext] Erreur vérification abonnement:', err);
    } finally {
      setIsCheckingServerSubscription(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    await syncServerSubscription();
  };

  const submitActivationCode = async (
    code: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await activateSubscriptionCode(code, user.name, user.email);
      if (res.success && res.plan) {
        addToast('success', 'Forfait Débloqué !', res.message || 'Votre accès IA est maintenant actif.');
        await syncServerSubscription();
        return { success: true, message: res.message };
      } else {
        const errorMsg = res.error || "Code d'activation invalide.";
        addToast('error', 'Code Rejeté', errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const msg = err?.message || 'Erreur lors de la validation du code.';
      addToast('error', 'Connexion impossible', msg);
      return { success: false, error: msg };
    }
  };

  const startLemonSqueezyCheckout = async (planId: 'starter' | 'pro' | 'business') => {
    setIsCheckoutLoading(true);
    try {
      const res = await createLemonSqueezyCheckout(planId, user.email, user.name);
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
        return;
      }
      if (res.requiresConfig) {
        addToast(
          'warning',
          'Configuration Lemon Squeezy Requise',
          res.error || 'Veuillez renseigner LEMON_SQUEEZY_API_KEY et les Variant IDs dans le serveur.'
        );
        openPaymentModal(planId);
        return;
      }
      if (res.error) {
        addToast('error', 'Erreur de Paiement', res.error);
      }
    } catch (err: any) {
      addToast('error', 'Connexion impossible', err?.message || 'Erreur lors de la redirection');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  useEffect(() => {
    syncServerSubscription();

    const handlePaymentRequired = () => {
      setIsPricingModalOpen(true);
      addToast('warning', 'Paiement Obligatoire', "L'accès à l'IA nécessite un forfait actif.");
    };

    window.addEventListener('businessai:payment_required', handlePaymentRequired);

    // Vérifier si retour après redirection de paiement réussie
    if (typeof window !== 'undefined' && window.location.search.includes('payment_success=true')) {
      addToast('info', 'Paiement reçu', 'Vérification du paiement sur le serveur...');
      setTimeout(syncServerSubscription, 1200);
      setTimeout(syncServerSubscription, 4000);
      setTimeout(syncServerSubscription, 8000);
    }

    // Polling d'état toutes les 45 secondes pour s'assurer de la validité continue
    const interval = setInterval(syncServerSubscription, 45000);
    return () => {
      window.removeEventListener('businessai:payment_required', handlePaymentRequired);
      clearInterval(interval);
    };
  }, []);

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

  const addInvoice = (invData: Omit<InvoiceDocument, 'id' | 'createdAt' | 'updatedAt'>): InvoiceDocument => {
    const newInv: InvoiceDocument = {
      ...invData,
      id: generateUniqueId('inv'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInvoices((prev) => [newInv, ...prev]);
    trackGrowthEvent('content_created');
    unlockBadge('first_content');
    addToast('success', `${newInv.type === 'quote' ? 'Devis' : 'Facture'} ${newInv.number} créé(e)`);
    return newInv;
  };

  const updateInvoice = (id: string, updates: Partial<InvoiceDocument>) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, ...updates, updatedAt: new Date().toISOString() } : inv
      )
    );
    addToast('info', 'Document mis à jour', 'Vos modifications ont été enregistrées.');
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    addToast('info', 'Document supprimé', 'Le document a été retiré de votre liste.');
  };

  const duplicateInvoice = (id: string): InvoiceDocument => {
    const original = invoices.find((i) => i.id === id);
    if (!original) throw new Error('Document introuvable');
    const prefix = original.type === 'quote' ? 'DEV' : 'FAC';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newDoc: InvoiceDocument = {
      ...original,
      id: generateUniqueId('inv'),
      number: `${prefix}-${new Date().getFullYear()}-${randomSuffix}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInvoices((prev) => [newDoc, ...prev]);
    addToast('success', 'Document dupliqué', `Nouveau document créé : ${newDoc.number}`);
    return newDoc;
  };

  const convertQuoteToInvoice = (quoteId: string): InvoiceDocument | null => {
    const quote = invoices.find((i) => i.id === quoteId);
    if (!quote) return null;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newInvoice: InvoiceDocument = {
      ...quote,
      id: generateUniqueId('inv'),
      type: 'invoice',
      number: `FAC-${new Date().getFullYear()}-${randomSuffix}`,
      status: 'pending',
      notes: `Facture issue du devis n° ${quote.number}. ${quote.notes || ''}`.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    updateInvoice(quoteId, { status: 'accepted' });
    addToast('success', 'Devis converti en facture !', `La facture ${newInvoice.number} est prête.`);
    return newInvoice;
  };

  const addCallSession = (sessionData: Omit<AICallSession, 'id' | 'createdAt'>): AICallSession => {
    const newSession: AICallSession = {
      ...sessionData,
      id: generateUniqueId('call'),
      createdAt: new Date().toISOString(),
    };
    setCallSessions((prev) => [newSession, ...prev]);
    trackGrowthEvent('content_created');
    unlockBadge('first_content');
    return newSession;
  };

  const updateCallSession = (id: string, updates: Partial<AICallSession>) => {
    setCallSessions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCallSession = (id: string) => {
    setCallSessions((prev) => prev.filter((c) => c.id !== id));
    addToast('info', 'Session d’appel supprimée');
  };

  const upgradePlan = (
    newPlan: UserPlan,
    paymentDetails?: { senderName?: string; senderPhone?: string; transactionRef?: string }
  ) => {
    const normPlan: PlanId = newPlan === 'premium' ? 'pro' : (newPlan as PlanId);
    const planConfig = getPlanConfig(normPlan);
    const monthlyLimit = planConfig.monthlyGenerations;
    const isPaid = normPlan !== 'free';

    const newReceipt: PurchaseReceipt = {
      receiptId: `REC-${OFFICIAL_PAYMENT_NUMBER}-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber: `CMD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      planId: normPlan,
      planName: planConfig.name,
      amount: planConfig.price,
      currency: 'FCFA',
      formattedAmount: planConfig.formattedPrice,
      buyerName: paymentDetails?.senderName || user.name || company.name || 'Client BusinessAI',
      buyerEmail: user.email || 'client@businessai.app',
      buyerPhone: paymentDetails?.senderPhone || company.whatsapp || company.phone || '+229 01 63 63 88 93',
      paymentNumber: OFFICIAL_PAYMENT_NUMBER,
      paymentMethod: 'Wave / Mobile Money Direct (0163638893)',
      purchasedAt: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'completed',
      priceLocked: true,
      priceLockGuarantee: `${planConfig.priceLockGuarantee || 'Tarif garanti bloqué à vie sans aucune augmentation'}`,
      transactionRef: paymentDetails?.transactionRef || `TRX-${OFFICIAL_PAYMENT_NUMBER}-${Date.now().toString().slice(-6)}`,
    };

    setUser((prev) => {
      // If staying or switching to free, keep used credits up to new limit
      const isSwitchToFree = normPlan === 'free';
      const creditsUsed = isSwitchToFree ? Math.min(prev.creditsUsed, monthlyLimit) : 0;
      const availableCredits = Math.max(0, monthlyLimit - creditsUsed);

      return {
        ...prev,
        plan: normPlan,
        isPurchased: isPaid,
        purchaseStatus: isPaid ? 'completed' : undefined,
        priceLocked: true,
        priceLockDate: prev.priceLockDate || new Date().toISOString(),
        activeReceipt: isPaid ? newReceipt : prev.activeReceipt,
        maxCredits: monthlyLimit,
        availableCredits,
        creditsUsed,
      };
    });

    setIsPricingModalOpen(false);

    addNotification(
      'reward',
      isPaid ? `Achat Confirmé • Forfait ${planConfig.name} Activé !` : `Forfait ${planConfig.name} Activé !`,
      isPaid
        ? `Félicitations ! Votre achat est confirmé et votre tarif est bloqué à vie. Vous disposez de ${planConfig.monthlyGenerations} générations IA par mois (${planConfig.formattedPrice}/mois).`
        : `Vous êtes sur le forfait Découverte gratuit (${planConfig.monthlyGenerations} générations/mois).`,
      'dashboard'
    );

    addToast(
      'success',
      isPaid ? `Achat validé • Prix bloqué à vie (${planConfig.name})` : `Forfait ${planConfig.name} activé !`,
      isPaid
        ? `Votre paiement au ${OFFICIAL_PAYMENT_NUMBER} a été enregistré avec succès. Tarif bloqué et ${planConfig.monthlyGenerations} générations IA débloquées.`
        : `Forfait Découverte activé avec ${planConfig.monthlyGenerations} générations IA par mois.`
    );
  };

  const consumeCredit = (cost: number = 1): boolean => {
    const planConfig = getPlanConfig(user.plan);

    // Free plan has 0 generations or unpaid: must pay first to use AI
    if (user.plan === 'free' || !user.isPurchased || user.maxCredits <= 0) {
      addToast(
        'warning',
        'Paiement requis pour débloquer l’IA',
        `L’accès aux générateurs et à l’Assistant IA requiert un forfait actif. Veuillez effectuer votre transfert au ${OFFICIAL_PAYMENT_NUMBER} (dès ${PRICING_PLANS.starter.formattedPrice}).`
      );
      openPaymentModal('starter');
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

        // Invoices & Quotes
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        duplicateInvoice,
        convertQuoteToInvoice,

        // AI Voice Calls
        callSessions,
        addCallSession,
        updateCallSession,
        deleteCallSession,

        user,
        serverSubscription,
        isCheckingServerSubscription,
        isCheckoutLoading,
        startLemonSqueezyCheckout,
        refreshSubscriptionStatus,
        submitActivationCode,
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
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        openReceiptModal,
        isCodeHubModalOpen,
        setIsCodeHubModalOpen,
        openCodeHubModal,
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

export const useAppContext = useApp;

