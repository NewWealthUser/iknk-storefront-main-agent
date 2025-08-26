import React, { FC } from "react";
import clsx from "clsx";
import RHImageV2 from "next/image"; // Placeholder replaced with Next.js Image
import { RhSwatch } from "@lib/util/rh-product-adapter";

interface ProductGridSwatchOptionsProps {
  swatchesToDisplay?: RhSwatch[];
  selectedSwatch: string | null;
  selectedSwatchIdx: number;
  isSwatchSelected: boolean;
  setIsSwatchSelected: React.Dispatch<React.SetStateAction<boolean>>;
  onSwatchClickHandler: (
    e: React.MouseEvent | null,
    index: number,
    swatch: RhSwatch | undefined,
    disableProductCall?: boolean
  ) => void;
  isSwatchFinish: boolean;
  swatchAriaLabel: (swatchName: string | undefined) => string;
}

const ProductGridSwatchOptions: FC<ProductGridSwatchOptionsProps> = ({
  swatchesToDisplay,
  selectedSwatch,
  selectedSwatchIdx,
  isSwatchSelected,
  setIsSwatchSelected,
  onSwatchClickHandler,
  isSwatchFinish,
  swatchAriaLabel,
}) => {
  return (
    <div className="flex grow flex-col justify-end">
      <div
        className={clsx(
          `mt-[20px] grid auto-cols-max grid-flow-col !gap-[3px] gap-x-0.5 md:mt-4 lg:mt-5`,
          {
            "mx-auto  place-content-center": true, // Assuming rhr is true for this context
            "place-content-start": false,
          }
        )}
      >
        {swatchesToDisplay?.slice(0, 6)?.map((swatch, index) => {
          const showUnderline =
            (selectedSwatch === swatch?.swatchId || isSwatchSelected) &&
            selectedSwatchIdx === index;

          return (
            <div
              className="inline-flex flex-col"
              key={`swatch-${swatch?.swatchId || index}`}
            >
              <button
                className="inline-block aspect-[2/1] !h-3 !p-0 sm:aspect-[2.5/1] lg:!h-4 xl:!h-5"
                aria-label={`${swatchAriaLabel(swatch?.title)}`} // Changed from swatch?.displayName
                onClick={(e) => {
                  setIsSwatchSelected(true);
                  onSwatchClickHandler(e, index, swatch);
                }}
              >
                <RHImageV2
                  src={swatch.imageUrl || ""} // Ensure src is string
                  alt={swatchAriaLabel(swatch?.title)} // Changed from swatch?.displayName
                  width={100} // Added width
                  height={50} // Added height
                />
              </button>
              <div
                className={clsx([
                  `!mt-[3px] !h-[0.03rem] !border-black !px-[1px] !py-0`,
                  showUnderline ? "" : "opacity-0",
                ])}
                style={{
                  border: "0.5px solid",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGridSwatchOptions;