/**
 * Lemon Squeezy & Server Subscription Service
 * Interfaces with the secure backend endpoints to initiate checkouts,
 * verify transactions and synchronize subscription state.
 */

import { getAuthHeaders, getClientUserId } from '../utils/userId';
import { ServerSubscriptionStatus, UserPlan } from '../types';

export interface CheckoutResponse {
  checkoutUrl?: string;
  error?: string;
  requiresConfig?: boolean;
  missingEnv?: string[];
  plan?: string;
}

/**
 * Initiates a Lemon Squeezy checkout session on the server.
 * The server securely looks up the pre-configured Variant ID from environment variables.
 * The frontend NEVER supplies or chooses prices or variant IDs.
 */
export async function createLemonSqueezyCheckout(
  planId: 'starter' | 'pro' | 'business',
  userEmail?: string,
  userName?: string
): Promise<CheckoutResponse> {
  const userId = getClientUserId();

  try {
    const response = await fetch('/api/payments/lemonsqueezy/create-checkout', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        planId,
        userEmail,
        userName,
        userId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || `Erreur serveur HTTP ${response.status}`,
        requiresConfig: Boolean(data.requiresConfig),
        missingEnv: data.missingEnv || [],
        plan: planId,
      };
    }

    return data;
  } catch (err: any) {
    return {
      error: err?.message || 'Impossible de contacter le serveur de paiement.',
      plan: planId,
    };
  }
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
 * Allows verification of an order ID with Lemon Squeezy directly (fallback).
 */
export async function verifyLemonSqueezyOrder(orderId: string): Promise<{
  success: boolean;
  plan?: UserPlan;
  error?: string;
}> {
  try {
    const response = await fetch('/api/payments/lemonsqueezy/verify-order', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        orderId,
        userId: getClientUserId(),
      }),
    });

    return await response.json();
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Erreur lors de la vérification de la commande.',
    };
  }
}

/**
 * Validates an activation code on the server and unlocks subscription.
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

