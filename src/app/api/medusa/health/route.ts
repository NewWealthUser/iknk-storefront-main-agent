// src/app/api/medusa/health/route.ts
import { NextResponse } from 'next/server';
import { sdk } from '@lib/config'; // Import sdk

export async function GET() {
  try {
    // Use the SDK to list regions as a health check
    const { regions } = await sdk.store.region.list();

    if (regions && regions.length > 0) {
      return NextResponse.json({ ok: true, message: "Medusa backend is reachable and regions are available." });
    } else {
      return NextResponse.json({ ok: false, reason: "Medusa backend is reachable but no regions found." }, { status: 500 });
    }
  } catch (error: any) {
    const reason = error?.name === 'AbortError'
      ? "Medusa health check timed out."
      : `Network error during health check: ${error.message || String(error)}`;
    return NextResponse.json({ ok: false, reason }, { status: 500 });
  }
}