import memoize from "utils/memoize";
import React, { FC, useMemo } from "react";
import { useFetchModel } from "hooks/useFetchModel";
import { usePageContent } from "customProviders/LocationProvider";
import { useLocation } from "react-router-dom";
import { Theme, useMediaQuery } from "@mui/material";
import useTypographyStyles from "hooks/useTypographyStyles";
import { useRhUserAtomValue } from "hooks/atoms";
import clsx from "clsx";
import RHRPriceDisplay from "@RHCommerceDev/component-rh-price-range-display/RHRPriceDisplay";
import { getPriceUserType } from "..";
import OptionsDetailsList from "component-options-details-list";
import { SkuLabelMobile } from "component-search-result-card";
import { getMemberSavingsText } from "utils/memberSavingsTextUtils";

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
  const { pathname } = useLocation();
  const isAemPage = !pathname?.includes(".jsp");
  const { pageContent } = !isAemPage
    ? usePageContent()
    : useFetchModel("/admin/products", false, false);
  const { userType } = useRhUserAtomValue();
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

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
