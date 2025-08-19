"use server"

import { medusaGet } from "@lib/medusa"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types" // Removed StoreCountry from direct import

export const listRegions = async () => {
  const { regions } = await medusaGet<{ regions: HttpTypes.StoreRegion[] }>(
    `/store/regions`
  ).catch(medusaError)
  return regions
}

export const retrieveRegion = async (id: string) => {
  const { region } = await medusaGet<{ region: HttpTypes.StoreRegion }>(
    `/store/regions/${id}`
  ).catch(medusaError)
  return region
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string) => {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    const regions = await listRegions()

    if (!regions) {
      return null
    }

    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c: HttpTypes.StoreCountry) => { // Corrected type usage
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us")

    return region
  } catch (e: any) {
    return null
  }
}