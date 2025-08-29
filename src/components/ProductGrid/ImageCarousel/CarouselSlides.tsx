import React, { FC, useCallback, useEffect, useRef } from "react";
import clsx from "clsx";
import RHImageV2 from "next/image"; // Using Next.js Image
import PlayIcon from "@modules/common/icons/play"; // Assuming a PlayIcon exists or creating one
import RHLink from "next/link"; // Using Next.js Link

interface ProductAlternateImage {
  imageUrl: string;
  video?: string;
  caption?: string;
}

interface CarouselSlidesProps {
  slides: ProductAlternateImage[];
  currentIndex: number;
  transitionEnabled: boolean;
  imageContainerStyle: React.CSSProperties;
  imageStyle: any;
  presetImage: (url: string | undefined) => string;
  imageAlternativeName: string;
  isPDP: boolean;
  pdpImageProps?: any;
  setVideo?: React.Dispatch<React.SetStateAction<string>>;
  onProductClick?: Function;
  triggerAnalyticsEvent?: Function;
  linkToPage?: string;
  openInNewTab?: boolean;
  setActualImgHeight?: React.Dispatch<React.SetStateAction<number>>;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleFlip: () => void;
  handleRemoveFlip: () => void;
}

const CarouselSlides: FC<CarouselSlidesProps> = ({
  slides,
  currentIndex,
  transitionEnabled,
  imageContainerStyle,
  imageStyle,
  presetImage,
  imageAlternativeName,
  isPDP,
  pdpImageProps,
  setVideo,
  onProductClick,
  triggerAnalyticsEvent,
  linkToPage,
  openInNewTab,
  setActualImgHeight,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleFlip,
  handleRemoveFlip,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleImageClick = useCallback(() => {
    triggerAnalyticsEvent?.();
    onProductClick?.();
  }, [triggerAnalyticsEvent, onProductClick]);

  return (
    <div
      className="embla group/item group relative z-10 block w-full overflow-hidden"
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        height: imageContainerStyle?.height ?? "auto",
        maxHeight: imageContainerStyle?.maxHeight ?? "none",
      }}
    >
      <div
        className="embla__container flex h-full items-center"
        style={{
          transform: `translateX(-${(currentIndex - 1) * 100}%)`,
          transition: transitionEnabled ? "transform 0.3s ease-in-out" : "none",
        }}
        onMouseLeave={handleRemoveFlip}
        onMouseOver={handleFlip}
      >
        {slides.map((item, idx) => (
          <div
            key={idx}
            className={`embla__slide relative z-20 min-w-0 flex-[0_0_100%] justify-around`}
            style={{
              height: item ? imageContainerStyle?.height || "auto" : 250,
              cursor: isPDP && item.video ? "pointer" : "default",
            }}
            onClick={() => {
              if (isPDP && item.video) {
                setVideo?.(
                  item.video.includes(".com")
                    ? item.video // scene 7 url
                    : item.video.split("&")[0] // youtube id
                );
              }
            }}
          >
            {isPDP ? (
              <>
                <RHImageV2
                  key={`productImage-${idx}`}
                  data-testid={"mobile-pdp-image"}
                  loading="eager"
                  className={clsx(pdpImageProps?.objectFit)}
                  style={{
                    objectFit: "contain",
                    height: "-webkit-fill-available",
                    aspectRatio: pdpImageProps?.IMAGE_ASPECT_RATIO?.heroImage,
                  }}
                  src={
                    pdpImageProps?.isHeroImageUrlFailed
                      ? slides[0]?.imageUrl || "/placeholder.png" // Added fallback
                      : presetImage(item?.imageUrl) || "/placeholder.png" // Added fallback
                  }
                  alt={item?.caption || item?.imageUrl || "Product image"}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  onLoadingComplete={(img) => setActualImgHeight?.(img.naturalHeight)}
                />
                {Boolean(item?.video) && (
                  <PlayIcon
                    className={
                      "pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-10 m-auto cursor-pointer text-[60px] text-white"
                    }
                  />
                )}
              </>
            ) : (
              <RHLink
                href={linkToPage || "#"}
                onClick={handleImageClick}
                aria-label={
                  slides?.length > 1
                    ? `${idx + 1} of ${slides?.length}, ${imageAlternativeName}`
                    : `${imageAlternativeName}`
                }
                tabIndex={0}
                target={openInNewTab ? "_blank" : "_self"}
                className="cursor-pointer"
                id={`rhlink-image-carousel-${idx}-${imageAlternativeName}`}
                data-testid={`rhlink-image-carousel-${idx}-${imageAlternativeName}`}
              >
                <RHImageV2
                  className="mx-auto grid content-end"
                  src={presetImage(item?.imageUrl) || "/placeholder.png"} // Added fallback
                  style={imageStyle}
                  alt={imageAlternativeName}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  onLoadingComplete={(img) => setActualImgHeight?.(img.naturalHeight)}
                />
              </RHLink>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselSlides;