"use client"

import React, { FC } from "react";
type ProductAddonsInfo = {
  productAddonTitle?: string;
  productAddonMessage?: string;
  productAddonDescription?: string;
  displayName?: string;
  imageUrl?: string;
  priceRangeDisplay?: {
    listPrices?: number[];
    currencySymbol?: string;
  };
};

type IknkProductAddonsProps = {
  productAddons: { productAddonsInfo?: ProductAddonsInfo };
};

const IknkProductAddons: FC<IknkProductAddonsProps> = ({
  productAddons,
}) => {
  if (!productAddons || !productAddons.productAddonsInfo) {
    return null;
  }

  const info = productAddons.productAddonsInfo;

  return (
    <div className="mt-8 p-4 border border-gray-200 rounded-md font-primary-thin">
      <h2 className="text-xl font-primary-thin uppercase tracking-widest mb-6">Product Add-ons</h2>

      <p className="text-gray-700 mb-4">
        This section is a placeholder for product add-ons. Below are some details about the available add-ons.
      </p>

      <div className="space-y-3">
        {info.productAddonTitle && (
          <p><span className="font-primary-rhroman">Title:</span> {info.productAddonTitle}</p>
        )}
        {info.productAddonMessage && (
          <p><span className="font-primary-rhroman">Message:</span> {info.productAddonMessage}</p>
        )}
        {info.productAddonDescription && (
          <p><span className="font-primary-rhroman">Description:</span> {info.productAddonDescription}</p>
        )}
        {info.displayName && (
          <p><span className="font-primary-rhroman">Display Name:</span> {info.displayName}</p>
        )}
        {info.imageUrl && (
          <div>
            <p className="font-primary-rhroman">Image:</p>
            <img src={info.imageUrl} alt={info.displayName} className="w-32 h-32 object-contain mt-2" />
          </div>
        )}
        {info.priceRangeDisplay && (
          <p><span className="font-primary-rhroman">Price:</span> {info.priceRangeDisplay.listPrices?.[0]} {info.priceRangeDisplay.currencySymbol}</p>
        )}
        {/* Add more fields as needed based on the RhProductAddons structure */}
      </div>
    </div>
  );
};

export default IknkProductAddons;