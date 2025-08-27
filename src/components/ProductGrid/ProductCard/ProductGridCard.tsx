import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import clsx from "clsx";

import { getUrl } from "../index";
import { RhProduct, RhSwatch } from "@lib/util/rh-product-adapter";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

// New modular components
import ProductGridImageDisplay from "./ProductGridImageDisplay";
import ProductGridInfoSection from "./ProductGridInfoSection";
import ProductGridSwatchOptions from "./ProductGridSwatchOptions";

// Placeholder components and utilities (simplified or removed if not directly used)
const useLazyQuery = (query: any, options: any) => ({
  data: { productImage: { imageUrl: "" } },
  loading: false,
  getProductSwatchImage: (variables: any) => {
    if (options.onCompleted) {
      options.onCompleted({ productImage: { imageUrl: "placeholder-image.jpg" } });
    }
  }
});
const queryProductImage = {}; // Placeholder for actual GraphQL query
const useMediaQuery = (query: any) => true; // Simplified
const analyticsLoader = (callback: any) => {}; // Placeholder
const useAppId = () => ({ isConcierge: false }); // Simplified
const useEnv = () => ({ FEATURE_URL_CHANGE: false, FEATURE_BCT_SUNSET: false, FEATURE_TEST_PRESET: false }); // Simplified
const useLocale = () => "en-US"; // Simplified
const useLocalization = () => "/"; // Simplified
const useSite = () => "RH"; // Simplified
const processEnvServer = false; // Simplified
const isServer = false; // Simplified
const useTypographyStyles = (props: any) => ({ rhBaseBody1: "", rhBaseH2: "", rhBaseCaption: "", rhBaseBody2: "", rhBaseBody3: "", rhBaseCaption1: "", rhBaseCaption2: "" }); // Simplified
const COLOR_PREVIEW_AVAILABLE_SOON = "Color preview available soon"; // Placeholder
const stringToObject = (str: string) => ({}); // Placeholder
const yn = (value: any) => Boolean(value); // Placeholder
const useNewURLStructureParams = () => ({ category: "" }); // Simplified
const getPresetMap = (a: any, b: any, c: any) => ({ xlUp: {}, lgUp: {}, mdUp: {}, smUp: {}, xsUp: {} }); // Simplified
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // Placeholder
const useParamsHook = (props: any) => ({ site: "" }); // Simplified
const getReqContext = () => ({ cookies: {}, path: "" }); // Simplified
const BCT_PATHS: { [key: string]: string } = {}; // Placeholder
const SELECTED_BRAND_COOKIE = ""; // Placeholder
const Cookies = (initialCookies: any) => ({ get: (name: string) => initialCookies?.[name] }); // Placeholder
const useCookies = (props: any) => [{}, () => {}]; // Placeholder
const PG_GRID_CHOICE = ""; // Placeholder
const useIsoCookies = (props: any) => ({}); // Placeholder

// Placeholder types
interface ProductAlternateImage {
  imageUrl: string;
}

interface ProductCardProps {
  isStockedFilterActive: boolean;
  isRefinementFilterActive: boolean;
  gridColumns: any;
  totalNumRecs: number;
  host?: string;
  data: RhProduct;
  isSale?: boolean;
  isSaleFilterEnabled?: boolean;
  filterQueries?: string[];
  pageContent?: any;
  onProductClick: Function;
  productTitle?: string;
  inStockFlow?: boolean;
  isSelectedItem?: boolean;
  countryCode: string;
}

export const ProductGridCard: FC<ProductCardProps> = memo(
  ({
    data,
    gridColumns,
    isStockedFilterActive,
    isRefinementFilterActive,
    totalNumRecs,
    host = "",
    isSale,
    isSaleFilterEnabled,
    filterQueries,
    pageContent,
    productTitle,
    onProductClick,
    isSelectedItem,
    countryCode,
  }) => {
    const env = useEnv();
    const siteId = useSite();
    const locale = useLocale();
    const prefix = useLocalization();
    const { isConcierge } = useAppId();

    // State for swatch and image interactions
    const [selectedSwatchIdx, setSelectedSwatchIdx] = useState(-1);
    const [selectedSwatch, setSelectedSwatch] = useState<string | null>(null);
    const [isSwatchSelected, setIsSwatchSelected] = useState(false);
    const [isClicked, setIsClicked] = useState(false); // For triggering image update
    const [isColorizable, setIsColorizable] = useState(data?.colorizable ?? false);

    // Derived state for swatch finish
    const isSwatchFinish = useMemo(() => {
      if (Boolean(data?.skuOptiondata)) {
        const optionData: any = data?.skuOptiondata ? stringToObject(data?.skuOptiondata) : {};
        return optionData.hasOwnProperty("Finish");
      }
      return false;
    }, [data?.skuOptiondata]);

    // Placeholder for image query
    const {
      getProductSwatchImage,
      data: { productImage: productSwatchImage } = { productImage: { imageUrl: "" } },
      loading: productSwatchLoading
    } = useLazyQuery(queryProductImage, {
      onCompleted: () => setIsClicked(true),
      onError: () => {}
    });

    // Memoized URL for the product card
    const to = useMemo(() => {
      let productUrl = getUrl(data)?.to;
      // Simplified site/bctPath logic for Medusa context
      return productUrl;
    }, [data]);

    // Memoized sale URL
    const saleUrl = useMemo(() => {
      if (data?.percentSaleSkus !== 0 && data?.percentSaleSkus !== 100 && !Boolean(isSale || isSaleFilterEnabled)) {
        return getUrl(data)?.to;
      }
      return "";
    }, [data, isSale, isSaleFilterEnabled]);

    // Memoized image array for carousel
    const imagesArr = useMemo(() => {
      let images: string[] = [];
      if (productSwatchImage?.imageUrl) {
        images = [productSwatchImage.imageUrl, ...(data?.alternateImages?.map(img => img.imageUrl) || []).filter((url: string) => url !== productSwatchImage.imageUrl)];
      } else if (data?.alternateImages?.length) {
        images = data.alternateImages.map(img => img.imageUrl) || [];
      } else if (data?.imageUrl) {
        images = [data.imageUrl];
      }
      return images.map(item => ({ imageUrl: item })) as ProductAlternateImage[];
    }, [data, productSwatchImage?.imageUrl]);

    // Memoized alternative image name
    const imageAlternativeName = useMemo(() => {
      let name = data?.displayName || "";
      if (Boolean(data?.skuOptiondata)) {
        const optionData: any = data?.skuOptiondata ? stringToObject(data?.skuOptiondata) : {};
        if (optionData.hasOwnProperty("Finish") && optionData.hasOwnProperty("Color")) {
          name = `${data?.displayName} with ${optionData?.Color} fabric and ${optionData?.Finish} finish`;
        } else if (optionData.hasOwnProperty("Finish")) {
          name = `${data?.displayName} in ${optionData?.Finish} finish`;
        } else if (optionData.hasOwnProperty("Color")) {
          name = `${data?.displayName} in ${optionData?.Color}`;
        }
      }
      return name;
    }, [data?.displayName, data?.skuOptiondata]);

    // Memoized swatch aria label
    const swatchAriaLabel = useCallback((swatchName: string | undefined) =>
      `${swatchName} ${isSwatchFinish ? "finish" : ""}`, [isSwatchFinish]);

    // Memoized preset image function (simplified)
    const presetImage = useCallback((rawURL: string | undefined) => rawURL || "", []);

    // Memoized analytics event trigger
    const triggerAnalyticsEvent = useCallback(() => {
      if (!isServer) {
        // Placeholder for analytics event
        console.log("Analytics event triggered for", data?.displayName);
      }
    }, [data?.displayName]);

    // Callback for swatch click handler
    const onSwatchClickHandler = useCallback(
      (e: React.MouseEvent | null, index: number, swatch: RhSwatch | undefined, disableProductCall?: boolean) => {
        setSelectedSwatchIdx(index);
        setSelectedSwatch(swatch?.swatchId ?? null);
        setIsSwatchSelected(true);
        setIsClicked(true); // Indicate a click for image update
        if (isColorizable && !disableProductCall) {
          getProductSwatchImage({
            variables: {
              productId: data?.id,
              swatchIds: swatch?.swatchId ? [swatch.swatchId] : [],
              siteId,
              locale
            }
          });
        }
        e?.stopPropagation();
        e?.preventDefault();
      },
      [getProductSwatchImage, isColorizable, data?.id, locale, siteId]
    );

    // Effect to set initial swatch if `displaySwatch` is present
    useEffect(() => {
      const swatchToDisplayId = data?.displaySwatch;
      const swatchesToDisplay = data?.swatchData?.swatchGroups?.[0]?.stockedSwatches || [];
      if (swatchToDisplayId && Array.isArray(swatchesToDisplay) && swatchesToDisplay.length > 0) {
        const swatchToDisplay = swatchesToDisplay.find(swatch => swatch.swatchId === swatchToDisplayId);
        if (swatchToDisplay) {
          onSwatchClickHandler(null, swatchesToDisplay.indexOf(swatchToDisplay), swatchToDisplay, true);
        }
      }
    }, [data?.displaySwatch, data?.swatchData?.swatchGroups, onSwatchClickHandler]);

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (isSelectedItem) {
        sleep(500).then(() => {
          ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
    }, [isSelectedItem]);

    // Simplified productDetails for passing to children
    const productDetails = data;

    return (
      <div
        className={`relative flex h-full w-full flex-col ${
          gridColumns === 12 ? "item-center" : "unset"
        } `}
        ref={ref}
      >
        <ProductGridImageDisplay
          id={data?.id}
          fallbackImage={(data?.alternateImages || [])[0]?.imageUrl}
          setIsColorizable={setIsColorizable}
          colorizable={isColorizable}
          slides={imagesArr ?? []}
          linkToPage={to}
          openInNewTab={false} // Simplified, adjust if needed
          triggerAnalyticsEvent={triggerAnalyticsEvent}
          presetImage={presetImage}
          imageAlternativeName={imageAlternativeName}
          onProductClick={onProductClick}
          imageFlip={Boolean(data?.imageFlip)}
          isClicked={isClicked}
          setIsClicked={setIsClicked}
          imageStyle={productDetails?.imageStyle || {}}
          productSwatchLoading={productSwatchLoading}
          pageContent={pageContent}
          COLOR_PREVIEW_AVAILABLE_SOON={COLOR_PREVIEW_AVAILABLE_SOON}
        />

        <div className={`flex h-full w-full flex-col flex-wrap content-around`}>
          <div
            className={`flex h-full flex-col`}
            style={{ width: `${productDetails?.imageContainerStyle?.width}px` }}
          >
            <LocalizedClientLink href={to} target={false ? "_blank" : "_self"}>
              <ProductGridInfoSection
                data={data}
                productDetails={productDetails}
                isStockedFilterActive={isStockedFilterActive}
                isRefinementFilterActive={isRefinementFilterActive}
                totalNumRecs={totalNumRecs}
                host={host}
                isSale={isSale}
                isSaleFilterEnabled={isSaleFilterEnabled}
                filterQueries={filterQueries}
                pageContent={pageContent}
                productTitle={productTitle}
                inStockFlow={true}
                saleUrl={saleUrl}
              />
            </LocalizedClientLink>
            {data?.swatchData?.swatchGroups?.[0]?.stockedSwatches?.length ? (
              <ProductGridSwatchOptions
                swatchesToDisplay={data?.swatchData?.swatchGroups?.[0]?.stockedSwatches}
                selectedSwatch={selectedSwatch}
                selectedSwatchIdx={selectedSwatchIdx}
                isSwatchSelected={isSwatchSelected}
                setIsSwatchSelected={setIsSwatchSelected}
                onSwatchClickHandler={onSwatchClickHandler}
                isSwatchFinish={isSwatchFinish}
                swatchAriaLabel={swatchAriaLabel}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);