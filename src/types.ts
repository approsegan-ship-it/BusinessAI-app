export type AppTab =
  | 'home'
  | 'dashboard'
  | 'assistant'
  | 'social'
  | 'video'
  | 'invoices'
  | 'ai_calls'
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
  | 'video'
  | 'invoice'
  | 'ai_call'
  | 'product'
  | 'client_reply'
  | 'sales_tool'
  | 'viral_post';

export interface VideoScene {
  sceneNumber: number;
  timeRange: string; // e.g. "00:00 - 00:04"
  durationSeconds: number;
  title: string;
  visualDescription: string;
  cameraDirection: string; // e.g. "Plan rapproché 45°", "Selfie dynamique", "Zoom avant fluide"
  voiceoverText: string; // Script voix-off mot à mot
  screenText: string; // Texte incrusté à l'écran / Captions
  soundEffectOrMusic: string; // Bruitage / Transition sonore
  visualThemeColor?: string; // Hex color code for preview
}

export type VideoFormat = 'tiktok_reels' | 'whatsapp_status' | 'feed_square' | 'youtube_landscape';
export type VideoObjective = 'product_demo' | 'flash_promo' | 'customer_review' | 'behind_scenes' | 'expert_tip' | 'new_launch';
export type VideoDuration = '15s' | '30s' | '60s';

export interface GeneratedVideoScript {
  id?: string;
  title: string;
  hook: string;
  duration: VideoDuration;
  format: VideoFormat;
  objective: VideoObjective;
  targetAudience: string;
  scenes: VideoScene[];
  totalDurationSeconds: number;
  voiceoverFullScript: string;
  recommendedMusic: {
    genre: string;
    mood: string;
    bpm: string;
    searchKeywords: string;
  };
  filmingTips: string[];
  captionAndHashtags: {
    postCaption: string;
    hashtags: string[];
    callToAction: string;
  };
  srtSubtitles: string;
  createdAt?: string;
}

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

// ==========================================
// DEVIS & FACTURES (Quotes & Invoices)
// ==========================================
export type InvoiceType = 'quote' | 'invoice'; // 'quote' = Devis / Proforma, 'invoice' = Facture
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'accepted' | 'cancelled' | 'pending';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g. 0 or 18%
  total: number;
}

export interface InvoiceDocument {
  id: string;
  type: InvoiceType;
  number: string; // e.g. DEV-2026-001 or FAC-2026-001
  date: string;
  dueDate: string;
  clientName: string;
  clientCompany?: string;
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;
  items: InvoiceItem[];
  discountType?: 'percent' | 'fixed';
  discountValue?: number;
  taxRate?: number; // Global tax rate
  notes?: string;
  paymentTerms?: string;
  paymentDetails?: {
    mobileMoneyNumber?: string;
    mobileMoneyProvider?: string; // Wave, Orange Money, MTN MoMo, Moov
    bankName?: string;
    ibanOrRib?: string;
  };
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// APPELS VOCAUX IA (AI Calling Agent)
// ==========================================
export type CallScenario =
  | 'payment_reminder'       // Relance facture impayée ou devis en attente
  | 'order_confirmation'     // Confirmation de commande & créneau de livraison
  | 'quote_followup'        // Relance de devis & proposition commerciale
  | 'delivery_scheduling'   // Planification de livraison coursier
  | 'customer_satisfaction' // Enquête de satisfaction & avis client
  | 'vip_offer'             // Offre promotionnelle personnalisée VIP
  | 'appointment_reminder'  // Rappel de rendez-vous
  | 'custom';               // Objectif sur mesure

export type CallTone =
  | 'friendly_warm'         // Chaleureux, bienveillant & accueillant
  | 'professional_firm'     // Professionnel, courtois mais ferme (recouvrement)
  | 'dynamic_sales'         // Dynamique, enthousiaste & vendeur
  | 'polite_respectful';    // Très poli, respectueux et posé

export interface VoicePersona {
  id: string;
  name: string;
  role: string;
  gender: 'female' | 'male';
  accentDesc: string;
  pitch: number;
  rate: number;
  avatarColor: string;
  sampleGreeting: string;
}

export interface CallTurn {
  speaker: 'ai' | 'customer';
  text: string;
  suggestedCustomerReplies?: string[];
  timestamp?: string;
}

export interface AICallSession {
  id: string;
  contactName: string;
  contactPhone: string;
  contactCompany?: string;
  scenario: CallScenario;
  voicePersonaId: string;
  documentRef?: string; // Lié à un Devis ou une Facture
  amountDue?: number;
  objective: string;
  customDetails?: string;
  turns: CallTurn[];
  fullScript: string;
  whatsappFollowUpMessage: string;
  status: 'ready' | 'in_progress' | 'completed' | 'unanswered' | 'transferred';
  durationSeconds: number;
  notes?: string;
  createdAt: string;
}


