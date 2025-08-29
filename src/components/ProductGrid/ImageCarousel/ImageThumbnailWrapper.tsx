import { ImageListProps } from "@mui/material";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious
// } from "@RHCommerceDev/component-global-carousel";
// import { processEnvServer } from "hooks/useSsrHooks";
// import RHImageV2 from "@RHCommerceDev/rh-image-component";
import clsx from "clsx";
// import NextArrow from "@RHCommerceDev/component-rh-carousel/NextArrow";
// import PreviousArrow from "@RHCommerceDev/component-rh-carousel/PreviousArrow";
// import PlayIcon from "icons/PlayIcon";
import React, { Dispatch, FC, SetStateAction } from "react";
// import { IMAGE_ASPECT_RATIO } from "utils/constants";

// Placeholder implementations
const Carousel = (props: any) => <div>{props.children}</div>;
const CarouselContent = (props: any) => <div>{props.children}</div>;
const CarouselItem = (props: any) => <div>{props.children}</div>;
const CarouselNext = (props: any) => <div>{props.children}</div>;
const CarouselPrevious = (props: any) => <div>{props.children}</div>;
const processEnvServer = false;
const RHImageV2 = (props: any) => <img src={props.src} alt={props.alt} className={props.className} />;
const NextArrow = (props: any) => <div>{props.children}</div>;
const PreviousArrow = (props: any) => <div>{props.children}</div>;
const PlayIcon = (props: any) => <div>PlayIcon</div>;
const IMAGE_ASPECT_RATIO = { thumbnail: "1/1" };

interface ProductAlternateImage {
  imageUrl: string;
  video?: string;
}

export interface ImageThumbnailListProps
  extends Omit<ImageListProps, "children"> {
  direction?: "row" | "column";
  images: (ProductAlternateImage & { id: number; name?: string })[];
  index: number | undefined;
  imageCarousels?: boolean;
  onChangeIndex?: (index: number | undefined) => void;
  parentBaseId?: string;
  infiniteScroll?: boolean;
  isPdp?: boolean;
  extraOperations: {
    isArrowsClicked?: boolean;
    setIsArrowsClicked?: Dispatch<SetStateAction<boolean>>;
  };
}

export const ImageThumbnailWrapper: FC<ImageThumbnailListProps> = ({
  images,
  index,
  onChangeIndex,
  extraOperations
}) => {
  return (
    <div
      id={"component-image-thumbnail-list"}
      key={"component-image-thumbnail-list"}
      data-testid={"component-image-thumbnail-list"}
      className={`w-full`}
    >
      <Carousel
        slideToShow={5}
        scrollToSlide={index}
        carouselLength={images?.length}
        opts={{
          align: "start",
          dragFree: true
        }}
      >
        <CarouselContent>
          {images.map((subItem, idx) => (
            <CarouselItem
              key={idx}
              className="md:basis-1/5 lg:basis-1/5"
              data-testid="carousel-thumbnail-image"
            >
              <div
                className={clsx(
                  "relative box-border overflow-auto overflow-y-hidden",
                  "m-[0.8rem] h-auto",
                  {
                    "border-white border-[3px]":
                      (index === -1 ? 0 : index) === subItem?.id,
                    "outline outline-[1px] outline-black":
                      (index === -1 ? 0 : index) === subItem?.id
                  }
                )}
                id="thumbnail-wrapper"
              >
                <RHImageV2
                  src={subItem.imageUrl || "/placeholder.png"} // Added fallback
                  alt={subItem.name || ""}
                  className={`h-full !object-contain cursor-pointer bg-transparent`}
                  style={{
                    aspectRatio: `${IMAGE_ASPECT_RATIO["thumbnail"]}`
                  }}
                  onClick={() => {
                    extraOperations.setIsArrowsClicked?.(false);
                    onChangeIndex?.(subItem?.id);
                  }}
                  data-testid="rh-image"
                />
                {Boolean(subItem?.video) && (
                  <PlayIcon className="absolute left-0 right-0 top-0 bottom-0 m-auto text-white pointer-events-none !text-[40px]" />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {images?.length > 5 &&
          (!processEnvServer ? (
            <CarouselPrevious>
              <PreviousArrow
                icon={"yes"}
                prevArrowAccessibilityProps={{
                  style: {
                    position: "absolute"
                  }
                }}
                carouselArrowGridStyles={{
                  left: "20px"
                }}
              />
            </CarouselPrevious>
          ) : (
            <PreviousArrow
              icon={"yes"}
              prevArrowAccessibilityProps={{
                style: {
                  position: "absolute",
                  "--tw-translate-y": "-70%"
                }
              }}
              carouselArrowGridStyles={{
                left: "-20px"
              }}
            />
          ))}
        {images?.length > 5 &&
          (!processEnvServer ? (
            <CarouselNext>
              <NextArrow
                nextArrowAccessibilityProps={{
                  style: {
                    position: "absolute",
                    "--tw-translate-y": "-70%"
                  }
                }}
                carouselArrowGridStyles={{
                  right: "20px"
                }}
                icon={"yes"}
              />
            </CarouselNext>
          ) : (
            <NextArrow
              nextArrowAccessibilityProps={{
                style: {
                  position: "absolute"
                }
              }}
              carouselArrowGridStyles={{
                  right: "-20px"
                }}
                icon={"yes"}
              />
            ))}
      </Carousel>
    </div>
  );
};

export default ImageThumbnailWrapper;