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
// } from "hooks/useSsrHooks";
// import useTypographyStyles from "hooks/useTypographyStyles";
// import { COLOR_PREVIEW_AVAILABLE_SOON } from "resources/page-level-resources-schemas/products.json";
// import memoize from "utils/memoize";
// import stringToObject from "utils/stringToObject";
// import yn from "yn";
import { getUrl } from "..";
import { PD } from "../ProductDetails";
import { RhSwatch } from "@lib/util/rh-product-adapter";
// import { useNewURLStructureParams } from "hooks/useParams";
// import ImageCarousel from "component-product-grid/ImageCarousel";
// import { getPresetMap } from "@RHCommerceDev/utils/sanitizedImages";
// import RHImageV2 from "@RHCommerceDev/rh-image-component";
// import { sleep } from "@RHCommerceDev/utils/sleep";
// import useParams from "@RHCommerceDev/hooks/useParams";
// import { getReqContext } from "utils/reqContext";
// import { BCT_PATHS, SELECTED_BRAND_COOKIE } from "utils/constants";
// import RHLink from "@RHCommerceDev/component-rh-link";
// import Cookies from "universal-cookie";
// import { useCookies } from "hooks/useCookies";
// import { TailwindTypography as Typography } from "@RHCommerceDev/component-tailwind-typography";
// import { PG_GRID_CHOICE } from "@RHCommerceDev/nextgen-product-gallery/constants";
// import { useIsoCookies } from "@RHCommerceDev/hooks/useIsoCookies";

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
const memoize = (Component: any) => Component;
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
const useParams = (props: any) => ({ site: "" });
const getReqContext = () => ({ cookies: {}, path: "" });
const BCT_PATHS: { [key: string]: string } = {};
const SELECTED_BRAND_COOKIE = "";
const RHLink = (props: any) => <a href={props.to}>{props.children}</a>;
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
interface SearchResultRecord {
  product?: {
    rhr?: boolean;
    pgImagePresetOverride?: any;
    repositoryId?: string;
    colorizable?: boolean;
    displaySwatch?: string;
    swatchInfo?: {
      swatchesToDisplay?: {
        swatchId?: string;
        displayName?: string;
        imageUrl?: string;
      }[];
    };
    displayName?: string;
    percentSaleSkus?: number;
    imageFlip?: boolean;
    imageUrl?: string;
    altImageUrl?: string;
    alternateImages?: { imageUrl: string }[];
    skuOptiondata?: string;
    priceInfo?: any; // Added priceInfo
    galleryDescription?: string; // Added galleryDescription
    imageContainerStyle?: any; // Added imageContainerStyle
    captionMinHeight?: number; // Added captionMinHeight
    imageStyle?: any; // Added imageStyle
  };
  sku?: {
    fullSkuId?: string;
  };
}

interface Query {
  productImage?: {
    imageUrl?: string;
  };
}

interface ProductAlternateImage {
  imageUrl: string;
}

interface ProductCard {
  isStockedFilterActive: boolean;
  isRefinementFilterActive: boolean;
  gridColumns: any;
  totalNumRecs: number;
  host?: string;
  item?: SearchResultRecord;
  isSale?: boolean;
  isSaleFilterEnabled?: boolean;
  filterQueries?: string[];
  pageContent?: any;
  onProductClick: Function;
  productTitle?: string;
  inStockFlow?: boolean;
  isSelectedItem?: boolean;
}


// @ts-ignore
export const ProductCard: FC<ProductCard> = memo(
  ({
    item,
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
    inStockFlow,
    isSelectedItem
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

    const isRHR = item?.product?.rhr ?? false;
    const isRHRImage = isRHR;
    const isConciergeRHRImage = isConcierge && isRHR;
    const xlUp = useMediaQuery(true);
    const lgUp = useMediaQuery(true);
    const mdUp = useMediaQuery(true);
    const smUp = useMediaQuery(true);
    const req = getReqContext();
    const params: { site: string } = useParams({
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
      setIsColorizable(item?.product?.colorizable ?? false);
    }, [item?.product?.colorizable]);

    const getSite = (params: any, productUrl: string | undefined) => {
      if (params?.site) return params?.site;
      else if (productUrl?.includes("rhbc_prod")) return "BC";
      else if (productUrl?.includes("rhtn_prod")) return "TN";
      return "RH";
    };

    const to = useMemo(() => {
      let productUrl = getUrl(
        item,
        host,
        isStockedFilterActive,
        isRefinementFilterActive,
        totalNumRecs,
        Boolean(isSale || isSaleFilterEnabled),
        isConcierge,
        filterQueries,
        selectedSwatch,
        nextgenCookie === "true",
        inStockFlow,
        isNewURLFeatureEnabled,
        category
      )?.to;
      const site = searchPage ? getSite(params, productUrl) : siteId;
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
      item,
      host,
      isStockedFilterActive,
      isRefinementFilterActive,
      totalNumRecs,
      Boolean(isSale || isSaleFilterEnabled),
      isConcierge,
      filterQueries,
      selectedSwatch,
      params?.site,
      searchPage,
      siteId
    ]);
    let saleUrl = "";
    const generatedSaleUrl = useMemo(() => {
      return (
        prefix +
        getUrl(
          item,
          host,
          isStockedFilterActive,
          isRefinementFilterActive,
          totalNumRecs,
          true,
          isConcierge,
          filterQueries,
          selectedSwatch,
          nextgenCookie === "true",
          inStockFlow,
          isNewURLFeatureEnabled,
          category
        )?.to
      );
    }, [
      item,
      host,
      isStockedFilterActive,
      isRefinementFilterActive,
      totalNumRecs,
      Boolean(isSale || isSaleFilterEnabled),
      isConcierge,
      filterQueries,
      selectedSwatch
    ]);
    if (
      item?.product?.percentSaleSkus !== 0 &&
      item?.product?.percentSaleSkus !== 100 &&
      !Boolean(isSale || isSaleFilterEnabled)
    ) {
      saleUrl = generatedSaleUrl;
    }

    const cols = useMemo(() => {
      return 12 / gridColumns;
    }, [gridColumns]);

    const productDetails: any = item?.product;
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
                productId: item?.product?.repositoryId,
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
        item?.product?.repositoryId,
        locale,
        siteId
      ]
    );
    useEffect(() => {
      const swatchToDisplayId = item?.product?.displaySwatch;
      const swatchesToDisplay = item?.product?.swatchInfo?.swatchesToDisplay;
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
    }, []);

    const PRESET_MAP = useMemo(() => {
      return getPresetMap(
        isConciergeRHRImage,
        isRHRImage,
        item?.product?.pgImagePresetOverride
      );
    }, [isConciergeRHRImage, isRHRImage, item?.product?.pgImagePresetOverride]);

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
          return rawURL;
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
        cols
      ]
    );

    const triggerAnalyticsEvent = () => {
      if (!isServer) {
        const itemList = [
          {
            item_name: item?.product?.displayName,
            item_id: item?.product?.repositoryId,
            item_category: productTitle,
            item_variant: null,
            quantity: null,
            price: item?.product?.priceInfo,
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
              id: item?.product?.repositoryId,
              displayName: item?.product?.displayName
            }
          )
        );
      }
    };

    const imagesArr = useMemo(() => {
      const product = item?.product;
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
    }, [item?.product, productSwatchImage]);

    const imageAlternativeName = useMemo(() => {
      let name = "";
      if (Boolean(item?.product?.skuOptiondata)) {
        const optionData: any = item?.product?.skuOptiondata
          ? stringToObject(item?.product?.skuOptiondata)
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
          name = `${item?.product?.displayName} with ${optionData?.Color} fabric and ${optionData?.Finish} finish`;
        } else if (optionData.hasOwnProperty("Finish")) {
          name = `${item?.product?.displayName} in ${optionData?.Finish} finish`;
        } else if (optionData.hasOwnProperty("Color")) {
          name = `${item?.product?.displayName} in ${optionData?.Color}`;
        } else {
          name = item?.product?.displayName || "";
        }
      } else {
        name = item?.product?.displayName || "";
      }

      return name;
    }, [item, stringToObject]);

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
      const swatches = item?.product?.swatchInfo?.swatchesToDisplay || [];
      const displaySwatch = item?.product?.displaySwatch;
      return swatches.length > 0 && displaySwatch !== selectedSwatch;
    }, [
      isColorizable,
      selectedSwatchIdx,
      isSwatchSelected,
      item?.product?.swatchInfo?.swatchesToDisplay,
      item?.product?.displaySwatch,
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
        {productSwatchLoading && !processEnvServer ? (
          <div
            className={`align-center relative my-1.5 flex h-full justify-center sm:my-2 md:my-2.5`}
            style={{
              minHeight: spinnerHeight,
              height: spinnerHeight
            }}
          >
            <RHSpinner />
          </div>
        ) : !!imagesArr?.length ? (
          <ImageCarousel
            id={item?.product?.repositoryId}
            fallbackImage={(item?.product?.alternateImages || [])[0]?.imageUrl}
            setIsColorizable={setIsColorizable}
            colorizable={item?.product?.colorizable ?? false}
            slides={imagesArr ?? []}
            linkToPage={to}
            openInNewTab={openInNewTab}
            triggerAnalyticsEvent={triggerAnalyticsEvent}
            presetImage={presetImage}
            imageAlternativeName={imageAlternativeName}
            onProductClick={onProductClick}
            imageFlip={Boolean(item?.product?.imageFlip)}
            isClicked={IsClicked}
            setIsClicked={setIsClicked}
            imageStyle={productDetails?.imageStyle || {}}
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
          />
        ) : null}
        {showColorPreviewAvailableSoonBanner ? (
          <div
            style={{
              background: "rgba(0, 0, 0, 0.4)",
              top: `${dynamicTopBanner}px`
            }}
            className="absolute z-40 flex h-16 w-full items-center justify-center bg-black/40"
          >
            <Typography
              className={clsx(typographyStyles.rhBaseBody1, "!text-white")}
            >
              {pageContent?.COLOR_PREVIEW_AVAILABLE_SOON ||
                COLOR_PREVIEW_AVAILABLE_SOON}
            </Typography>
          </div>
        ) : null}
        <div className={`flex h-full w-full flex-col flex-wrap content-around`}>
          <div
            className={`flex h-full flex-col`}
            style={{ width: `${productDetails?.imageContainerStyle?.width}px` }}
          >
            <RHLink to={to} target={openInNewTab ? "_blank" : "_self"}>
              {/* !!NOTE :: on change of line height or padding please update calculateMaxHeightOfCaption with changed values  to get correct minHeight*/}
              <Typography
                className={clsx(
                  `my-0 pt-1.5 font-primary-thin text-[10px] leading-[13.2px] text-black sm:pt-2.5 sm:text-[13px] sm:leading-5 lg:pt-1.5 `,
                  {
                    "text-center": !!item?.product?.rhr,
                    "text-left": !item?.product?.rhr
                  }
                )}
                style={{
                  minHeight: `${productDetails?.captionMinHeight}px`,
                  width: `${productDetails?.imageContainerStyle?.width}px`
                }}
                dangerouslySetInnerHTML={{
                  __html: `${item?.product?.galleryDescription} `
                }}
              />

              <PD
                product={item?.product!}
                isStockedFilterActive={isStockedFilterActive}
                isRefinementFilterActive={isRefinementFilterActive}
                productSku={item?.sku!}
                isSale={isSale}
                host={host}
                totalNumRecs={totalNumRecs}
                isSaleFilterEnabled={isSaleFilterEnabled}
                gridColumns={gridColumns}
                saleUrl={saleUrl}
                inStockFlow={inStockFlow}
              />
            </RHLink>
            {item?.product?.swatchInfo?.swatchesToDisplay?.length ? (
              <div className="flex grow flex-col justify-end">
                <div
                  className={clsx(
                    `mt-[20px] grid auto-cols-max grid-flow-col !gap-[3px] gap-x-0.5 md:mt-4 lg:mt-5`,
                    {
                      "mx-auto  place-content-center": item?.product?.rhr,
                      "place-content-start": !item?.product?.rhr
                    }
                  )}
                >
                  {item?.product?.swatchInfo?.swatchesToDisplay
                    ?.slice(0, 6)
                    ?.map((swatch, index) => {
                      const showUnderline =
                        (selectedSwatch === swatch?.swatchId ||
                          isSwatchSelected) &&
                        selectedSwatchIdx === index;

                      return (
                        // Heights are created as arbitrary values for now, Need to move to global config or change body style rem
                        <div
                          className="inline-flex flex-col"
                          key={`swatch-${swatch?.swatchId || index}`}
                        >
                          <button
                            className="inline-block aspect-[2/1] !h-3 !p-0 sm:aspect-[2.5/1] lg:!h-4 xl:!h-5"
                            aria-label={`${swatchAriaLabel(
                              swatch?.displayName
                            )}`}
                            onClick={e => {
                              setIsSwatchSelected(true);
                              onSwatchClickHandler(e, index, swatch);
                            }}
                          >
                            <RHImageV2
                              src={swatch.imageUrl}
                              alt={swatchAriaLabel(swatch?.displayName)}
                            />
                          </button>
                          <div
                            className={clsx([
                              `!mt-[3px] !h-[0.03rem] !border-black !px-[1px] !py-0`,
                              showUnderline ? "" : "opacity-0"
                            ])}
                            style={{
                              border: "0.5px solid"
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

export const PC = memoize(ProductCard);
