import React, {
  CSSProperties,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from "react";
import { useInView } from "react-intersection-observer";
// import analyticsLoader from "analytics/loader"; // RH.COM specific
// import RHImageV2 from "@RHCommerceDev/rh-image-component"; // RH.COM specific
// import RHLink from "component-rh-link"; // RH.COM specific
// import RHRPriceDisplay from "@RHCommerceDev/component-rh-price-range-display/RHRPriceDisplay"; // RH.COM specific
// import { usePageContent } from "customProviders/LocationProvider"; // RH.COM specific
// import { SaleContextFilter } from "graphql-client/queries/app"; // RH.COM specific
import he from "he";
// import { useRhUserAtomValue } from "hooks/atoms"; // RH.COM specific
// import useAppData from "hooks/useAppData"; // RH.COM specific
// import { useParams2 } from "hooks/useParams"; // RH.COM specific
// import { processEnvServer } from "hooks/useSsrHooks"; // RH.COM specific
// import useTypographyStyles from "hooks/useTypographyStyles"; // RH.COM specific
// import { memoryStorage } from "utils/analytics/storage"; // RH.COM specific
// import {
//   BREAKPOINT_MD,
//   IMAGE_ASPECT_RATIO,
//   PAGE_BG_GREY
// } from "utils/constants"; // RH.COM specific
// import { createStyles, makeStyles } from "@mui/styles"; // MUI styling, might need refactoring
// import {
//   Card,
//   CardContent,
//   CardMedia,
//   Theme,
//   useMediaQuery
// } from "@mui/material"; // MUI components, might need replacement
// import memoize from "utils/memoize"; // RH.COM specific
// import useGetPDPRedirectPath from "hooks/useGetPDPRedirectPath"; // RH.COM specific
// import { getMemberSavingsText } from "utils/memberSavingsTextUtils"; // RH.COM specific
// import { TailwindTypography as Typography } from "@RHCommerceDev/component-tailwind-typography"; // RH.COM specific
// import { cn } from "@RHCommerceDev/utils/cn"; // RH.COM specific

// Medusa storefront imports (placeholders for now)

import Link from "next/link"; // Next.js Link
import { RhProduct, RhImage, RhPriceRangeDisplay } from "@lib/util/rh-product-adapter"; // Our adapter types

// Placeholder for RH.COM specific utilities/components
const RHImageV2 = ({ src, alt, className, style, containerProps, onLoad, onError, skeletonComponent, ...props }: any) => <img src={src} alt={alt} className={className} style={style} {...props} />;
const RHLink = ({ to, children, ...props }: any) => <Link href={to} {...props}>{children}</Link>;
const RHRPriceDisplay = (props: any) => <div>Price Display Placeholder</div>; // Simplified
const Typography = (props: any) => <p {...props}>{props.children}</p>; // Simplified
const cn = (...args: any[]) => args.filter(Boolean).join(' '); // Simplified cn utility

// Placeholder for MUI components and styles
const Card = (props: any) => <div {...props}>{props.children}</div>;
const CardContent = (props: any) => <div {...props}>{props.children}</div>;
const CardMedia = (props: any) => <div {...props}>{props.children}</div>;
const useStyles = () => ({ productNamePrice: {} }); // Simplified
const useMediaQuery = (query: any) => true; // Simplified

export interface IknkProductCardProps {
  data: RhProduct;
  showPriceRange?: boolean;
  // saleContextFilter?: SaleContextFilter; // RH.COM specific
  upsell?: string;
  objectFit?: string;
  cardContentRef?: (ref: HTMLDivElement) => void;
  color?: string;
  colorBg?: string;
  isImageEager?: boolean;
  onViewSelectItemsOnSaleClick?: () => void;
  drivedStyles?: CSSProperties;
  cardIndex?: number;
  isObserver?: boolean;
  setActiveDot?: Dispatch<SetStateAction<number>>;
  maxContainerHeight?: number;
  maxUpsellHeight?: number[];
  setMaxUpSetHeight?: Dispatch<SetStateAction<number[]>>;
  totalUpSell?: number;
  RHImageStyles?: any;
  cardMediaStyles?: any;
  RHImageContainerProps?: any;
  isUpsellProduct?: boolean;
  imageSkeletonProps?: {
    className?: string;
  };
  RHImageProps?: any;
  cardStyles?: any;
  // Added missing props
  isSale?: boolean;
  isSaleFilterEnabled?: boolean;
  totalNumRecs?: number;
  isStockedFilterActive?: boolean;
  isRefinementFilterActive?: boolean;
  gridColumns?: any;
  filterQueries?: string[];
  pageContent?: any;
  productTitle?: string;
  onProductClick?: (index: number) => void;
  inStockFlow?: boolean;
  isSelectedItem?: boolean;
}

export const IknkProductCard: FC<IknkProductCardProps> = React.memo(
  // TODO: analytics remove "upsell" param here
  ({
    data,
    showPriceRange = true,
    cardContentRef,
    color,
    objectFit,
    colorBg = "#f5f5f5", // PAGE_BG_GREY placeholder
    cardIndex = 0,
    isObserver = false,
    setActiveDot = () => {},
    maxContainerHeight = 0,
    maxUpsellHeight = [],
    setMaxUpSetHeight = () => {},
    totalUpSell = 0,
    RHImageStyles = {},
    cardMediaStyles = {},
    RHImageContainerProps = {},
    isUpsellProduct = false,
    imageSkeletonProps = {},
    RHImageProps = {},
    cardStyles = {}
  }) => {
    const classes = useStyles();
    // const typographyClasses = useTypographyStyles({
    //   keys: ["rhBaseH7", "rhBaseCaption", "rhBaseBody1"]
    // });
    const mdUp = useMediaQuery(true); // Simplified
    const [isLoading, setIsLoading] = useState("success");

    // const { params } = useParams2<{ [key: string]: string }>(
    //   { version: "" },
    //   { toLowerCase: true }
    // );
    // const { userType } = useRhUserAtomValue();

    const { ref: observerRef, inView } = useInView();

    // const isLatestPDPLayout =
    //   memoryStorage.getItem("newPdpLayout") || params.version === "v2";
    const isLatestPDPLayout = false; // Placeholder

    useEffect(() => {
      if (isObserver) {
        if (inView) {
          setActiveDot(cardIndex);
        }
      }
    }, [inView]);

    // const { pageContent } = usePageContent();
    const pageContent = { NEW: "New", STARTING_AT: "Starting At" }; // Placeholder

    const priceRangeDisplay: RhPriceRangeDisplay | undefined = useMemo(() => {
      // Simplified logic for priceRangeDisplay
      return data.priceRangeDisplay;
    }, [data.priceRangeDisplay]);

    // const dynamicMemberSavingsText = getMemberSavingsText(
    //   pageContent,
    //   Number(data?.saleInfo?.percentSaleSkus),
    //   Number(data?.saleInfo?.memberSavings?.memberSavingsMin),
    //   Number(data?.saleInfo?.memberSavings?.memberSavingsMax)
    // );
    const dynamicMemberSavingsText = ""; // Placeholder

    if (data.id === "BLANK") {
      return null;
    }

    const imageStyle = useMemo(() => {
      let style;
      try {
        style = data?.metadata?.rhr ? JSON.parse(data?.metadata?.pgCropRules as string || '{}') : {};
      } catch (error) {
        style = {};
      }
      if (isLatestPDPLayout) {
        return { ...style, maxHeight: "100%" } as CSSProperties;
      }
      return style as CSSProperties;
    }, [data?.metadata?.pgCropRules, data?.metadata?.rhr]);

    // const triggerAnalyticsEvent = () => {
    //   if (!processEnvServer) {
    //     const itemList = [
    //       {
    //         item_name: data?.displayName,
    //         item_id: data?.id,
    //         item_category: null,
    //         item_variant: null,
    //         quantity: null,
    //         price: data?.priceRangeDisplay,
    //         item_list_name: window?.location?.href?.includes("/search/")
    //           ? "search"
    //           : window?.location?.href?.includes("products.jsp")
    //           ? "pg"
    //           : null
    //       }
    //     ];

    //     analyticsLoader(a =>
    //       a.emitAnalyticsEvent(
    //         document.querySelector("#spa-root > *")! as HTMLElement,
    //         a.EVENTS.SELECT_ITEM.INT_TYPE,
    //         {
    //           itemList,
    //           item_list_name: "PG",
    //           id: data?.id,
    //           displayName: data?.displayName
    //         }
    //       )
    //     );
    //   }
    // };
    const triggerAnalyticsEvent = () => console.log("Analytics event triggered for", data.displayName); // Placeholder

    // const redirectPath = useGetPDPRedirectPath(data);
    // const redirectPathSale = useGetPDPRedirectPath(data, true);
    const redirectPath = `/products/${data.handle}`; // Simplified redirect path
    const redirectPathSale = `/products/${data.handle}?sale=true`; // Simplified redirect path

    return (
      <div
        data-testid={`iknk-test-container`}
        key={`reveal-${data.id}`}
        className={cn([
          "opacity-0",
          "animate-fadeInUp",
          isLatestPDPLayout
            ? `w-full sm:w-[296px] md:w-[253px] lg:w-[323px] xl:w-[429px]`
            : "",
          "!animate-custom-animation !opacity-100",
          // can be removed below code once the feature flag Embla carousel is removed new upSell code has its own product details code
          isUpsellProduct ? "pl-5" : ""
        ])}
      >
        <Card
          elevation={0}
          square
          style={{
            backgroundColor: colorBg,
            ...(maxContainerHeight ? { height: maxContainerHeight } : {}),
            position: "relative"
          }}
        >
          <RHLink
            data-testid={`productCardLink-${data.id}`}
            to={redirectPath}
            tabIndex={-1}
            underline="none"
            onClick={triggerAnalyticsEvent}
          >
            {data?.metadata?.isShopByRoom ? (
              <CardMedia
                className={`[&.MuiGrid-root.MuiGrid-container]:justify-center `}
                style={{
                  ...data?.metadata?.imageContainerStyle,
                  ...cardMediaStyles,
                  display: "flex",
                  alignItems: "center",
                  alignContent: "center",
                  // can be removed below code once the feature flag Embla carousel is removed
                  ...(isUpsellProduct && {
                    height: data?.metadata?.imageContainerStyle?.height ?? 400
                  }),
                  ...cardStyles
                }}
              >
                <RHImageV2
                  src={data?.imageUrl}
                  alt={data.displayName}
                  className="mx-auto object-contain"
                  // preset={mdUp ? "pg-card-md" : "pg-card-xs"} // RH.COM specific
                  style={{
                    ...(data?.metadata?.imageStyle || {}),
                    maxWidth: "100%",
                    ...RHImageStyles
                  }}
                  containerProps={RHImageContainerProps}
                  onLoad={() => setIsLoading("success")}
                  onError={() => setIsLoading("error")}
                  skeletonComponent={() => null}
                  {...RHImageProps}
                />
              </CardMedia>
            ) : (
              <CardMedia className="flex flex-col justify-end [&.MuiGrid-root.MuiGrid-container]:justify-center">
                <RHImageV2
                  src={data?.imageUrl}
                  alt={data.displayName}
                  className={cn("h-auto w-auto max-w-full", {
                    "w-full sm:w-[296px] md:w-[253px] lg:w-[323px] xl:w-[429px]":
                      isLatestPDPLayout
                  })}
                  // preset={mdUp ? "pg-card-md" : "pg-card-xs"} // RH.COM specific
                  style={{
                    ...imageStyle,
                    // aspectRatio: IMAGE_ASPECT_RATIO["productCard"], // RH.COM specific
                    objectFit: objectFit
                  }}
                  containerProps={{
                    style:
                      maxUpsellHeight.length >= totalUpSell && isLatestPDPLayout
                        ? { height: `${Math.max(...maxUpsellHeight)}px` }
                        : {}
                  }}
                />
              </CardMedia>
            )}
          </RHLink>
          <div className="flex justify-center">
            <span ref={observerRef}></span>
          </div>
          <RHLink
            data-testid={`productCardLink-${data.id}`}
            to={redirectPath}
            tabIndex={-1}
            underline="none"
            // bypassForceReload={
            //   data?.priceRangeDisplay?.priceMessage &&
            //   (data?.priceRangeDisplay?.salePrices?.[0] ||
            //     data?.priceRangeDisplay?.priceMessagePrice)
            //     ? true
            //     : false
            // } // RH.COM specific
            onClick={triggerAnalyticsEvent}
          >
            <CardContent className="!p-0" ref={cardContentRef}>
              <div
                className={cn(
                  isLatestPDPLayout ? "mt-8" : "mt-5",
                  data?.metadata?.rhr ? "text-center" : "text-left"
                )}
              >
                <Typography
                  data-testid={`display-test-id`}
                  className={cn(
                    isLatestPDPLayout
                      ? "flex-grow-0 self-stretch text-center font-primary-light text-[13px] font-extralight !leading-none tracking-[0.26px] text-black"
                      : "font-thin !leading-[15.6px] tracking-normal text-black",
                    `mb-1 !uppercase`,
                    isLatestPDPLayout || data?.metadata?.rhr
                      ? "text-center"
                      : "text-left",
                    classes.productNamePrice,
                    // typographyClasses.rhBaseBody1 // RH.COM specific
                  )}
                >
                  <span
                    style={{
                      color: color,
                      background: colorBg
                    }}
                    className="font-primary-rhroman text-[13px]"
                    dangerouslySetInnerHTML={{
                      __html: `${data.newProduct ? `${pageContent.NEW} ` : ""}`
                    }}
                  ></span>
                  <span
                    style={{
                      color: color,
                      background: colorBg
                    }}
                    dangerouslySetInnerHTML={{
                      __html: `${he.decode(data.displayName)}`
                    }}
                  ></span>
                </Typography>

                {showPriceRange && !!data?.priceRangeDisplay && (
                  <RHRPriceDisplay
                    listPrice={priceRangeDisplay?.listPrices?.[0]!}
                    memberPrice={priceRangeDisplay?.memberPrices?.[0]!}
                    topLabel={
                      data.priceRangeDisplay?.overridePriceLabel ||
                      pageContent?.["STARTING_AT"]
                    }
                    onSale={priceRangeDisplay?.nextGenDrivenOnSale!}
                    skulowestMemberPrice={
                      priceRangeDisplay?.skulowestMemberPrice!
                    }
                    showSaleMessage={
                      Number(data?.saleInfo?.percentSaleSkus) === 0 ||
                      Number(data?.saleInfo?.percentSaleSkus) === 100
                        ? false
                        : true
                    }
                    // userType={userType!} // RH.COM specific
                    pageContent={pageContent}
                    computedSalePageContent={dynamicMemberSavingsText}
                    variant={"small"}
                    centerAlignFlag={Boolean(data?.metadata?.rhr)}
                    // showMembershipProductPrice={
                    //   data?.uxAttributes?.membershipProduct?.toLowerCase() ===
                    //   "true"
                    // } // RH.COM specific
                    // showGiftCardPrice={
                    //   data?.uxAttributes?.giftCert?.toLowerCase() === "true"
                    // } // RH.COM specific
                    isCustomProduct={data?.customProduct!}
                    isSaleFilterEnabled={false}
                    saleUrl={redirectPathSale}
                    classes={{
                      container: "pr-0"
                    }}
                  />
                )}
              </div>
              {/* size and fabrics cta here */}
            </CardContent>
          </RHLink>
        </Card>
      </div>
    );
  }
);



// export default memoize((props: Omit<ProductCardProps, "saleContextFilter">) => {
//   const { app } = useAppData();

//   return <ProductCard {...props} saleContextFilter={app.saleContextFilter} />;
// });
export default IknkProductCard; // Simplified export
