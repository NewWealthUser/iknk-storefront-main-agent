"use client"

import React, { FC } from "react";
import { RhProduct, RhSwatch, RhSwatchGroup } from "@lib/util/rh-product-adapter";

type IknkSwatchSelectorProps = {
  product: RhProduct;
  onOptionChange: (optionId: string, value: string) => void;
  selectedOptions: Record<string, string | undefined>;
};

const IknkSwatchSelector: FC<IknkSwatchSelectorProps> = ({
  product,
  onOptionChange,
  selectedOptions,
}) => {
  if (!product.swatchData) {
    return null;
  }

  const renderSwatch = (swatch: RhSwatch) => {
    // Use swatchId as the optionId and swatch.title as the value
    const optionId = swatch.swatchId || swatch.title || '';
    const value = swatch.title || swatch.swatchId || '';
    const isSelected = selectedOptions[optionId] === value;

    const style: React.CSSProperties = {};
    let content: React.ReactNode = null;

    if (swatch.swatchHexCode) {
      style.backgroundColor = swatch.swatchHexCode;
    } else if (swatch.imageUrl) {
      style.backgroundImage = `url(${swatch.imageUrl})`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = 'center';
    } else {
      // Fallback for text swatches
      content = swatch.title?.charAt(0).toUpperCase();
      style.backgroundColor = '#f0f0f0'; // Light gray background for text swatches
      style.color = '#333';
    }

    return (
      <button
        key={optionId}
        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-semibold uppercase
          ${isSelected ? 'border-black ring-2 ring-black' : 'border-gray-300 hover:border-gray-500'}
          transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
        style={style}
        onClick={() => onOptionChange(optionId, value)}
        title={swatch.title}
        aria-pressed={isSelected}
      >
        {content}
      </button>
    );
  };

  const renderSwatchGroup = (group: RhSwatchGroup) => (
    <div key={group.swatchGroupName} className="mb-6">
      <h3 className="text-lg font-primary-rhroman mb-3 uppercase tracking-wider">{group.swatchGroupName}</h3>
      <div className="flex flex-wrap gap-3">
        {group.stockedSwatches?.map(renderSwatch)}
        {group.customSwatches?.map(renderSwatch)}
      </div>
    </div>
  );

  return (
    <div className="mt-8 p-4 border border-gray-200 rounded-md">
      <h2 className="text-xl font-primary-thin uppercase tracking-widest mb-6">Available Options</h2>
      {product.swatchData.swatchGroups?.map(renderSwatchGroup)}
      {product.swatchData.finishSwatchGroups?.map(renderSwatchGroup)}
    </div>
  );
};

export default IknkSwatchSelector;