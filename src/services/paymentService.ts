/**
 * Payment & Subscription Service
 * - Option 1 : Moov Money / MTN (Kkiapay) - 10.000F (Bénin, Togo, Sénégal)
 * - Option 2 : Carte Visa (Gumroad) - $20 (France, USA, International)
 * - Lemon Squeezy : Déconnecté
 */
import { getAuthHeaders, getClientUserId } from '../utils/userId';
import { ServerSubscriptionStatus, UserPlan } from '../types';

export const PAYMENT_CHANNELS = {
  kkiapay: {
    id: 'kkiapay',
    title: 'Moov Money / MTN (Kkiapay) - 10.000F',
    subtitle: 'Pour tes clients du Bénin, Togo, Sénégal',
    amount: 10000,
    currency: 'FCFA',
    displayPrice: '10.000F',
    countries: ['Bénin 🇧🇯', 'Togo 🇹🇬', 'Sénégal 🇸🇳', 'Côte d’Ivoire 🇨🇮'],
    methods: ['Moov Money (Flooz)', 'MTN Mobile Money', 'Celtiis Cash', 'Wave', 'Orange Money'],
    url: (import.meta as any).env?.VITE_KKIAPAY_URL || 'https://pay.kkiapay.me/',
    publicKey: (import.meta as any).env?.VITE_KKIAPAY_PUBLIC_KEY || '',
  },
  gumroad: {
    id: 'gumroad',
    title: 'Carte Visa (Gumroad) - $20',
    subtitle: 'Pour les clients en France, USA',
    amount: 20,
    currency: 'USD',
    displayPrice: '$20',
    countries: ['France 🇫🇷', 'USA 🇺🇸', 'Europe 🇪🇺', 'International 🌍'],
    methods: ['Carte Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'PayPal'],
    url: (import.meta as any).env?.VITE_GUMROAD_URL || 'https://gumroad.com/',
  },
  support: {
    whatsappDisplay: '+229 01 63 63 88 93',
    whatsappRaw: '2290163638893',
  },
};

export interface CheckoutResponse {
  checkoutUrl?: string;
  error?: string;
  requiresConfig?: boolean;
  missingEnv?: string[];
  plan?: string;
}

/**
 * Lemon Squeezy est déconnecté.
 * Redirige vers Kkiapay ou Gumroad selon le contexte.
 */
export async function createLemonSqueezyCheckout(
  planId: 'starter' | 'pro' | 'business',
  _userEmail?: string,
  _userName?: string
): Promise<CheckoutResponse> {
  return {
    error: 'Lemon Squeezy a été déconnecté. Veuillez utiliser le Bouton 1 (Kkiapay - Moov/MTN - 10.000F) ou le Bouton 2 (Gumroad - Carte Visa - $20).',
    checkoutUrl: PAYMENT_CHANNELS.kkiapay.url,
    plan: planId,
  };
}

/**
 * Lance le paiement Kkiapay (Moov Money / MTN - 10.000F).
 * Si le SDK JS Kkiapay est chargé, ouvre la popup widget, sinon ouvre le lien sécurisé.
 */
export function openKkiapayPayment(options?: {
  amount?: number;
  email?: string;
  name?: string;
  phone?: string;
  onSuccess?: (response: any) => void;
}) {
  const amount = options?.amount || PAYMENT_CHANNELS.kkiapay.amount;
  const kkiapayWindow = window as any;

  if (typeof kkiapayWindow.openKkiapayWidget === 'function') {
    try {
      kkiapayWindow.openKkiapayWidget({
        amount,
        position: 'center',
        callback: '',
        data: { source: 'businessai_app' },
        theme: '#4f46e5',
        key: PAYMENT_CHANNELS.kkiapay.publicKey || 'kkiapay_live_key',
        sandbox: false,
        name: options?.name || '',
        email: options?.email || '',
        phone: options?.phone || '',
      });

      if (options?.onSuccess && typeof kkiapayWindow.addSuccessListener === 'function') {
        kkiapayWindow.addSuccessListener(options.onSuccess);
      }
      return;
    } catch (e) {
      console.warn('[Kkiapay] Widget error, falling back to direct URL:', e);
    }
  }

  // Fallback vers l'URL Kkiapay
  window.open(PAYMENT_CHANNELS.kkiapay.url, '_blank', 'noopener,noreferrer');
}

/**
 * Lance le paiement Gumroad ($20 - Carte Visa).
 */
export function openGumroadPayment() {
  window.open(PAYMENT_CHANNELS.gumroad.url, '_blank', 'noopener,noreferrer');
}

/**
 * Retrieves the authoritative subscription status from the backend.
 */
export async function fetchServerSubscriptionStatus(): Promise<ServerSubscriptionStatus | null> {
  try {
    const response = await fetch('/api/subscription/status', {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (err) {
    console.warn('[PaymentService] Erreur récupération statut abonnement:', err);
    return null;
  }
}

/**
 * Allows verification of an order ID (fallback).
 */
export async function verifyLemonSqueezyOrder(orderId: string): Promise<{
  success: boolean;
  plan?: UserPlan;
  error?: string;
}> {
  return {
    success: false,
    error: 'Lemon Squeezy est déconnecté. Veuillez entrer votre code d’activation Kkiapay ou Gumroad.',
  };
}

/**
 * Validates an activation code on the server and unlocks subscription.
 * Accepts Kkiapay transactions, Gumroad licenses, and secret codes.
 */
export async function activateSubscriptionCode(
  code: string,
  userName?: string,
  userEmail?: string
): Promise<{
  success: boolean;
  plan?: UserPlan;
  label?: string;
  message?: string;
  error?: string;
}> {
  try {
    const response = await fetch('/api/subscription/activate-code', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        code,
        userName,
        userEmail,
        userId: getClientUserId(),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Code d'activation invalide (HTTP ${response.status})`,
      };
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Impossible de contacter le serveur de validation.',
    };
  }
}

/**
 * Activates the 7-day free trial on the server.
 */
export async function startFreeTrial(
  userName?: string,
  userEmail?: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  plan?: UserPlan;
  isTrial?: boolean;
  daysRemaining?: number;
  expiresAt?: string;
}> {
  try {
    const response = await fetch('/api/subscription/start-free-trial', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        userName,
        userEmail,
        userId: getClientUserId(),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Impossible d'activer l'essai gratuit (HTTP ${response.status})`,
      };
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Impossible de contacter le serveur pour activer l’essai gratuit.',
    };
  }
}
