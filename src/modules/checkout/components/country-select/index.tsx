import { forwardRef, useImperativeHandle, useMemo, useRef, useState, useEffect } from "react"

import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
import { listRegions } from "@lib/data/regions";
import ReactCountryFlag from "react-country-flag"
import { StoreRegion, StoreRegionCountry } from "@medusajs/types" // Changed BaseRegionCountry to StoreRegionCountry

type Country = { iso_2: string; display_name: string } // Defined Country type

const CountrySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps
>(({ placeholder = "Country", defaultValue, ...props }, ref) => {
  const innerRef = useRef<HTMLSelectElement>(null)
  const [countryOptions, setCountryOptions] = useState<{ value: string; label: string }[]>([]);

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
    ref,
    () => innerRef.current
  )

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const regions = await listRegions();
        if (regions) {
          const countries: [string, StoreRegionCountry][] = regions.flatMap((region: StoreRegion) => region.countries || [])
            .filter((c): c is Required<StoreRegionCountry> => !!c.iso_2) // Filter out entries without iso_2
            .map((c) => [c.iso_2!, c]) // Use 'c' directly as it's already StoreRegionCountry

          const uniqueCountries = Array.from(new Map(countries).values());

          setCountryOptions(
            uniqueCountries
              .map((country) => ({
                value: country.iso_2 as string,
                label: country.display_name as string,
              }))
          );
        }
      } catch (error: unknown) {
        console.error("Error fetching countries for CountrySelect:", error);
      }
    };
    fetchCountries();
  }, []);

  return (
    <NativeSelect
      ref={innerRef}
      placeholder={placeholder}
      defaultValue={defaultValue}
      {...props}
    >
      {countryOptions?.map(({ value, label }, index) => (
        <option key={index} value={value}>
          {label}
        </option>
      ))}
    </NativeSelect>
  )
})

CountrySelect.displayName = "CountrySelect"

export default CountrySelect