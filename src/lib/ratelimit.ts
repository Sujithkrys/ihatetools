import { Redis } from "@upstash/redis";

// Check if Upstash Redis credentials exist in environment
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = (url && token)
  ? new Redis({ url, token })
  : null;

// Helpers for rate-limit keys
export function getUtcDayKey(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Limits
export const LIMITS = {
  GLOBAL_DAILY_CAP: 1000, // Documented Gemini 1.5/2.0/2.5 Flash free tier is 1,500 RPD. 1,000 provides ~33% safety buffer.
  USER_DAILY_CAP: 8,      // 8 summaries per anonymous user cookie per day
  IP_DAILY_CAP: 15,       // 15 summaries per IP per day
  MAX_INPUT_CHARS: 3000,  // Max input length
  MAX_OUTPUT_TOKENS: 250, // Compact summary tokens
};
