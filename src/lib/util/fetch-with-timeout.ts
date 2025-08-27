// src/lib/util/fetch-with-timeout.ts

/**
 * Performs a fetch request with a configurable timeout.
 * @param input - The RequestInfo or URL.
 * @param init - The RequestInit options.
 * @param timeoutMs - The timeout in milliseconds.
 * @returns The Response object.
 * @throws AbortError if the request times out.
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs: number = 6000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    throw error; // Re-throw the original error (e.g., AbortError, TypeError)
  }
}