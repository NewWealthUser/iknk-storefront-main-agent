"use server"

import { medusaGet, MedusaGetResult } from "@lib/medusa"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"

export const listRegions = async (): Promise<HttpTypes.StoreRegion[]> => {
  const res = await medusaGet<{ regions: HttpTypes.StoreRegion[] }>(
    `/store/regions`
  );
  if (!res.ok || !res.data?.regions) {
    console.warn(`[regions][fallback] Failed to list regions: ${res.error?.message || 'Unknown error'}`);
    return [];
  }
  return res.data.regions;
}

export const retrieveRegion = async (id: string): Promise<HttpTypes.StoreRegion | null> => {
  const res = await medusaGet<{ region: HttpTypes.StoreRegion }>(
    `/store/regions/${id}`
  );
  if (!res.ok || !res.data?.region) {
    console.warn(`[regions][fallback] Failed to retrieve region '${id}': ${res.error?.message || 'Not found or unknown error'}`);
    return null;
  }
  return res.data.region;
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string): Promise<HttpTypes.StoreRegion | null> => {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode) as HttpTypes.StoreRegion;
    }

    const regions = await listRegions();

    if (!regions || regions.length === 0) {
      return null;
    }

    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        if (c?.iso_2) {
          regionMap.set(c.iso_2, region);
        }
      });
    });

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us");

    return region || null;
  } catch (e: any) {
    console.error(`[regions][error] Error in getRegion: ${e.message}`);
    return null;
  }
}