import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

// All original imports are commented out to rely on placeholders below.
// import { useLazyQuery } from "@apollo/client";
// import { Theme, useMediaQuery } from "@mui/material";
// import analyticsLoader from "analytics/loader";
import clsx from "clsx";
// import RHSpinner from "component-rh-spinner";
// import { queryProductImage } from "graphql-client/queries/product-image"; // Removed
// import { useAppId } from "hooks-use-app-id";
// import { useEnv } = "hooks/useEnv";
// import useLocale from "hooks/useLocale/useLocale";
// import { useLocalization } from "hooks/useLocalization";
// import useSite from "hooks/useSite";
// import {
//   processEnvServer as isServer,
//   processEnvServer
// } from "@RHCommerceDev/hooks/useSsrHooks";
// import useTypographyStyles from "hooks/useTypographyStyles";
// import { COLOR_PREVIEW_AVAILABLE_SOON } from "resources/page-level-resources-schemas/products.json";
// import memoize from "utils/memoize";
// import stringToObject from "utils/stringToObject";
// import yn from "yn";
import { getUrl } from "../index"; // Corrected import path
// import { PD } from "../ProductDetails"; // Now imported in ProductGridInfoSection
import { RhProduct, RhSwatch } from "@lib/util/rh-product-adapter";
// import { useNewURLStructureParams } from "hooks/useParams";
// import ImageCarousel from "component-product-grid/ImageCarousel"; // Now imported in ProductGridImageDisplay
// import { getPresetMap } from "@RHCommerceDev/utils/sanitizedImages";
// import RHImageV2 from "@RHCommerceDev/rh-image-component"; // Now imported in ProductGridSwatchOptions
// import { sleep } from "@RHCommerceDev/utils/sleep";
// import useParams from "@RHCommerceDev/hooks/useParams";
// import { getReqContext } from "utils/reqContext";
// import { BCT_PATHS, SELECTED_BRAND_COOKIE } from "utils/constants";
import RHLink from "next/link"; // Placeholder
// import Cookies from "universal-cookie";
// import { useCookies } from "hooks/useCookies";
// import { TailwindTypography as Typography } from "@RHCommerceDev/component-tailwind-typography"; // Now imported in sub-components
// import { PG_GRID_CHOICE } from "@RHCommerceDev/nextgen-product-gallery/constants";
// import { useIsoCookies } from "@RHCommerceDev/hooks/useIsoCookies";

import { useParams } from "next/navigation";

// New modular components
import ProductGridImageDisplay from "./ProductGridImageDisplay";
import ProductGridInfoSection from "./ProductGridInfoSection";
import ProductGridSwatchOptions from "./ProductGridSwatchOptions";

// Placeholder components and utilities
const useLazyQuery = (query: any, options: any) => ({
  data: { productImage: { imageUrl: "" } },
  loading: false,
  getProductSwatchImage: (variables: any) => {
    if (options.onCompleted) {
      options.onCompleted({ productImage: { imageUrl: "placeholder-image.jpg" } });
    }
  }
});
const queryProductImage = {};
const useMediaQuery = (query: any) => true;
const analyticsLoader = (callback: any) => {};
const RHSpinner = () => <div>Loading...</div>;
const useAppId = () => ({ isConcierge: false });
const useEnv = () => ({ FEATURE_URL_CHANGE: false, FEATURE_BCT_SUNSET: false, FEATURE_TEST_PRESET: false });
const useLocale = () => "en-US";
const useLocalization = () => "/";
const useSite = () => "RH";
const processEnvServer = false;
const isServer = false;
const useTypographyStyles = (props: any) => ({ rhBaseBody1: "", rhBaseH2: "", rhBaseCaption: "", rhBaseBody2: "", rhBaseBody3: "", rhBaseCaption1: "", rhBaseCaption2: "" });
const COLOR_PREVIEW_AVAILABLE_SOON = "Color preview available soon";
// Removed: const memoize = (Component: any) => memoize(Component);
const stringToObject = (str: string) => ({});
const yn = (value: any) => Boolean(value);
const useNewURLStructureParams = () => ({ category: "" });
const ImageCarousel = (props: any) => <div>Image Carousel</div>;
interface PresetMap {
  rhrThreeK: string;
  threeK: string;
  xlUp: { [key: string]: string };
  lgUp: { [key: string]: string };
  mdUp: { [key: string]: string };
  smUp: { [key: string]: string };
  xsUp: { [key: string]: string };
}

const getPresetMap = (a: any, b: any, c: any): PresetMap => ({ rhrThreeK: "", threeK: "", xlUp: {}, lgUp: {}, mdUp: {}, smUp: {}, xsUp: {} });
const RHImageV2 = (props: any) => <img src={props.src} alt={props.alt} className={props.className} />;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const useParamsHook = (props: any) => ({ site: "" }); // Renamed to avoid conflict with Next.js useParams
const getReqContext = () => ({ cookies: {}, path: "" });
const BCT_PATHS: { [key: string]: string } = {};
const SELECTED_BRAND_COOKIE = "";
// const RHLink = (props: any) => <a href={props.to}>{props.children}</a>; // Already defined above
const Cookies = (initialCookies: any) => ({
  cookies: initialCookies,
  get: (name: string) => initialCookies?.[name]
});
const useCookies = (props: any) => [{}, () => {}];
const Typography = (props: any) => <p>{props.children}</p>;
const PG_GRID_CHOICE = "";
const useIsoCookies = (props: any) => {
  const cookies: { [key: string]: string } = {};
  return cookies;
};

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
  data: RhProduct; // Changed from item?: SearchResultRecord;
  isSale?: boolean;
  isSaleFilterEnabled?: boolean;
  filterQueries?: string[];
  pageContent?: any;
  onProductClick: Function;
  productTitle?: string;
  inStockFlow?: boolean;
  isSelectedItem?: boolean;
  countryCode: string; // Added countryCode prop
}


// @ts-ignore
export const ProductGridCard: FC<ProductCardProps> = memo(
  ({
    data, // Changed from item
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
    countryCode, // Destructure countryCode prop
  }) => {
    const env = useEnv();
    const siteId = useSite();
    const locale = useLocale();
    const prefix = useLocalization();
    const { isConcierge } = useAppId();

    const [selectedSwatchIdx, setSelectedSwatchIdx] = useState(-1);
    const [selectedSwatch, setSelectedSwatch] = useState<string | null>(null);
    const [isSWatchClicked, setIsWatchClicked] = useState(false);
    const [IsClicked, setIsClicked] = useState(false);
    const [isSwatchFinish, setIsSwatchFinish] = useState(false);
    const nextgenCookie = "true";
    const isNewURLFeatureEnabled = yn(env.FEATURE_URL_CHANGE);
    const { category } = useNewURLStructureParams();

    const [isSwatchSelected, setIsSwatchSelected] = useState(false);

    const [isColorizable, setIsColorizable] = useState(false);

    const [actualImgHeight, setActualImgHeight] = useState(0);
    const [dynamicTopBanner, setDynamicTopBanner] = useState(0);

    const cookie = useIsoCookies([PG_GRID_CHOICE]);

    const isRHR = data?.metadata?.rhr ?? false; // Changed from item?.product?.rhr
    const isRHRImage = isRHR;
    const isConciergeRHRImage = isConcierge && isRHR;
    const xlUp = useMediaQuery(true);
    const lgUp = useMediaQuery(true);
    const mdUp = useMediaQuery(true);
    const smUp = useMediaQuery(true);
    const req = getReqContext();
    const paramsHook: { site: string } = useParamsHook({ // Renamed to avoid conflict
      site: ""
    });

    const searchPage =
      (!processEnvServer
        ? location.pathname?.includes("/search/")
        : req?.path?.includes("/search/")) || false;

    const [openInNewTab, setOpenInNewTab] = useState(false);

    const typographyStyles = useTypographyStyles({
      keys: [
        "rhBaseBody1",
        "rhBaseH2",
        "rhBaseCaption",
        "rhBaseBody2",
        "rhBaseBody3",
        "rhBaseCaption1",
        "rhBaseCaption2"
      ]
    });
    const reqContext: { cookies?: any } = getReqContext() ?? {};
    const conciergeCookie = Cookies(reqContext.cookies);
    const savedBrand = useMemo(
      () => conciergeCookie.get(SELECTED_BRAND_COOKIE),
      [conciergeCookie, SELECTED_BRAND_COOKIE]
    );
    const [, setCookie] = useCookies([SELECTED_BRAND_COOKIE]);

    useEffect(() => {
      setIsColorizable(data?.colorizable ?? false); // Changed from item?.product?.colorizable
    }, [data?.colorizable]); // Changed from item?.product?.colorizable

    const getSite = (params: any, productUrl: string | undefined) => {
      if (params?.site) return params?.site;
      else if (productUrl?.includes("rhbc_prod")) return "BC";
      else if (productUrl?.includes("rhtn_prod")) return "TN";
      return "RH";
    };

    const to = useMemo(() => {
      let productUrl = getUrl(
        data,
        countryCode // Pass countryCode here
      )?.to;
      const site = searchPage ? getSite(paramsHook, productUrl) : siteId; // Use paramsHook
      const bctPath = BCT_PATHS[site] || "";

      if (yn(env.FEATURE_BCT_SUNSET) && !isConcierge) {
        if (bctPath) {
          productUrl = bctPath + productUrl;
          site !== siteId && setOpenInNewTab(true);
        } else if (siteId !== "RH") {
          setOpenInNewTab(true);
        }
      }
      return prefix + productUrl;
    }, [
      data, // Changed from item
      countryCode, // Added countryCode to dependencies
      host,
      isStockedFilterActive,
      isRefinementFilterActive,
      totalNumRecs,
      Boolean(isSale || isSaleFilterEnabled),
      isConcierge,
      filterQueries,
      selectedSwatch,
      paramsHook?.site, // Use paramsHook
      searchPage,
      siteId,
      env.FEATURE_BCT_SUNSET,
      prefix,
      isNewURLFeatureEnabled,
      category
    ]);
    let saleUrl = "";
    const generatedSaleUrl = useMemo(() => {
      return (
        prefix +
        getUrl(
          data, // Changed from item
          countryCode // Pass countryCode here
        )?.to
      );
    }, [
      data, // Changed from item
      countryCode, // Added countryCode to dependencies
    ]);
    if (
      data?.percentSaleSkus !== 0 && // Changed from item?.product?.percentSaleSkus
      data?.percentSaleSkus !== 100 && // Changed from item?.product?.percentSaleSkus
      !Boolean(isSale || isSaleFilterEnabled)
    ) {
      saleUrl = generatedSaleUrl;
    }

    const cols = useMemo(() => {
      return 12 / gridColumns;
    }, [gridColumns]);

    const productDetails: any = data; // Changed from item?.product;
    // const swatchRows = item?.product?.swatchInfo?.swatchesToDisplay?.length;
    // let value = swatchRows !== undefined && swatchRows > 6 ? 6 : swatchRows;
    // const mdUp = useMediaQuery<Theme>(theme => theme.breakpoints.up("md"));
    // const Wrapper = mdUp ? Fade : React.Fragment;
    const {
      getProductSwatchImage,
      data: { productImage: productSwatchImage } = { productImage: { imageUrl: "" } },
      loading: productSwatchLoading
    } = useLazyQuery(queryProductImage, {
      onCompleted: (data: any) => {
        setIsClicked(true);
      },
      onError: (data: any) => {}
    });

    // const wrapperProps = useMemo(
    //   () => (mdUp ? { in: true, timeout: { enter: 1600, exit: 1600 } } : {}),
    //   [mdUp]
    // );
    const onSwatchClickHandler = useCallback(
      (e: React.MouseEvent | null, index: number, swatch: RhSwatch | undefined, disableProductCall?: boolean) => {
        setSelectedSwatchIdx(index);
        setSelectedSwatch(swatch?.swatchId ?? null);
        if (isColorizable) {
          if (!disableProductCall) {
            setIsClicked(true);
            getProductSwatchImage({
              variables: {
                productId: data?.id, // Changed from item?.product?.repositoryId
                swatchIds: swatch?.swatchId ? [swatch.swatchId] : [],
                siteId,
                locale
              }
            });
          }
        }
        if (e) {
          e?.stopPropagation();
          e?.preventDefault();
        }
      },
      [
        getProductSwatchImage,
        isColorizable,
        data?.id, // Changed from item?.product?.repositoryId
        locale,
        siteId
      ]
    );
    useEffect(() => {
      const swatchToDisplayId = data?.displaySwatch; // Changed from item?.product?.displaySwatch
      const swatchesToDisplay = data?.swatchData?.swatchGroups?.[0]?.stockedSwatches || []; // Changed from item?.product?.swatchInfo?.swatchesToDisplay
      if (
        swatchToDisplayId &&
        Array.isArray(swatchesToDisplay) &&
        swatchesToDisplay.length > 0
      ) {
        const swatchToDisplay = swatchesToDisplay.find(
          swatch => swatch.swatchId === swatchToDisplayId
        );
        if (swatchToDisplay) {
          onSwatchClickHandler(
            null,
            swatchesToDisplay.indexOf(swatchToDisplay),
            swatchToDisplay,
            true
          );
        }
      }
    }, [data?.displaySwatch, data?.swatchData?.swatchGroups, onSwatchClickHandler]); // Changed dependencies

    const PRESET_MAP = useMemo(() => {
      return getPresetMap(
        isConciergeRHRImage,
        isRHRImage,
        data?.metadata?.pgImagePresetOverride // Changed from item?.product?.pgImagePresetOverride
      );
    }, [isConciergeRHRImage, isRHRImage, data?.metadata?.pgImagePresetOverride]); // Changed dependencies

    const presetImage = useCallback(
      (rawURL: string | undefined, zoom?: boolean) => {
        try {
          if (!rawURL) return "";
          let preset = "";
          if (zoom) {
            preset = rawURL?.toUpperCase()?.includes("_RHR")
              ? PRESET_MAP.rhrThreeK
              : PRESET_MAP.threeK;
          } else if (xlUp) {
            preset = PRESET_MAP.xlUp[`col-${cols}`];
          } else if (lgUp) {
            preset = PRESET_MAP.lgUp[`col-${cols}`];
          } else if (mdUp || processEnvServer) {
            preset = PRESET_MAP.mdUp[`col-${cols}`];
          } else if (smUp) {
            preset = PRESET_MAP.smUp[`col-${cols}`];
          } else {
            preset = PRESET_MAP.xsUp[`col-${cols}`];
          }

          const FEATURE_TEST_PRESET = yn(env?.FEATURE_TEST_PRESET);

          const modifiedPreset = FEATURE_TEST_PRESET
            ? preset?.endsWith("$")
              ? preset.replace(/\$(?!.*\$)/, "_demo$")
              : `${preset}_demo`
            : preset;

          const url = new URL(`https:${rawURL}`);

          if (url?.search) {
            return `${rawURL}&${modifiedPreset}`;
          } else {
            return `${rawURL}?${modifiedPreset}`;
          }
        } catch (error) {
          return rawURL || ""; // Ensure string is returned
        }
      },
      [
        xlUp,
        lgUp,
        mdUp,
        smUp,
        PRESET_MAP.rhrThreeK,
        PRESET_MAP.threeK,
        PRESET_MAP.xlUp,
        PRESET_MAP.lgUp,
        PRESET_MAP.mdUp,
        PRESET_MAP.smUp,
        PRESET_MAP.xsUp,
        cols,
        env?.FEATURE_TEST_PRESET
      ]
    );

    const triggerAnalyticsEvent = () => {
      if (!isServer) {
        const itemList = [
          {
            item_name: data?.displayName, // Changed from item?.product?.displayName
            item_id: data?.id, // Changed from item?.product?.repositoryId
            item_category: productTitle,
            item_variant: null,
            quantity: null,
            price: data?.priceRangeDisplay, // Changed from item?.product?.priceInfo
            item_list_name: window.location.href.includes("/search/")
              ? "search"
              : window.location.href.includes("products.jsp")
              ? "pg"
              : null
          }
        ];

        analyticsLoader((a: any) =>
          a.emitAnalyticsEvent(
            document.querySelector("#spa-root > *")! as HTMLElement,
            a.EVENTS.SELECT_ITEM.INT_TYPE,
            {
              itemList,
              item_list_name: true,
              id: data?.id, // Changed from item?.product?.repositoryId
              displayName: data?.displayName // Changed from item?.product?.displayName
            }
          )
        );
      }
    };

    const imagesArr = useMemo(() => {
      const product = data; // Changed from item?.product;
      let images: string[] = [];
      if (product) {
        if (!product?.alternateImages?.length) {
          images.push(product?.imageUrl! || product?.altImageUrl!);
        } else if (product?.alternateImages?.length) {
          images = product?.alternateImages.map(data => data.imageUrl) || [];
        } else {
          images.push(product?.imageUrl! || product?.altImageUrl!);
        }
      }

      if (productSwatchImage?.imageUrl) {
        const { imageUrl } = productSwatchImage;
        const newArray = [...images];
        newArray[0] = imageUrl;
        images = newArray;
        setIsClicked(false);
      }
      return images.map(item => ({
        imageUrl: item
      })) as ProductAlternateImage[];
    }, [data, productSwatchImage?.imageUrl]); // Changed dependencies

    const imageAlternativeName = useMemo(() => {
      let name = "";
      if (Boolean(data?.skuOptiondata)) { // Changed from item?.product?.skuOptiondata
        const optionData: any = data?.skuOptiondata // Changed from item?.product?.skuOptiondata
          ? stringToObject(data?.skuOptiondata) // Changed from item?.product?.skuOptiondata
          : {};

        if (optionData.hasOwnProperty("Finish")) {
          setIsSwatchFinish(true);
        } else {
          setIsSwatchFinish(false);
        }

        if (
          optionData.hasOwnProperty("Finish") &&
          optionData.hasOwnProperty("Color")
        ) {
          name = `${data?.displayName} with ${optionData?.Color} fabric and ${optionData?.Finish} finish`; // Changed from item?.product?.displayName
        } else if (optionData.hasOwnProperty("Finish")) {
          name = `${data?.displayName} in ${optionData?.Finish} finish`; // Changed from item?.product?.displayName
        } else if (optionData.hasOwnProperty("Color")) {
          name = `${data?.displayName} in ${optionData?.Color}`; // Changed from item?.product?.displayName
        } else {
          name = data?.displayName || ""; // Changed from item?.product?.displayName
        }
      } else {
        name = data?.displayName || ""; // Changed from item?.product?.displayName
      }

      return name;
    }, [data, stringToObject]); // Changed dependencies

    const swatchAriaLabel = (swatchName: string | undefined) =>
      `${swatchName} ${isSwatchFinish ? "finish" : ""}`;

    const spinnerHeight = `calc(${
      productDetails?.imageContainerStyle?.height
    } + ${mdUp ? "16" : "8"}px)`;

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isSelectedItem) {
        sleep(500).then(() => {
          ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
    }, [isSelectedItem]);

    const showColorPreviewAvailableSoonBanner = useMemo(() => {
      if (isColorizable) return false;
      if (selectedSwatchIdx < 0 || !isSwatchSelected) return false;
      const swatches = data?.swatchData?.swatchGroups?.[0]?.stockedSwatches || []; // Changed from item?.product?.swatchInfo?.swatchesToDisplay
      const displaySwatch = data?.displaySwatch; // Changed from item?.product?.displaySwatch
      return swatches.length > 0 && displaySwatch !== selectedSwatch;
    }, [
      isColorizable,
      selectedSwatchIdx,
      isSwatchSelected,
      data?.swatchData?.swatchGroups, // Changed dependencies
      data?.displaySwatch, // Changed dependencies
      selectedSwatch
    ]);

    const pgGridChoice = useMemo(() => {
      const value = cookie[PG_GRID_CHOICE];
      return value ? parseInt(value, 10) : null;
    }, [cookie]);

    useEffect(() => {
      if (!actualImgHeight || !pgGridChoice) return;

      const timer = setTimeout(() => {
        const imageContainerHeight =
          productDetails?.imageContainerStyle?.maxHeight || 0;
        const offset = Math.abs(imageContainerHeight - actualImgHeight);

        setDynamicTopBanner(offset);
      }, 50);

      return () => clearTimeout(timer);
    }, [
      pgGridChoice,
      actualImgHeight,
      productDetails?.imageContainerStyle?.maxHeight
    ]);

    return (
      <div
        className={`relative flex h-full w-full flex-col ${
          gridColumns === 12 ? "item-center" : "unset"
        } `}
        ref={ref}
      >
        <ProductGridImageDisplay
          id={data?.id} // Changed from item?.product?.repositoryId
          fallbackImage={(data?.alternateImages || [])[0]?.imageUrl} // Changed from (item?.product?.alternateImages || [])[0]?.imageUrl
          setIsColorizable={setIsColorizable}
          colorizable={data?.colorizable ?? false} // Changed from item?.product?.colorizable
          slides={imagesArr ?? []}
          linkToPage={to}
          openInNewTab={openInNewTab}
          triggerAnalyticsEvent={triggerAnalyticsEvent}
          presetImage={presetImage}
          imageAlternativeName={imageAlternativeName}
          onProductClick={onProductClick}
          imageFlip={Boolean(data?.imageFlip)} // Changed from item?.product?.imageFlip
          isClicked={IsClicked}
          setIsClicked={setIsClicked}
          imageStyle={productDetails?.imageStyle || {}
          }
          setActualImgHeight={setActualImgHeight}
          imageContainerStyle={{
            justifyContent: "center",
            width: "100%", // container needs 100% width
            ...(productDetails?.imageContainerStyle
              ? {
                  aspectRatio:
                    productDetails?.imageContainerStyle?.aspectRatio ?? 1,
                  height: imagesArr[0]
                    ? productDetails?.imageContainerStyle?.maxHeight || "auto"
                    : 250
                }
              : {})
          }}
          productSwatchLoading={productSwatchLoading}
          showColorPreviewAvailableSoonBanner={showColorPreviewAvailableSoonBanner}
          dynamicTopBanner={dynamicTopBanner}
          pageContent={pageContent}
          COLOR_PREVIEW_AVAILABLE_SOON={COLOR_PREVIEW_AVAILABLE_SOON}
          spinnerHeight={spinnerHeight}
        />

        <div className={`flex h-full w-full flex-col flex-wrap content-around`}>
          <div
            className={`flex h-full flex-col`}
            style={{ width: `${productDetails?.imageContainerStyle?.width}px` }}
          >
            <RHLink href={to} target={openInNewTab ? "_blank" : "_self"}>
              <ProductGridInfoSection
                data={data} // Changed from item={item}
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
                inStockFlow={true} // inStockFlow
                saleUrl={saleUrl}
              />
            </RHLink>
            {data?.swatchData?.swatchGroups?.[0]?.stockedSwatches?.length ? ( // Changed from item?.product?.swatchInfo?.swatchesToDisplay?.length
              <ProductGridSwatchOptions
                swatchesToDisplay={data?.swatchData?.swatchGroups?.[0]?.stockedSwatches} // Changed from item?.product?.swatchInfo?.swatchesToDisplay
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