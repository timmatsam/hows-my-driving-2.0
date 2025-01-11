import { env } from "@/env";

export function getBaseUrl() {
  // Check if in production or preview deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local development
  return env.APP_URL;
}
