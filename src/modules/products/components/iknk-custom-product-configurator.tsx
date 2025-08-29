"use client"

import React, { FC } from "react";
type CustomProductInformation = {
  customProductType?: string;
  shape?: string;
  minWidth?: number;
  maxWidth?: number;
  minLength?: number;
  maxLength?: number;
  minDiameter?: number;
  maxDiameter?: number;
  mountTypes?: { value?: string }[];
  controlTypes?: { value?: string }[];
};

type IknkCustomProductConfiguratorProps = {
  customProductOptions: { customProductInformation?: CustomProductInformation };
};

const IknkCustomProductConfigurator: FC<IknkCustomProductConfiguratorProps> = ({
  customProductOptions,
}) => {
  if (!customProductOptions || !customProductOptions.customProductInformation) {
    return null;
  }

  const info = customProductOptions.customProductInformation;

  return (
    <div className="mt-8 p-4 border border-gray-200 rounded-md font-primary-thin">
      <h2 className="text-xl font-primary-thin uppercase tracking-widest mb-6">Custom Product Configuration</h2>

      <p className="text-gray-700 mb-4">
        This section is a placeholder for a complex custom product configurator.
        Below are some key details about the custom options available for this product.
      </p>

      <div className="space-y-3">
        {info.customProductType && (
          <p><span className="font-primary-rhroman">Type:</span> {info.customProductType}</p>
        )}
        {info.shape && (
          <p><span className="font-primary-rhroman">Shape:</span> {info.shape}</p>
        )}
        {info.minWidth && info.maxWidth && (
          <p><span className="font-primary-rhroman">Width Range:</span> {info.minWidth} - {info.maxWidth}</p>
        )}
        {info.minLength && info.maxLength && (
          <p><span className="font-primary-rhroman">Length Range:</span> {info.minLength} - {info.maxLength}</p>
        )}
        {info.minDiameter && info.maxDiameter && (
          <p><span className="font-primary-rhroman">Diameter Range:</span> {info.minDiameter} - {info.maxDiameter}</p>
        )}
        {info.mountTypes && info.mountTypes.length > 0 && (
          <div>
            <p className="font-primary-rhroman">Mount Types:</p>
            <ul className="list-disc list-inside ml-4">
              {info.mountTypes.map((type: { value?: string }, index: number) => type.value && <li key={index}>{type.value}</li>)}
            </ul>
          </div>
        )}
        {info.controlTypes && info.controlTypes.length > 0 && (
          <div>
            <p className="font-primary-rhroman">Control Types:</p>
            <ul className="list-disc list-inside ml-4">
              {info.controlTypes.map((type: { value?: string }, index: number) => type.value && <li key={index}>{type.value}</li>)}
            </ul>
          </div>
        )}
        {/* Add more fields as needed based on the RhCustomProductOptions structure */}
      </div>
    </div>
  );
};

export default IknkCustomProductConfigurator;