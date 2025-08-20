import React, { FC, RefObject, useMemo } from "react";
import { TailwindSkeleton as Skeleton } from "@RHCommerceDev/component-tailwind-skeletons";
import { Card, CardContent, CardMedia } from "@mui/material";
import { IMAGE_ASPECT_RATIO } from "@RHCommerceDev/utils/constants";
import { ImageSkeleton } from "@RHCommerceDev/skeleton-image";
import clsx from "clsx";

export interface RHRProductCardSkeleton {
  disableProductInfoSkeleton?: boolean;
  animation?: "pulse" | "wave" | false;
  width?: string;
}

export const RHRProductCardSkeleton: FC<RHRProductCardSkeleton> = ({
  disableProductInfoSkeleton,
  animation,
  width
}) => {
  return (
    <Card elevation={0} square style={{ width: width }}>
      <CardMedia>
        <ImageSkeleton
          aspectRatio={IMAGE_ASPECT_RATIO["productCard"]}
          animation={animation}
        />
      </CardMedia>
      {!disableProductInfoSkeleton && (
        <CardContent style={{ paddingLeft: 0 }}>
          <Skeleton animation={animation} />
          <Skeleton width="30%" animation={animation} />
          <Skeleton width="60%" animation={animation} />
        </CardContent>
      )}
    </Card>
  );
};

export interface RHRProductListSkeletonProps {
  columns: any;
  numItems: number;
  hasBanner?: boolean;
  disableProductInfoSkeleton?: boolean;
  animation?: "pulse" | "wave" | false;
  styleProps?: React.CSSProperties;
  skeletonRef?: RefObject<HTMLDivElement> | null;
}

export const RHRProductListSkeleton: FC<RHRProductListSkeletonProps> = ({
  hasBanner,
  columns,
  numItems,
  disableProductInfoSkeleton,
  animation,
  styleProps = {},
  skeletonRef
}) => {
  const imageFlexBoxWidth = useMemo(() => {
    return columns === 4 ? "30.3%" : columns === 6 ? "47.5%" : "100%";
  }, [columns]);
  return (
    <>
      <div
        style={styleProps}
        ref={skeletonRef}
        data-testid={`productGallery-loading`}
      >
        {columns > 0 ? (
          <div
            className={clsx(
              `inline-flex mb-8 md:mb-9 lg:mb-[60px] flex-wrap gap-x-4 sm:gap-x-8 md:gap-x-10 gap-y-7 sm:gap-y-12 md:gap-y-[60px] lg:gap-y-20 xl:gap-y-24 w-full`
            )}
          >
            {Array.from(new Array(numItems)).map((item, index) => (
              <div style={{ width: imageFlexBoxWidth }}>
                <RHRProductCardSkeleton
                  key={`${index}`}
                  disableProductInfoSkeleton={disableProductInfoSkeleton}
                  animation={animation}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default RHRProductListSkeleton;
