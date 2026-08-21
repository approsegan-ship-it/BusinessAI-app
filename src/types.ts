export type AppTab =
  | 'home'
  | 'dashboard'
  | 'assistant'
  | 'social'
  | 'products'
  | 'clients'
  | 'sales'
  | 'referrals'
  | 'earn_credits'
  | 'history'
  | 'profile'
  | 'pricing';

export type BusinessSector =
  | 'Boutique & Prêt-à-porter'
  | 'Restaurant & Alimentation'
  | 'E-commerce & Vente en ligne'
  | 'Artisanat & Fait-main'
  | 'Prestation de Services & B2B'
  | 'Beauté, Coiffure & Bien-être'
  | 'Immobilier & Travaux'
  | 'Autre Entreprise';

export type ToneStyle =
  | 'Professionnel et Chaleureux'
  | 'Dynamique et Vendeur'
  | 'Direct et Efficace'
  | 'Élégant et Haut de Gamme'
  | 'Familial et Accessible'
  | 'Humoristique et Décontracté';

export interface CompanyProfile {
  name: string;
  sector: BusinessSector;
  description: string;
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
  currency: string;
  defaultTone: ToneStyle;
  websiteOrSocial?: string;
  isProfileCompleted?: boolean;
  knowledgeBase?: string; // Mémorisation d'informations autorisées & directives d'entreprise
  targetAudienceDefault?: string;
}

export type UserPlan = 'free' | 'starter' | 'pro' | 'business' | 'premium';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface UserAccount {
  name: string;
  email: string;
  plan: UserPlan;
  creditsUsed: number;
  maxCredits: number;
  availableCredits: number;
  isLoggedIn: boolean;
  companyName?: string;
  referralCode: string;
  joinedAt?: string;
  teamMembers?: TeamMember[];
}

export type BadgeId =
  | 'first_content'
  | 'first_share'
  | 'first_referral'
  | 'three_referrals'
  | 'five_referrals'
  | 'profile_completed'
  | 'whatsapp_master'
  | 'power_seller';

export interface Badge {
  id: BadgeId;
  title: string;
  description: string;
  category: 'content' | 'growth' | 'profile';
  unlocked: boolean;
  unlockedAt?: string;
  rewardCredits: number;
}

export interface ReferralItem {
  id: string;
  referralCode: string;
  referredName: string;
  referredCompany?: string;
  date: string;
  status: 'pending' | 'active' | 'rewarded';
  creditsAwarded: number;
}

export interface RewardHistoryItem {
  id: string;
  date: string;
  action: string;
  credits: number;
  description: string;
}

export interface ReferralProgramState {
  code: string;
  link: string;
  totalInvited: number;
  activeInvited: number;
  totalCreditsEarned: number;
  referrals: ReferralItem[];
  history: RewardHistoryItem[];
}

export type NotificationType = 'credit' | 'reward' | 'referral' | 'feature' | 'tip';

export interface InAppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionTab?: AppTab;
}

export interface NotificationPreferences {
  credits: boolean;
  rewards: boolean;
  referrals: boolean;
  tips: boolean;
}

export interface GrowthAnalytics {
  contentsCreated: number;
  sharesDone: number;
  whatsappShares: number;
  referralClicks: number;
  referralSignups: number;
  creditsUsed: number;
  creditsEarned: number;
}

export interface OnboardingState {
  isCompleted: boolean;
  step: number;
  businessName?: string;
  sector?: BusinessSector;
  mainGoal?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isFallback?: boolean;
}

export interface SavedProduct {
  id: string;
  name: string;
  price: number | string;
  category: string;
  features: string;
  benefits: string;
  targetAudience: string;
  generatedTitle: string;
  generatedDescription: string;
  keyBulletPoints: string[];
  callToAction: string;
  createdAt: string;
}

export type HistoryCategory =
  | 'chat'
  | 'social'
  | 'product'
  | 'client_reply'
  | 'sales_tool'
  | 'viral_post';

export interface HistoryItem {
  id: string;
  type: HistoryCategory;
  title: string;
  inputSummary: string;
  output: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface SocialPostResults {
  facebook: string;
  instagram: string;
  whatsapp: string;
  adCopy: string;
  slogan: string;
}

export interface ClientReplyResult {
  scenario: string;
  clientName?: string;
  tone: string;
  replyText: string;
  whatsappDirectText: string;
  followUpTip?: string;
}

export interface MarginCalculation {
  costPrice: number;
  sellingPrice: number;
  marginAmount: number;
  marginPercent: number;
  markupPercent: number;
  vatRate: number;
  sellingPriceWithVat: number;
  advice: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

