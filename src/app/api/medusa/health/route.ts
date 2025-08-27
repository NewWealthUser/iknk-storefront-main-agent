// src/app/api/medusa/health/route.ts
import { NextResponse } from 'next/server';
import { resolveMedusaUrl } from '@lib/util/medusa-url';
import { fetchWithTimeout } from '@lib/util/fetch-with-timeout';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL;
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export async function GET() {
  const baseUrl = resolveMedusaUrl(MEDUSA_URL);

  if (!baseUrl) {
    return NextResponse.json({ ok: false, reason: "Medusa URL missing or invalid." }, { status: 500 });
  }

  if (!PUBLISHABLE_API_KEY) {
    return NextResponse.json({ ok: false, reason: "Medusa Publishable API Key missing." }, { status: 500 });
  }

  const healthCheckUrl = `${baseUrl}/store/regions`;
  try {
    const response = await fetchWithTimeout(healthCheckUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_API_KEY,
      },
    }, 3000); // Short timeout for health check

    if (response.ok) {
      return NextResponse.json({ ok: true, message: "Medusa backend is reachable." });
    } else {
      const errorText = await response.text();
      return NextResponse.json({ ok: false, reason: `Medusa responded with status ${response.status}: ${errorText}` }, { status: response.status });
    }
  } catch (error: any) {
    const reason = error?.name === 'AbortError'
      ? "Medusa health check timed out."
      : `Network error during health check: ${error.message || String(error)}`;
    return NextResponse.json({ ok: false, reason }, { status: 500 });
  }
}