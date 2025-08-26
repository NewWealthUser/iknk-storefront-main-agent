import { forwardRef, useImperativeHandle, useMemo, useRef, useState, useEffect } from "react"

import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
// import { HttpTypes } from "@medusajs/types" // Removed
import { listRegions } from "@lib/data/regions"; // Import listRegions
import ReactCountryFlag from "react-country-flag" // Added missing import

const CountrySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps & {
    // region?: HttpTypes.StoreRegion // Removed region prop
  }
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
          const allCountries = regions.flatMap(region => region.countries || []);
          const uniqueCountries = Array.from(new Map(allCountries.map(country => [country.iso_2, country])).values());
          setCountryOptions(
            uniqueCountries
              .filter((c) => !!c.iso_2 && !!c.display_name)
              .map((country) => ({
                value: country.iso_2 as string,
                label: country.display_name as string,
              }))
          );
        }
      } catch (error) {
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