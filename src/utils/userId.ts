/**
 * Client Identity & Authentication Header Utilities
 * Ensures every browser session has a persistent, unique user identifier
 * that is sent to the backend for server-side subscription validation.
 */

const STORAGE_KEY = 'businessai_client_id';

export function getClientUserId(): string {
  if (typeof window === 'undefined') {
    return 'usr_anonymous_server';
  }

  let id = localStorage.getItem(STORAGE_KEY);
  if (!id || !id.startsWith('usr_')) {
    id = 'usr_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Ignore storage errors in restricted iframes
    }
  }
  return id;
}

export function getAuthHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-user-id': getClientUserId(),
  };
}
