import { HttpTypes } from "@medusajs/types";

// Define the RH.COM-like product structure based on our analysis of RH.COM GraphQL fragments
// This interface will represent the target shape for our adapter.
export interface RhProduct {
  // From BaseProductFields / StoreProduct
  id: string;
  displayName: string; // Maps to Medusa's title
  handle?: string; // Added handle property
  productDescription?: string; // Maps to Medusa's description
  imageUrl?: string; // Maps to Medusa's images[0].url
  alternateImages?: RhImage[]; // Maps to Medusa's images array

  // From Sku / PriceRangeDisplay
  onSale?: boolean; // Derived from Medusa's calculated_price
  instock?: { // Derived from Medusa's inventory_quantity
    hasInStock: boolean;
    showInStockButton: boolean;
    showInStockMessage: boolean;
  };
  priceRangeDisplay?: RhPriceRangeDisplay; // Derived from Medusa's calculated_price and metadata
  skuPriceInfo?: RhSkuPriceInfo; // Derived from Medusa's calculated_price

  // From ProductFields / Swatch / PersonalizeInfo
  personalizeInfo?: RhPersonalizeInfo; // Stored in Medusa's metadata
  swatchData?: RhSwatchData; // Stored in Medusa's metadata
  customProductOptions?: RhCustomProductOptions; // Stored in Medusa's metadata

  // From ProductAddons
  productAddons?: RhProductAddons; // Stored in Medusa's metadata

  // Other RH.COM specific fields, stored in Medusa's metadata
  videoUrl?: string;
  dimensions?: RhDimensions;
  careInstructions?: string;
  designerName?: string;
  romanceHeader?: string;
  romanceSubheader?: string;
  romanceBody?: string;
  ctaLinks?: RhCtaLink[];
  metadata?: {
    pgCropRules?: any;
    rhr?: boolean;
    anchor?: string;
    isShopByRoom?: boolean;
    imageContainerStyle?: any;
    imageStyle?: any;
    [key: string]: any; // Allow for other properties within metadata
  };
  loader?: boolean; // Added for ProductGridItem
  fullSkuId?: string; // Added fullSkuId
  [key: string]: any; // Allow for other properties from metadata
}

export interface RhImage {
  imageUrl: string;
  caption?: string;
  video?: boolean;
  sbrId?: string;
  autoplay?: boolean;
  lifestyleImage?: boolean;
  sliderCss?: string;
  altText?: string;
}

export interface RhPriceRangeDisplay {
  isUnavailable?: boolean;
  showMemberPrice?: boolean;
  skulowestMemberPrice?: number;
  nextGenDriven?: boolean;
  nextGenDrivenOnSale?: boolean;
  listPrices?: (number | null)[];
  memberPrices?: (number | null)[];
  currencySymbol?: string;
  overridePriceLabel?: string;
  upsellIds?: string[];
  saleInfo?: {
    percentSaleSkus?: number;
    showSaleMessage?: boolean;
    memberSavings?: {
      memberSavingsMin?: number;
      memberSavingsMax?: number;
    };
  };
}

export interface RhSkuPriceInfo {
  currencySymbol?: string;
  listPrice?: number;
  salePrice?: number;
  memberPrice?: number;
  tradePrice?: number;
  contractPrice?: number;
  memberOriginalPrice?: number;
  nextgenDriven?: boolean;
  onSale?: boolean;
  showMemberPrice?: boolean;
  customProductErrorCode?: string;
  sendCwCustomProductCode?: boolean;
}

export interface RhPersonalizeInfo {
  description?: string;
  features?: string[];
  monogrammable?: boolean;
  personalizable?: boolean;
  waiveMonogramFee?: boolean;
  styles?: RhPersonalizeStyle[];
  fonts?: RhPersonalizeFont[];
  colors?: RhPersonalizeColor[];
}

export interface RhPersonalizeStyle {
  image?: string;
  previewImage?: string;
  displayName?: string;
  id?: string;
  minLength?: number;
  maxLength?: number;
  numberOfLines?: number;
}

export interface RhPersonalizeFont {
  image?: string;
  previewImage?: string;
  displayName?: string;
  id?: string;
  borders?: RhPersonalizeBorder[];
}

export interface RhPersonalizeBorder {
  image?: string;
  minLength?: number;
  maxLength?: number;
  numberOfLines?: number;
  id?: string;
  displayName?: string;
}

export interface RhPersonalizeColor {
  image?: string;
  id?: string;
  displayName?: string;
}

export interface RhSwatchData {
  productId?: string;
  adapter?: string;
  splitDisplay?: boolean;
  faceoutSwatchId?: string;
  swatchGroups?: RhSwatchGroup[];
  finishSwatchGroups?: RhSwatchGroup[];
}

export interface RhSwatchGroup {
  swatchGroupName?: string;
  groupMaterial?: string;
  groupMaterialTranslated?: string;
  swatchGroupIndex?: number;
  sortPriority?: number;
  stockedSwatches?: RhSwatch[];
  customSwatches?: RhSwatch[];
}

export interface RhSwatch {
  swatchId?: string;
  title?: string;
  sortPriority?: number;
  swatchGroupIndex?: number;
  swatchGroupName?: string;
  details?: string;
  colorize?: boolean;
  imageUrl?: string;
  primaryOptionId?: string;
  secondaryOptionId?: string;
  featuredPallete?: boolean;
  swatchType?: string;
  relatedSwatchBeans?: RhSwatch[];
  optionCopy?: string;
  instructionsTitle?: string;
  instructionsCopy?: string;
  optionConstruction?: string;
  id?: string;
  swatchSkuIds?: {
    skuIds?: string[];
    swatchProductId?: string;
  }[];
  options?: {
    id?: string;
    label?: string;
    optionType?: string;
    sortPriority?: number;
  }[];
  flatSwatchImage?: {
    url?: string;
  };
  swatchImageSm?: {
    url?: string;
    width?: number;
    height?: number;
  };
  swatchImageLg?: {
    url?: string;
    width?: number;
    height?: number;
  };
  onSale?: boolean;
  stocked?: boolean;
  swatchTextHexCode?: string;
  swatchHexCode?: string;
}

export interface RhCustomProductOptions {
  customProductInformation?: {
    customProductType?: string;
    cwCustomProductCode?: string;
    maxWidth?: number;
    maxLength?: number;
    minWidth?: number;
    minLength?: number;
    minDiameter?: number;
    maxDiameter?: number;
    maxControlLength?: number;
    minControlLength?: number;
    widthFractionGap?: number;
    lengthFractionGap?: number;
    diameterFractionGap?: number;
    shape?: string;
    showSizeDropDown?: boolean;
    type?: string;
    mountTypes?: { id?: string; value?: string; status?: string; message?: string; code?: string; }[];
    controlTypes?: { id?: string; value?: string; status?: string; message?: string; continuousLoop?: boolean; motorized?: boolean; }[];
    panels?: { id?: string; value?: string; status?: string; message?: string; code?: string; }[];
    linings?: { id?: string; value?: string; status?: string; message?: string; }[];
    controlPositions?: { id?: string; value?: string; status?: string; message?: string; }[];
    rollTypes?: { id?: string; value?: string; status?: string; message?: string; }[];
    bracketColors?: { id?: string; value?: string; status?: string; message?: string; }[];
    controlsAndTilts?: { id?: string; value?: string; status?: string; message?: string; }[];
    tiltTypes?: { id?: string; value?: string; status?: string; message?: string; continuousLoop?: boolean; motorized?: boolean; }[];
    rugTrims?: { id?: string; value?: string; status?: string; message?: string; code?: string; }[];
    finish?: { id?: string; value?: string; status?: string; message?: string; }[];
  };
}

export interface RhProductAddons {
  productAddonsInfo?: {
    id?: string;
    imageUrl?: string;
    productAddonTitle?: string;
    productAddonMessage?: string;
    productAddonDescription?: string;
    displayName?: string;
    isActive?: boolean;
    saleInfo?: {
      percentSaleSkus?: number;
      showSaleMessage?: boolean;
      memberSavings?: {
        memberSavingsMin?: number;
        memberSavingsMax?: number;
      };
    };
    priceRangeDisplay?: RhPriceRangeDisplay;
    productLineItem?: {
      availableOptions?: {
        type?: string;
        sortPriority?: number;
        optionTypeId?: string;
        options?: {
          id?: string;
          type?: string;
          value?: string;
          sortPriority?: number;
          status?: string;
          message?: string;
          operationType?: string;
          name?: string;
        }[];
      }[];
      image?: {
        productId?: string;
        imageUrl?: string;
      };
    };
  };
}

export interface RhDimensions {
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
}

export interface RhCtaLink {
  layerType?: string;
  label?: string;
  leftCoordinate?: number;
  topCoordinate?: number;
  flyoutDirection?: string;
  htmlText?: string;
  shortText?: string;
  link?: string;
  modal?: string;
  path?: string;
}

export interface RhOption {
  id: string;
  title: string;
  values: { id: string; value: string }[];
}

export interface RhVariant {
  id: string;
  title?: string;
  sku?: string;
  inventory_quantity?: number;
  manage_inventory?: boolean;
  allow_backorder?: boolean;
  options?: { id?: string; value?: string }[];
  calculated_price?: number | null;
  original_price?: number | null;
  original_price_includes_tax?: boolean | null;
  currency_code?: string;
  images?: { id: string; url: string }[];
}

export function adaptMedusaProductToRhProduct(medusaProduct: HttpTypes.StoreProduct): RhProduct {
  const rhProduct: RhProduct = {
    id: medusaProduct.id,
    displayName: medusaProduct.title,
    handle: medusaProduct.handle, // Mapped handle property
    productDescription: medusaProduct.description || undefined,
    imageUrl: medusaProduct.images?.[0]?.url || undefined,
    alternateImages: medusaProduct.images?.map(img => ({
      id: img.id,
      imageUrl: img.url || '',
    })),
    // Initialize complex objects from metadata if they exist and parse JSON strings
    personalizeInfo: (medusaProduct.metadata?.personalizeInfo && typeof medusaProduct.metadata.personalizeInfo === 'string' ? JSON.parse(medusaProduct.metadata.personalizeInfo) : medusaProduct.metadata?.personalizeInfo) as RhPersonalizeInfo || undefined,
    swatchData: (medusaProduct.metadata?.swatchData && typeof medusaProduct.metadata.swatchData === 'string' ? JSON.parse(medusaProduct.metadata.swatchData) : medusaProduct.metadata?.swatchData) as RhSwatchData || undefined,
    customProductOptions: (medusaProduct.metadata?.customProductOptions && typeof medusaProduct.metadata.customProductOptions === 'string' ? JSON.parse(medusaProduct.metadata.customProductOptions) : medusaProduct.metadata?.customProductOptions) as RhCustomProductOptions || undefined,
    productAddons: (medusaProduct.metadata?.productAddons && typeof medusaProduct.metadata.productAddons === 'string' ? JSON.parse(medusaProduct.metadata.productAddons) : medusaProduct.metadata?.productAddons) as RhProductAddons || undefined,
    videoUrl: medusaProduct.metadata?.videoUrl as string || undefined,
    dimensions: (medusaProduct.metadata?.dimensions && typeof medusaProduct.metadata.dimensions === 'string' ? JSON.parse(medusaProduct.metadata.dimensions) : medusaProduct.metadata?.dimensions) as RhDimensions || undefined,
    careInstructions: medusaProduct.metadata?.careInstructions as string || undefined,
    designerName: medusaProduct.metadata?.designerName as string || undefined,
    romanceHeader: medusaProduct.metadata?.romanceHeader as string || undefined,
    romanceSubheader: medusaProduct.metadata?.romanceSubheader as string || undefined,
    romanceBody: medusaProduct.metadata?.romanceBody as string || undefined,
    ctaLinks: (medusaProduct.metadata?.ctaLinks && typeof medusaProduct.metadata.ctaLinks === 'string' ? JSON.parse(medusaProduct.metadata.ctaLinks) : medusaProduct.metadata?.ctaLinks) as RhCtaLink[] || undefined,
  };

  // Map Medusa's native options to RhOption
  rhProduct.options = medusaProduct.options?.map(medusaOption => ({
    id: medusaOption.id,
    title: medusaOption.title,
    values: medusaOption.values?.map(medusaValue => ({
      id: medusaValue.id,
      value: medusaValue.value,
    })),
  }));

  // Map Medusa's native variants to RhVariant (simplified for now)
  rhProduct.variants = medusaProduct.variants?.map(medusaVariant => ({
    id: medusaVariant.id,
    title: medusaVariant.title || undefined,
    sku: medusaVariant.sku || undefined,
    inventory_quantity: medusaVariant.inventory_quantity || undefined,
    manage_inventory: medusaVariant.manage_inventory || undefined,
    allow_backorder: medusaVariant.allow_backorder || undefined,
    options: medusaVariant.options?.map(opt => ({ id: opt.id, value: opt.value })) || undefined,
    calculated_price: medusaVariant.calculated_price?.calculated_amount ?? null, // Corrected access
    original_price: medusaVariant.calculated_price?.original_amount ?? null, // Corrected access
    currency_code: medusaVariant.calculated_price?.currency_code ?? undefined, // Corrected access
  }));

  // Handle pricing and sale information
  // This is a simplified example. Real implementation would iterate through variants
  // and calculate min/max prices, check for sale status, etc.
  if (medusaProduct.variants && medusaProduct.variants.length > 0) {
    const firstVariant = medusaProduct.variants[0];
    if (firstVariant.calculated_price) {
      rhProduct.skuPriceInfo = {
        listPrice: firstVariant.calculated_price.original_amount ?? undefined, // Corrected access
        salePrice: firstVariant.calculated_price.calculated_amount ?? undefined, // Corrected access
        currencySymbol: firstVariant.calculated_price.currency_code ?? undefined,
        onSale: (firstVariant.calculated_price.original_amount ?? 0) > (firstVariant.calculated_price.calculated_amount ?? 0),
        // Add more price info as needed
      };
      rhProduct.onSale = rhProduct.skuPriceInfo?.onSale;

      // Populate priceRangeDisplay based on calculated_price
      rhProduct.priceRangeDisplay = {
        listPrices: [firstVariant.calculated_price.original_amount ?? null], // Corrected access and null handling
        memberPrices: [firstVariant.calculated_price.calculated_amount ?? null], // Corrected access and null handling
        currencySymbol: firstVariant.calculated_price.currency_code ?? undefined,
        nextGenDrivenOnSale: (firstVariant.calculated_price.original_amount ?? 0) > (firstVariant.calculated_price.calculated_amount ?? 0),
        // Add other priceRangeDisplay properties as needed
      };
    }

    // Handle instock status
    const totalInventory = medusaProduct.variants.reduce((sum, variant) => sum + (variant.inventory_quantity || 0), 0);
    rhProduct.instock = {
      hasInStock: totalInventory > 0,
      showInStockButton: totalInventory > 0, // Example logic
      showInStockMessage: totalInventory > 0, // Example logic
    };
  }

  // Map other top-level fields from Medusa's product to RH.COM's structure
  // For example, if RH.COM expects 'category' as a string and Medusa has 'categories' as an array
  if (medusaProduct.categories && medusaProduct.categories.length > 0) {
    rhProduct.category = medusaProduct.categories[0].name; // Assuming RH.COM expects a single category name
  }
  if (medusaProduct.collection) {
    rhProduct.collectionName = medusaProduct.collection.title;
  }

  // Copy other metadata fields directly if they exist and are not explicitly mapped above
  for (const key in medusaProduct.metadata) {
    if (medusaProduct.metadata.hasOwnProperty(key) && rhProduct[key] === undefined) {
      // Attempt to parse JSON strings from metadata
      try {
        const parsedValue = typeof medusaProduct.metadata[key] === 'string' ? JSON.parse(medusaProduct.metadata[key] as string) : medusaProduct.metadata[key];
        rhProduct[key] = parsedValue;
      } catch (e) {
        rhProduct[key] = medusaProduct.metadata[key];
      }
    }
  }


  return rhProduct;
}