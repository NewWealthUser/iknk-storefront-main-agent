import React, { FC, useMemo } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Placeholder for RH.COM specific utilities/components
const memoize = (Component: any) => Component;
const useFetchModel = (url: string, arg1: boolean, arg2: boolean) => ({ pageContent: { NEW: "New", STARTING_AT: "Starting At" } });
const usePageContent = () => ({ pageContent: { NEW: "New", STARTING_AT: "Starting At" } });
const useTypographyStyles = (props: any) => ({ rhBaseBody1: "" });
const useRhUserAtomValue = () => ({ userType: "" });
const RHRPriceDisplay = (props: any) => <div>Price Display Placeholder</div>;
const OptionsDetailsList = (props: any) => <div>Options Details List Placeholder</div>;
const SkuLabelMobile = (props: any) => <div>Sku Label Mobile Placeholder</div>;
const getMemberSavingsText = (pageContent: any, percentSaleSkus: number, min: number, max: number) => "";
const getPriceUserType = (userType: string, price: any) => price; // Placeholder

// Placeholder for MUI components
const useMediaQuery = (query: any) => true;

// Placeholder types
interface SearchRecordProduct {
  newProduct?: boolean;
  displayName?: string;
  percentSaleSkus?: number;
  memberSavingsMin?: number;
  memberSavingsMax?: number;
  rhr?: boolean;
  priceInfo?: {
    listPrices?: number[];
    memberPrices?: number[];
    nextGenDrivenOnSale?: boolean;
    skulowestMemberPrice?: number;
    overridePriceLabel?: string;
  };
  skuPriceInfo?: {
    listPrice?: number;
    memberPrice?: number;
    onSale?: boolean;
    skulowestMemberPrice?: number;
    skuOptions?: ProductItemOption[];
  };
  uxAttributes?: {
    membershipProduct?: string;
    giftCert?: string;
  };
  customProduct?: boolean;
}

interface SearchRecordSku {
  fullSkuId?: string;
}

interface ProductItemOption {
  optionType?: string;
  label?: string;
}

interface ProductDetailsProps {
  product: SearchRecordProduct;
  isStockedFilterActive: boolean;
  isRefinementFilterActive: boolean;
  productSku?: SearchRecordSku;
  gridColumns?: any;
  isSale?: boolean;
  host?: string;
  totalNumRecs: number;
  isSaleFilterEnabled?: boolean;
  selectedSwatch?: string | null;
  saleUrl?: string;
  inStockFlow?: boolean;
}

const ProductDetails: FC<ProductDetailsProps> = ({
  product,
  isStockedFilterActive,
  productSku,
  isSaleFilterEnabled,
  gridColumns,
  saleUrl,
  inStockFlow = true
}) => {
  if (!inStockFlow) {
    isStockedFilterActive = inStockFlow;
  }
  const pathname = usePathname();
  const isAemPage = !pathname?.includes(".jsp");
  const { pageContent } = !isAemPage
    ? usePageContent()
    : useFetchModel("/admin/products", false, false);
  const { userType } = useRhUserAtomValue();
  const mdUp = true;
  const smDown = true;

  const centerAlignFlag = product?.rhr;

  const isNewPriceComponent = !isStockedFilterActive;

  const percentSaleSkus = Number(product?.percentSaleSkus);

  const dynamicMemberSavingsText = getMemberSavingsText(
    pageContent,
    percentSaleSkus,
    Number(product?.memberSavingsMin),
    Number(product?.memberSavingsMax)
  );

  const wrapPrices = useMemo(() => {
    return smDown && gridColumns === 6;
  }, [smDown, gridColumns]);

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

  return (
    <>
      <div className="flex flex-col">
        <div className="mt-1.5 sm:mt-2 md:mt-2.5">
          <div
            className={clsx(`uppercase ${typographyStyles.rhBaseBody1!}`, {
              "text-center": centerAlignFlag,
              "pr-6 text-left": !centerAlignFlag
            })}
          >
            {product.newProduct && (
              <span className=" font-primary-rhroman text-[13px] uppercase leading-[13.2px] text-black sm:leading-5">
                {pageContent?.NEW}{" "}
              </span>
            )}
            <span
              className=" font-primary-thin text-[13px] uppercase leading-[13.2px] text-gray-1 sm:leading-5"
              dangerouslySetInnerHTML={{
                __html: product?.displayName?.replace(/(?<=\d)\\+/g, "") || ""
              }}
            />
          </div>
        </div>

        {isNewPriceComponent ? (
          <RHRPriceDisplay
            productName={product?.displayName || null}
            listPrice={product?.priceInfo?.listPrices?.[0]!}
            memberPrice={product?.priceInfo?.memberPrices?.[0]!}
            topLabel={
              !isStockedFilterActive
                ? product.priceInfo?.overridePriceLabel?.trim() ||
                  pageContent?.["STARTING_AT"]
                : ""
            }
            isSaleFilterEnabled={isSaleFilterEnabled!}
            onSale={product?.priceInfo?.nextGenDrivenOnSale!}
            skulowestMemberPrice={product?.priceInfo?.skulowestMemberPrice!}
            showSaleMessage={
              Number(product?.percentSaleSkus) === 0 ||
              Number(product?.percentSaleSkus) === 100
                ? false
                : true
            }
            userType={userType!}
            pageContent={pageContent}
            computedSalePageContent={dynamicMemberSavingsText}
            wrapPrices={wrapPrices}
            variant={"small"}
            centerAlignFlag={Boolean(centerAlignFlag)}
            showMembershipProductPrice={
              product?.uxAttributes?.membershipProduct?.toLowerCase() === "true"
            }
            showGiftCardPrice={
              product?.uxAttributes?.giftCert?.toLowerCase() === "true"
            }
            isCustomProduct={product?.customProduct!}
            hideCss={gridColumns === 12}
            saleUrl={saleUrl}
            showInline={smDown}
          />
        ) : (
          <RHRPriceDisplay
            productName={product?.displayName || null}
            listPrice={product?.skuPriceInfo?.listPrice!}
            memberPrice={getPriceUserType(userType!, product?.skuPriceInfo)!}
            topLabel={""}
            onSale={product?.skuPriceInfo?.onSale!}
            skulowestMemberPrice={
              getPriceUserType(userType!, product?.skuPriceInfo)!
            }
            showSaleMessage={false}
            userType={userType!}
            pageContent={pageContent}
            wrapPrices={wrapPrices}
            variant={"small"}
            centerAlignFlag={Boolean(centerAlignFlag)}
            showMembershipProductPrice={
              product?.uxAttributes?.membershipProduct?.toLowerCase() === "true"
            }
            showGiftCardPrice={
              product?.uxAttributes?.giftCert?.toLowerCase() === "true"
            }
            isCustomProduct={product?.customProduct!}
            hideCss={true}
            source="instock"
          />
        )}

        <div>
          {product?.skuPriceInfo && (
            <>
              {mdUp ? (
                <OptionsDetailsList
                  itemId={productSku?.fullSkuId || ""}
                  options={product?.skuPriceInfo?.skuOptions || []}
                  isStocked={isStockedFilterActive}
                  centerAlignFlag={centerAlignFlag!}
                />
              ) : (
                <>
                  {product.skuPriceInfo?.skuOptions?.map(
                    (option: ProductItemOption) => (
                      <SkuLabelMobile
                        label={option.optionType}
                        value={option.label}
                        centerAlignFlag={centerAlignFlag!}
                      />
                    )
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export const PD = memoize(ProductDetails);