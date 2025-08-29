"use client"

import React, { FC } from "react";
type PersonalizeInfo = {
  description?: string;
  monogrammable?: boolean;
  personalizable?: boolean;
  waiveMonogramFee?: boolean;
  features?: string[];
  styles?: { image?: string; displayName?: string; id?: string }[];
  fonts?: { image?: string; displayName?: string; id?: string }[];
  colors?: { image?: string; displayName?: string; id?: string }[];
};

type IknkPersonalizationOptionsProps = {
  personalizeInfo: PersonalizeInfo;
};

const IknkPersonalizationOptions: FC<IknkPersonalizationOptionsProps> = ({
  personalizeInfo,
}) => {
  if (!personalizeInfo) {
    return null;
  }

  const renderImageOption = (item: { image?: string; displayName?: string; id?: string }) => (
    <div key={item.id} className="flex flex-col items-center text-center p-2 border border-gray-200 rounded-md transition-colors duration-200 hover:border-black">
      {item.image && <img src={item.image} alt={item.displayName} className="w-16 h-16 object-contain mb-2" />}
      <p className="text-sm font-primary-rhroman">{item.displayName}</p>
    </div>
  );

  const renderColorOption = (item: { image?: string; displayName?: string; id?: string }) => (
    <div key={item.id} className="flex flex-col items-center text-center p-2 border border-gray-200 rounded-md transition-colors duration-200 hover:border-black">
      {item.image && <img src={item.image} alt={item.displayName} className="w-10 h-10 rounded-full object-cover mb-2" />}
      <p className="text-sm font-primary-rhroman">{item.displayName}</p>
    </div>
  );

  return (
    <div className="mt-8 p-4 border border-gray-200 rounded-md font-primary-thin">
      <h2 className="text-xl font-primary-thin uppercase tracking-widest mb-6">Personalization Options</h2>

      {personalizeInfo.description && (
        <p className="mb-4 text-gray-700">{personalizeInfo.description}</p>
      )}

      {(personalizeInfo.monogrammable || personalizeInfo.personalizable || personalizeInfo.waiveMonogramFee) && (
        <div className="mb-4 space-y-2">
          {personalizeInfo.monogrammable && (
            <p className="text-gray-700"><span className="font-primary-rhroman">•</span> This product is monogrammable.</p>
          )}
          {personalizeInfo.personalizable && (
            <p className="text-gray-700"><span className="font-primary-rhroman">•</span> This product is personalizable.</p>
          )}
          {personalizeInfo.waiveMonogramFee && (
            <p className="text-gray-700"><span className="font-primary-rhroman">•</span> Monogram fee will be waived.</p>
          )}
        </div>
      )}

      {personalizeInfo.features && personalizeInfo.features.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-primary-rhroman mb-3 uppercase tracking-wider">Features:</h3>
          <ul className="list-none space-y-1">
            {personalizeInfo.features.map((feature: string, index: number) => (
              <li key={index} className="text-gray-700"><span className="font-primary-rhroman">•</span> {feature}</li>
            ))}
          </ul>
        </div>
      )}

      {personalizeInfo.styles && personalizeInfo.styles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-primary-rhroman mb-3 uppercase tracking-wider">Styles:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {personalizeInfo.styles.map(renderImageOption)}
          </div>
        </div>
      )}

      {personalizeInfo.fonts && personalizeInfo.fonts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-primary-rhroman mb-3 uppercase tracking-wider">Fonts:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {personalizeInfo.fonts.map(renderImageOption)}
          </div>
        </div>
      )}

      {personalizeInfo.colors && personalizeInfo.colors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-primary-rhroman mb-3 uppercase tracking-wider">Colors:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {personalizeInfo.colors.map(renderColorOption)}
          </div>
        </div>
      )}
    </div>
  );
};

export default IknkPersonalizationOptions;