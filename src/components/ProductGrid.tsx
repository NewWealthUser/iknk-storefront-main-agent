"use client"

import React, {
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback
} from "react";
// import { Fade } from "@mui/material";

import clsx from "clsx";

// import RHPagination from "@RHCommerceDev/component-pagination";
// import ItemsPerPage from "@RHCommerceDev/component-product-grid/ItemsPerPage";

// import RHDivider from "@RHCommerceDev/component-rh-divider";

// import { usePageContent } from "custom-providers/LocationProvider";
// import { useImageSize } = "@RHCommerceDev/graphql-client/contexts/ImageSizeContext";

// import { useFetchModel } from "hooks/useFetchModel";

// import useMediaString from "@RHCommerceDev/hooks/useMediaString";
// import useParams from "@RHCommerceDev/hooks/useParams";

// import {
//   processEnvServer as isServer,
//   processEnvEnvServer
// } from "@RHCommerceDev/hooks/useSsrHooks";
import _chunk from "lodash/chunk";

// import { useHistory, useLocation } from "react-router-dom";
// import { RHRProductCardSkeleton } from "@RHCommerceDev/skeleton-rhr-product-list";
// import {
//   DEFAULT_GRID_COLUMNS,
//   DEFAULT_VIEW,
//   IMAGE_ASPECT_RATIO,
//   INITIAL_PG_IMAGE_CONTAINER_DIMENSION,
//   ITEMS_PER_PAGE_PREFERENCE,
//   PG_IMAGE_CONTAINER_DIMENSION,
//   ZERO_RESULTS
// } from "@RHCommerceDev/utils/constants";

// import prasePGCropRules from "@RHCommerceDev/utils/prasePGCropRules";

import { ProductGridCard as PC } from "./ProductGrid/ProductCard"; // Corrected import for PC
// import { showPGPaginationModule } from "@RHCommerceDev/utils/showPaginationModule";
// import { useMediaQuery, useTheme } from "@mui/material";
// import maxBy from "lodash.maxby";
// import { useSipIdValue } from "@RHCommerceDev/hooks/atoms/useSIPID";
// import { useInfiniteScroll } from "@RHCommerceDev/hooks/useInfiniteScroll";
// import { getReqContext } from "@RHCommerceDev/utils/reqContext";
// import { getSelectorsByUserAgent } from "react-device-detect";

import { RhProduct } from "@lib/util/rh-product-adapter"; // Import RhProduct

// Placeholder implementations
const RHPagination = (props: any) => <div>Pagination</div>;
const ItemsPerPage = (props: any) => <div>Items Per Page</div>;
const RHDivider = (props: any) => <div style={{ borderTop: "1px solid gray" }} />;
const usePageContent = () => ({ items_per_page_options: "[]", NEW: "New", STARTING_AT: "Starting At" });
const useImageSize = () => ({ generateGridMap: (sections: any, columns: number) => {} });
const useFetchModel = (url: string, arg1: boolean, arg2: boolean) => ({ items_per_page_options: "[]", NEW: "New", STARTING_AT: "Starting At" });
const useMediaString = () => "lg";
const useParams = (props: any) => ({
  no: "0",
  maxnrpp: "24",
  loadAll: ""
});
const isServer = false;
const processEnvServer = false;
// Removed placeholder _chunk function, relying on lodash/chunk
const useHistory = () => ({ action: "PUSH" });
const useLocation = () => ({ pathname: "" });
const RHRProductCardSkeleton = (props: any) => <div>Skeleton</div>;
const DEFAULT_GRID_COLUMNS = 4;
const DEFAULT_VIEW = "grid";
const IMAGE_ASPECT_RATIO = { verticalProductTile: 1, horizontalProductTile: 1 };
const INITIAL_PG_IMAGE_CONTAINER_DIMENSION = 100;
const ITEMS_PER_PAGE_PREFERENCE = "itemsPerPage";
const PG_IMAGE_CONTAINER_DIMENSION: { [key: number]: { [key: string]: number[] } } = {};
const ZERO_RESULTS = 0;
const prasePGCropRules = (rules: any) => ({ height: 0 });
const showPGPaginationModule = (a: any, b: any) => false;
const useMediaQuery = (query: any) => true;
const useTheme = () => ({ breakpoints: { up: (s: string) => true } });
const maxBy = (arr: any[], iteratee: (item: any) => any) => arr[0];
const useSipIdValue = () => "";
const useInfiniteScroll = (props: any) => ({ ref: null });
const getReqContext = () => ({ headers: { "user-agent": "" } });
const getSelectorsByUserAgent = (userAgent: string) => ({ isMobile: false });

// Define FEATURE_PG_DEFAULT_ITEMS_PER_PAGE
const FEATURE_PG_DEFAULT_ITEMS_PER_PAGE = false; // Assuming false for now, adjust as needed

function extractSkuOtions(option: string) {
  const facets: { [key: string]: string } = option?.split("|")?.reduce((acc: { [key: string]: string }, part) => {
    const [id, type, value] = part?.split("~~");
    acc[type?.toLowerCase()] = value;
    return acc;
  }, {});

  return facets;
}

export const getUrl = (
  item: any,
  host: string = "",
  stocked: boolean,
  isRefinementFilterActive: boolean,
  totalNumRecs: number,
  isSale: boolean,
  isConcierge?: boolean,
  filterQueries?: string[],
  selectedSwatch?: string | null,
  isNextGen = false,
  inStockFlow = true,
  isNewURLFeatureEnabled: boolean = false,
  category: string = ""
) => {
  const saleParamString = isSale ? "true" : "";
  const formattedDisplayName = item?.displayName
    ?.toLowerCase()
    .replace(/\s+/g, "-");

  const urlPath =
    isNewURLFeatureEnabled && category
      ? `/${category}/pdp/${formattedDisplayName}`
      : `/catalog/product/product.jsp/${item?.repositoryId}`;

  const url = new URL(urlPath, host || "http://www.example.com");

  {
    isSale && url.searchParams.set("sale", saleParamString);
  }

  if (item?.skuOptiondata?.length && isNextGen && !stocked) {
    const skuOptiondata = extractSkuOtions(item?.skuOptiondata);
    Object.keys(skuOptiondata)?.map(key => {
      if (skuOptiondata[key] && key) {
        url.searchParams?.set(key, skuOptiondata[key]);
      }
    });
  }

  if (selectedSwatch) {
    url.searchParams.set("swatch", selectedSwatch);
  }

  if (stocked) {
    if (inStockFlow) {
      url.searchParams.set("fullSkuId", item?.fullSkuId ?? "");
    } else {
      url.searchParams.set("inStock", "true");
    }
  }

  return {
    to: !host ? url.pathname + url.search : undefined
  };
};

interface ProductGridItem extends RhProduct {
  loader?: boolean;
}

interface ProductGridProps {
  isStockedFilterActive?: boolean;
  isRefinementFilterActive?: boolean;
  gridColumns?: any;
  view?: string;
  totalNumRecs: number;
  loadMoreData?: () => any;
  productList: ProductGridItem[];
  noLazy?: boolean;
  host?: string;
  brand?: string;
  isSort?: boolean;
  productClickHandler?: (sipId: number) => void;
  disableFadeEffect?: boolean;
  isSale?: boolean;
  isSaleFilterEnabled?: boolean;
  productTitle?: string;
  pgCropRulesFromCg?: string;
  infiniteScrollEnabled?: boolean;
  isNextPageLoading?: boolean;
  recsPerPage?: number;
  firstRecNum?: number;
  lastRecNum?: number;
  filterQueries?: string[];
  nextgenDriven?: boolean;
  inStockFlow?: boolean;
  activeTab?: any;
}
const ProductGrid: FC<ProductGridProps> = ({
  gridColumns = DEFAULT_GRID_COLUMNS,
  isStockedFilterActive = false,
  isRefinementFilterActive = false,
  totalNumRecs = ZERO_RESULTS,
  productList = [],
  loadMoreData,
  recsPerPage,
  noLazy = false,
  brand,
  isSort,
  productClickHandler,
  isSale,
  isSaleFilterEnabled,
  productTitle,
  view = DEFAULT_VIEW,
  infiniteScrollEnabled = true,
  isNextPageLoading = false,
  filterQueries,
  inStockFlow,
  activeTab
}) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("xl"));
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const smUp = useMediaQuery(theme.breakpoints.up("sm"));

  const { generateGridMap } = useImageSize();
  const [skeletonHeight, setSkeletonHeight] = useState(0);
  const [productGridColumns, setProductGridColumns] = useState<number>(4);
  const selectedProductRef = useRef<HTMLDivElement | null>(null);
  const skeletonRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { pathname } = useLocation();
  const isAemPage = !pathname?.includes(".jsp");
  const { items_per_page_options, NEW, STARTING_AT } = !isAemPage
    ? (usePageContent() as any)
    : (useFetchModel("/admin/products", false, false) as any);
  const ItemsPerPageOptions = JSON.parse(
    items_per_page_options || "[]"
  )?.filter((item: number) =>
    FEATURE_PG_DEFAULT_ITEMS_PER_PAGE ? item !== 48 && item !== 24 : item !== 24
  );

  let mobile = false;
  const req = getReqContext();
  const userAgent = req && req?.headers["user-agent"];
  if (userAgent) {
    const { isMobile } = getSelectorsByUserAgent(userAgent);
    mobile = isMobile;
  }
  const imageFlexBoxWidth = useMemo(() => {
    return gridColumns === 4
      ? lgUp
        ? "31.3%"
        : "30.3%"
      : gridColumns === 6
      ? lgUp
        ? "48.5%"
        : mdUp
        ? "47.8%"
        : "47.5%"
      : "100%";
  }, [gridColumns, mdUp, lgUp]);

  const flexboxContainerClasses = `inline-flex mb-8 md:mb-9 lg:mb-[60px] flex-wrap gap-x-4 sm:gap-x-8 md:gap-x-10 gap-y-7 sm:gap-y-12 md:gap-y-[60px] lg:gap-y-20 xl:gap-y-24 w-full`;

  useEffect(() => {
    if (infiniteScrollEnabled) return;
    window?.scrollTo(0, 0);
  }, [infiniteScrollEnabled]);

  const derivedProductList = useMemo(
    () =>
      noLazy ? productList?.slice(0, (12 / gridColumns) * 2) : productList,
    [noLazy, productList, gridColumns]
  );

  useEffect(() => {
    const sections: any = [];
    let counter = 0;
    derivedProductList?.forEach((item, i) => {
      if (i === 0) {
        sections[counter] = [i];
      }

      if (
        i > 0 &&
        item?.metadata?.anchor &&
        derivedProductList[i - 1]?.metadata?.anchor !== item?.metadata?.anchor &&
        !isSort
      ) {
        sections[counter].push(i - 1);
        counter++;
        sections[counter] = [i];
      }

      if (i === derivedProductList?.length - 1) {
        sections[counter].push(i);
      }
    });

    generateGridMap(sections, 12 / gridColumns);

    setTimeout(() => {
      if (productGridColumns !== gridColumns) {
        setProductGridColumns(gridColumns);
      }
    }, 500);
  }, [derivedProductList, gridColumns]);

  useEffect(() => {
    const newSkeletonHeight = skeletonRef?.current?.clientHeight || 40;
    if (skeletonHeight === newSkeletonHeight) return;
    setSkeletonHeight(newSkeletonHeight);
  }, [gridColumns]);

  const derivedProductListGroupedByAnchor = useMemo(
    () =>
      derivedProductList?.reduce(
        (acc: ProductGridItem[][], rec: ProductGridItem) => {
          const pgCropRules = prasePGCropRules(rec?.metadata?.pgCropRules);

          const record = {
            ...rec,
            metadata: { ...rec?.metadata, pgCropRules }
          };

          const arrayLastIndex = acc?.length - 1;
          const innerArrayLastIndex = acc?.[arrayLastIndex]?.length - 1;

          const arrayRecord = acc?.[arrayLastIndex];
          const innerArrayRecord = arrayRecord?.[innerArrayLastIndex];

          if (record?.metadata?.anchor) {
            const isTitleEqualToAnchor =
              productTitle?.toLowerCase() !==
              record?.metadata?.anchor?.toLowerCase();
            const isPrevAnchorNotEqualToNextAnchor =
              innerArrayRecord?.metadata?.anchor !== record?.metadata?.anchor;

            if (
              isTitleEqualToAnchor &&
              isPrevAnchorNotEqualToNextAnchor &&
              !isSort
            ) {
              acc?.push([record]);
            } else {
              arrayRecord?.push(record);
            }
          } else {
            if (Array.isArray(arrayRecord)) {
              arrayRecord?.push(record);
            } else {
              acc?.push([record]);
            }
          }

          return acc;
        },
        [[]]
      ),
    [derivedProductList, isSort, productTitle]
  );
  let mediaString;
  if (processEnvServer) {
    mobile ? (mediaString = "xs") : (mediaString = "xl");
  } else {
    mediaString = useMediaString();
  }

  // Utility function to calculate max height based on max string length and width
  const calculateMaxHeightOfCaption = (items: string[], width: number) => {
    // Get the string with the maximum length
    const longestString = maxBy(items, item => item?.length) || "";
    const charsPerLine = smUp ? Math.floor(width / 5) : Math.floor(width / 4);
    // Calculate number of lines based on the longest string
    const lines = Math.ceil(longestString.length / charsPerLine);
    //lineHeight and padding as taken from product card classname
    const lineHeight = smUp ? 20 : 13.2;
    const padding = lgUp ? 6 : smUp ? 10 : 6;

    const calculatedHeight = lines * lineHeight + padding;

    return calculatedHeight;
  };

  const history = useHistory();
  const sipId = useSipIdValue();
  const selectedItemId = useMemo(() => {
    if (history?.action === "POP" || history?.action === "REPLACE") {
      return Number(sipId);
    }
  }, [history?.action, sipId]);

  const parsedDerivedProductList = useMemo(() => {
    return derivedProductListGroupedByAnchor?.flatMap(derivedProductList =>
      _chunk(derivedProductList, 12 / gridColumns)?.flatMap(
        (groupedDerivedProduct: ProductGridItem[]) => {
          const imgContainerHeight = groupedDerivedProduct?.map(
            (derivedProduct: ProductGridItem) => derivedProduct?.metadata?.pgCropRules?.height
          ).filter((h): h is number => h !== undefined);

          const areAllRhr = groupedDerivedProduct?.every(
            (derivedProduct: ProductGridItem) => derivedProduct?.metadata?.rhr
          );

          const imagCaptionsArr = groupedDerivedProduct?.map(
            (derivedProduct: ProductGridItem) => derivedProduct?.galleryDescription
          ).filter((caption): caption is string => caption !== undefined);

          const maxImageContainerHeight = Math?.max(...imgContainerHeight.filter(h => h !== undefined));
          const [MAX_IMG_CONTAINER_HEIGHT] =
            PG_IMAGE_CONTAINER_DIMENSION?.[gridColumns]?.[mediaString] ??
            [INITIAL_PG_IMAGE_CONTAINER_DIMENSION];
          const imageContainerHeight = `${
            (maxImageContainerHeight / 100) * MAX_IMG_CONTAINER_HEIGHT
          }px`;
          const aspectRatio =
            view === "vertical"
              ? IMAGE_ASPECT_RATIO?.verticalProductTile
              : IMAGE_ASPECT_RATIO?.horizontalProductTile;
          return groupedDerivedProduct?.map((derivedProduct: ProductGridItem) => {
            const imgHeight = `${
              ((derivedProduct?.metadata?.pgCropRules?.height ?? 0) / 100) *
              MAX_IMG_CONTAINER_HEIGHT
            }px`;

            const captionMinHeight = calculateMaxHeightOfCaption(
              imagCaptionsArr,
              aspectRatio * MAX_IMG_CONTAINER_HEIGHT
            );

            return {
              ...derivedProduct,
              metadata: {
                ...derivedProduct?.metadata,
                captionMinHeight: captionMinHeight,
                imageStyle: {
                  objectFit: "contain",
                  alignSelf: "flex-end",
                  maxWidth: "100%",
                  maxHeight: derivedProduct?.metadata?.rhr
                    ? imgHeight
                    : MAX_IMG_CONTAINER_HEIGHT,
                  width: "auto",
                  height: "auto",
                  transitionProperty: "opacity"
                },
                imageContainerStyle: {
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  aspectRatio: derivedProduct?.metadata?.rhr
                    ? null
                    : aspectRatio?.toString(),
                  height: areAllRhr
                    ? imageContainerHeight
                    : `${MAX_IMG_CONTAINER_HEIGHT}px`,
                  maxHeight: areAllRhr
                    ? imageContainerHeight
                    : MAX_IMG_CONTAINER_HEIGHT,
                  width: aspectRatio * MAX_IMG_CONTAINER_HEIGHT
                }
              }
            };
          });
        }
      )
    );
  }, [derivedProductListGroupedByAnchor, gridColumns, mediaString, view]);

  const skeletonUi = useMemo(
    () =>
      Array.from(new Array(12 / gridColumns)).map((item: any, index) => (
        <RHRProductCardSkeleton key={`${index}`} width={imageFlexBoxWidth} />
      )),
    [gridColumns]
  );

  const storedItemsPerPagePreference = !isServer
    ? localStorage.getItem(ITEMS_PER_PAGE_PREFERENCE)
    : undefined;

  const params = useParams({
    no: "0",
    maxnrpp: storedItemsPerPagePreference ?? "24",
    loadAll: ""
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (loadMoreData && target.isIntersecting && productList.length < totalNumRecs) {
        loadMoreData();
      }
    },
    [loadMoreData, productList.length, totalNumRecs]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "50px",
      threshold: 0.5
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  const parsedDerivedProductListWithLoader = useMemo(() => {
    if (!parsedDerivedProductList) return [];
    const listWithLoader = [...parsedDerivedProductList];
    const position = listWithLoader.length - 12;
    if (position >= 0 && listWithLoader[position]) {
      listWithLoader[position].loader = true;
    }
    return listWithLoader;
  }, [parsedDerivedProductList]);

  const hasMore = useMemo(
    () => (noLazy ? false : productList?.length < totalNumRecs),
    [noLazy, productList?.length, totalNumRecs]
  );

  const { ref: infiniteScrollSkeletonRef } = useInfiniteScroll({
    callback: noLazy || !loadMoreData ? () => {} : loadMoreData,
    hasMore,
    loading: isNextPageLoading
  });

  return (
    <div
      id="component-product-grid"
      className="relative"
      style={{
        ...(infiniteScrollEnabled || isNextPageLoading
          ? {
              paddingBottom:
                productList?.length < totalNumRecs ? skeletonHeight : 0
            }
          : {})
      }}
    >
      {infiniteScrollEnabled ? (
        <div>
          <div className={flexboxContainerClasses}>
            {parsedDerivedProductListWithLoader?.map((item: ProductGridItem, index: number) => {
              return (
                <>
                  {item?.metadata?.anchor &&
                  productTitle?.toLowerCase() !==
                  item?.metadata?.anchor?.toLowerCase() ? (
                    <>
                      {item?.metadata?.anchor &&
                        parsedDerivedProductList[index - 1]?.metadata?.anchor !==
                          item?.metadata?.anchor &&
                        !isSort && (
                          <div className="col-span-full  w-full">
                            {index > 0 && <RHDivider className="!mb-[60px]" />}{" "}
                            <div className="font-primary-ultra-thin !text-[24px] uppercase">
                              {item?.metadata?.anchor}
                            </div>
                          </div>
                        )}
                    </>
                  ) : null}
                  <div
                    key={`innerGrid_item_${index}`}
                    id={`${brand}__${item?.fullSkuId}__${index}`}
                    className="productVisible mb-3 flex justify-center"
                    style={{
                      width: imageFlexBoxWidth
                    }}
                    ref={index === selectedItemId ? selectedProductRef : null}
                  >
                    <PC
                      data={item}
                      isSale={isSale}
                      isSaleFilterEnabled={isSaleFilterEnabled}
                      totalNumRecs={totalNumRecs}
                      isStockedFilterActive={isStockedFilterActive}
                      isRefinementFilterActive={isRefinementFilterActive}
                      gridColumns={productGridColumns}
                      filterQueries={filterQueries}
                      pageContent={{ NEW, STARTING_AT }}
                      productTitle={productTitle}
                      onProductClick={() => {
                        productClickHandler?.(index);
                      }}
                      inStockFlow={inStockFlow}
                      isSelectedItem={index === selectedItemId}
                    />
                    {item.loader && <div ref={loaderRef} key="loader"></div>}
                  </div>
                </>
              );
            })}
          </div>

          {isNextPageLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                columnGap: "60px"
              }}
            >
              {skeletonUi}
            </div>
          )}
        </div>
      ) : (
        <div className={clsx(flexboxContainerClasses)}>
          {parsedDerivedProductList?.map((item, index) => (
            <>
              {item?.metadata?.anchor &&
              productTitle?.toLowerCase() !==
              item?.metadata?.anchor?.toLowerCase() ? (
                <>
                  {item?.metadata?.anchor &&
                    parsedDerivedProductList[index - 1]?.metadata?.anchor !==
                      item?.metadata?.anchor &&
                    !isSort && (
                      <div className="col-span-full w-full">
                        {index > 0 && <RHDivider className="!mb-[60px]" />}{" "}
                        <div className="font-primary-ultra-thin !text-[24px] uppercase">
                          {item?.metadata?.anchor}
                        </div>
                      </div>
                    )}
                </>
              ) : null}
              <div
                key={`innerGrid_item_${index}`}
                id={`${brand}__${item?.fullSkuId}__${index}`}
                className={clsx(
                  !processEnvServer
                    ? "productVisible mb-3 flex w-full justify-center"
                    : ""
                )}
                style={{
                  width: imageFlexBoxWidth
                }}
              >
                <PC
                  data={item}
                  isSale={isSale}
                  isSaleFilterEnabled={isSaleFilterEnabled}
                  totalNumRecs={totalNumRecs}
                  isStockedFilterActive={isStockedFilterActive}
                  isRefinementFilterActive={isRefinementFilterActive}
                  gridColumns={gridColumns}
                  filterQueries={filterQueries}
                  pageContent={{ NEW, STARTING_AT }}
                  productTitle={productTitle}
                  onProductClick={() => {
                    productClickHandler?.(index);
                  }}
                  inStockFlow={inStockFlow}
                  isSelectedItem={index === selectedItemId}
                />
              </div>
            </>
          ))}
        </div>
      )}
      {showPGPaginationModule(isNextPageLoading, totalNumRecs) ? (
        <>
          {ItemsPerPageOptions.includes(+Number(params.maxnrpp)) &&
            params?.loadAll !== "true" && (
              <RHPagination
                recsPerPage={recsPerPage}
                lastRecNum={productList?.length - 1}
                totalNumRecs={totalNumRecs}
                loadMoreData={loadMoreData}
                activeTab={activeTab}
              />
            )}
          <ItemsPerPage
            recsPerPage={recsPerPage}
            lastRecNum={productList?.length - 1}
            totalNumRecs={totalNumRecs}
            loadMoreData={loadMoreData}
          />
        </>
      ) : null}
    </div>
  );
};

export default ProductGrid;