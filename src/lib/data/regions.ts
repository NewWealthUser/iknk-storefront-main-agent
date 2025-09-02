"use server"

import { sdk } from "@lib/config" // Corrected import
import medusaError from "@lib/util/medusa-error" // Keep if still used, otherwise remove
import { HttpTypes } from "@medusajs/types"

export const listRegions = async (): Promise<HttpTypes.StoreRegion[]> => {
  try {
    const { regions } = await sdk.client.fetch<{ regions: HttpTypes.StoreRegion[] }>("/store/regions");
    return regions;
  } catch (error: any) {
    console.warn(`[regions][fallback] Failed to list regions: ${error.message || 'Unknown error'}`);
    return [];
  }
}

export const retrieveRegion = async (id: string): Promise<HttpTypes.StoreRegion | null> => {
  try {
    const { region } = await sdk.client.fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`);
    return region;
  } catch (error: any) {
    console.warn(`[regions][fallback] Failed to retrieve region '${id}': ${error.message || 'Unknown error'}`);
    return null;
  }
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