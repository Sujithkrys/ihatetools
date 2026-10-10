/**
 * Canonical production site domain.
 * Always resolves to https://ihatetools.in in production to avoid leaking
 * ephemeral preview URLs (e.g. *.vercel.app) to search engine crawlers.
 */
export const SITE_URL = 'https://ihatetools.in';

export function getBaseUrl(): string {
  // 1. If explicit env var is set and valid, prefer it (e.g. local overrides or custom staging)
  if (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim() !== '') {
    const custom = process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/+$/, '');
    // Guard against accidental preview URLs leaking into production
    if (!custom.includes('.vercel.app') || process.env.NODE_ENV !== 'production') {
      return custom;
    }
  }

  // 2. In local development without NEXT_PUBLIC_SITE_URL, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // 3. In production, ALWAYS default to canonical custom domain
  return SITE_URL;
}
