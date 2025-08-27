// src/lib/util/medusa-url.ts

/**
 * Resolves and normalizes the Medusa base URL from environment variables.
 * - Prepends 'https://' if the URL starts with '//'.
 * - Rejects relative paths.
 * - Returns null if the URL is missing or invalid.
 * @param envVar - The environment variable string (e.g., process.env.NEXT_PUBLIC_MEDUSA_URL).
 * @returns A normalized URL string or null.
 */
export function resolveMedusaUrl(envVar: string | undefined): string | null {
  if (!envVar) {
    console.warn("[medusa][config] NEXT_PUBLIC_MEDUSA_URL is missing.");
    return null;
  }

  let url = envVar.trim();

  // Prepend 'https://' if it starts with '//'
  if (url.startsWith('//')) {
    url = `https:${url}`;
  }

  // Ensure it's an absolute URL
  try {
    const parsedUrl = new URL(url);
    // Ensure it has a protocol and host
    if (!parsedUrl.protocol || !parsedUrl.host) {
      console.warn(`[medusa][config] Invalid Medusa URL (missing protocol or host): ${url}`);
      return null;
    }
    return parsedUrl.origin; // Return origin to ensure consistent base URL
  } catch (e) {
    console.warn(`[medusa][config] Invalid Medusa URL format: ${url} - ${e}`);
    return null;
  }
}