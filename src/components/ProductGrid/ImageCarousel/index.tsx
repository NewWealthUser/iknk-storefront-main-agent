import React, {
  Dispatch,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Box, Grid } from "@mui/material";
import { RHImageContext } from "@RHCommerceDev/rh-image-component/RHImageContext";
import RHLink from "@RHCommerceDev/component-rh-link";
import RHSpinner from "@RHCommerceDev/component-rh-spinner";
import RHImageV2 from "@RHCommerceDev/rh-image-component";
import clsx from "clsx";
import { useDebounce } from "hooks/useDebounce";
import { isMobileOrTablet } from "hooks/useDeviceOrientation";
import PlayIcon from "icons/PlayIcon";
import RHZoomInIcon from "icons/RHZoomInIcon";
import { COUNTER_ONE, COUNTER_TWO } from "utils/constants";
import { ProductImagePresetKeys } from "utils/getImageUrlWithPreset";
import memoize from "utils/memoize";
import Arrows from "./Arrows";
import DotsCarousel from "./DotsCarousel";
import ImageThumbnailWrapper from "./ImageThumbnailWrapper";
import { useEnv } from "hooks/useEnv";
import TailwindButton from "@RHCommerceDev/component-tailwind-button";

const styles = {
  emblaContainer: {},
  skeletonLoader: {
    backgroundColor: "#e0e0e0",
    animation: "pulse 1.5s infinite ease-in-out"
  },
  "@keyframes pulse": {
    "0%, 100%": {
      opacity: 1
    },
    "50%": {
      opacity: 0.5
    }
  }
};

interface ImageCarouselProps {
  isPDP?: Boolean;
  slides: ProductAlternateImage[];
  imageContainerStyle?: React.CSSProperties;
  imageStyle?: any;
  presetImage?: any;
  imageFlip?: boolean;
  isClicked?: boolean;
  imageCaptionComponent?: any;
  selectedSwatchUrl?: {
    isColorizable?: boolean;
    selectedSwatchImageUrl?: string;
  };
  pdpImageProps?: any;
  setVideo?: React.Dispatch<React.SetStateAction<string>>;
  setIsClicked?: Dispatch<React.SetStateAction<Boolean>>;
  setActiveIndex?: Dispatch<React.SetStateAction<number | undefined>>;
  setIsZoomViewerDialogOpen?: Dispatch<React.SetStateAction<Boolean>>;
  onProductClick?: Function;
  triggerAnalyticsEvent?: Function;
  linkToPage?: string;
  imageAlternativeName?: string;
  fallbackImage?: string;
  setIsColorizable?: Dispatch<React.SetStateAction<Boolean>>;
  setIsHeroImageUrlFailed?: Dispatch<React.SetStateAction<Boolean>>;
  colorizable?: boolean;
  id?: string;
  openInNewTab?: boolean;
  setActualImgHeight?: Dispatch<React.SetStateAction<number>>;
}
const ImageCarousel: FC<ImageCarouselProps> = ({
  isPDP = false,
  slides = [],
  imageContainerStyle = {} as React.CSSProperties,
  imageStyle,
  presetImage,
  imageFlip = false,
  isClicked,
  selectedSwatchUrl,
  pdpImageProps,
  imageCaptionComponent,
  setVideo,
  setIsClicked,
  setActiveIndex,
  setIsZoomViewerDialogOpen,
  imageAlternativeName,
  onProductClick,
  triggerAnalyticsEvent,
  linkToPage,
  fallbackImage,
  setIsColorizable,
  setIsHeroImageUrlFailed,
  colorizable,
  id,
  openInNewTab,
  setActualImgHeight
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  // const [isAutoplay, setIsAutoplay] = useState(false);  // AutoPlay Play Feature not required for time being
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLImageElement>(null);
  const slideCount = slides.length;
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [previousIndex, setPreviousIndex] = useState(0); // Track the previous index
  const [reverseCount, setReverseCount] = useState(0);
  const [reverseIndex, setReverseIndex] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);
  const [stopFlip, setStopFLip] = useState(false);
  const { debounce } = useDebounce();
  const [isArrowsClicked, setIsArrowsClicked] = useState(false);
  const env = useEnv();

  useEffect(() => {
    // is used for colorization
    if (isClicked) {
      setCurrentIndex(1);
      setIsClicked?.(false);
    }
  }, [isClicked]);

  useEffect(() => {
    if (currentIndex && setActiveIndex) {
      setActiveIndex?.(currentIndex - 1);
    }
  }, [currentIndex, setActiveIndex]);

  useEffect(() => {
    if (
      selectedSwatchUrl?.selectedSwatchImageUrl !== undefined &&
      selectedSwatchUrl?.selectedSwatchImageUrl !== " "
    ) {
      setCurrentIndex(1);
    }
  }, [selectedSwatchUrl?.selectedSwatchImageUrl]);

  useEffect(() => {
    // added below code as there was layout shift in safari small devices SR-3266
    if (isMobileOrTablet) {
      return;
    }
    const element = ref?.current;

    const handleOnPointerOver = async () => {
      if (slides?.length) {
        setShowCarousel(true);
      }
    };
    element?.addEventListener("pointerover", handleOnPointerOver);

    return () => {
      element?.removeEventListener("pointerover", handleOnPointerOver);
    };
  }, [currentIndex, ref, slides?.length]);

  const goToNextSlide = useCallback(
    e => {
      if (currentIndex !== slides?.length) {
        e?.preventDefault();
        setIsArrowsClicked(true);
        !showCarousel && setShowCarousel(true);
        setCurrentIndex(prevIndex => {
          setPreviousIndex(prevIndex);
          return prevIndex + 1;
        });
      }
    },
    [showCarousel, currentIndex]
  );

  const goToPrevSlide = useCallback(
    e => {
      if (currentIndex !== 1) {
        e?.preventDefault();
        setIsArrowsClicked(true);
        !showCarousel && setShowCarousel(true);
        setCurrentIndex(prevIndex => {
          setPreviousIndex(prevIndex);
          return prevIndex - 1;
        });
      }
    },
    [currentIndex, showCarousel]
  );

  // AutoPlay Play Feature not required for time being

  // const startAutoplay = useCallback(() => {
  //   setIsAutoplay(true);
  // }, []);

  // const stopAutoplay = useCallback(() => {
  //   setIsAutoplay(false);
  // }, []);

  // useEffect(() => {
  //   if (!isAutoplay) return;
  //   const intervalId = setInterval(e => {
  //     goToNextSlide(e);
  //   }, 1000); // Adjust time interval as needed
  //   return () => clearInterval(intervalId);
  // }, [isAutoplay, goToNextSlide]);

  // useEffect(() => {
  //   if (isAutoplay && !isMobileOrTablet) {
  //     if (carouselRef.current) {
  //       carouselRef.current.addEventListener("mouseenter", startAutoplay);
  //       carouselRef.current.addEventListener("mouseleave", stopAutoplay);
  //     }
  //     return () => {
  //       if (carouselRef.current && !isMobileOrTablet) {
  //         carouselRef.current.removeEventListener("mouseenter", startAutoplay);
  //         carouselRef.current.removeEventListener("mouseleave", stopAutoplay);
  //       }
  //     };
  //   }
  // }, [ isAutoplay, stopAutoplay]);

  const scrollTo = useCallback((index: number, e?: any) => {
    if (e) {
      e.preventDefault();
    }
    setCurrentIndex(prev => {
      setPreviousIndex(prev);
      return index;
    });
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setShowCarousel(true);
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      goToNextSlide({ preventDefault: () => {} });
    } else if (diff < -50) {
      goToPrevSlide({ preventDefault: () => {} });
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };
  useEffect(() => {
    if (currentIndex === slideCount + 1) {
      setTransitionEnabled(false);
      setCurrentIndex(prev => {
        setPreviousIndex(prev);
        return 1;
      });
    } else if (currentIndex === 0) {
      setTransitionEnabled(false);
      setCurrentIndex(prev => {
        setPreviousIndex(prev);
        return slideCount;
      });
    } else {
      setTransitionEnabled(true);
    }
  }, [currentIndex, slideCount]);

  useEffect(() => {
    if (previousIndex > currentIndex - 1) {
      setReverseCount(reverseCount + 1);
    } else {
      setReverseCount(0);
      setReverseIndex(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (reverseCount == 1) {
      setReverseIndex(previousIndex);
    }
  }, [reverseCount]);

  useEffect(() => {
    if (reverseCount == 1) {
      setReverseIndex(previousIndex);
    }
  }, [reverseCount]);

  const getVisibleDots = () => {
    const totalDots = slides.length;
    if (totalDots <= 5) {
      return slides.map((_, index) => index);
    }
    return Array.from({ length: slides.length }, (_, i) => i);
  };

  const alternateImagesList = useMemo(() => {
    let newImageLists = isPDP
      ? [...slides]
      : [
          ...(slides?.length && showCarousel
            ? slides
            : imageFlip
            ? slides?.slice(0, 2)
            : [slides?.[0]])
        ];

    if (
      newImageLists?.length &&
      selectedSwatchUrl?.isColorizable &&
      selectedSwatchUrl?.selectedSwatchImageUrl
    ) {
      newImageLists.splice(0, 1, {
        imageUrl: selectedSwatchUrl?.selectedSwatchImageUrl
      });
    }
    return newImageLists;
  }, [
    imageFlip,
    isPDP,
    selectedSwatchUrl?.isColorizable,
    selectedSwatchUrl?.selectedSwatchImageUrl,
    showCarousel,
    slides
  ]);

  const handleFlip = useCallback(() => {
    if (
      !isMobileOrTablet &&
      imageFlip &&
      currentIndex === 1 &&
      alternateImagesList?.length > 1 &&
      !stopFlip
    ) {
      setCurrentIndex(() => {
        setPreviousIndex(COUNTER_ONE);
        return COUNTER_TWO;
      });
    }
  }, [alternateImagesList?.length, currentIndex, imageFlip, stopFlip]);
  const handleRemoveFlip = useCallback(() => {
    if (
      !isMobileOrTablet &&
      !stopFlip &&
      alternateImagesList?.length > 1 &&
      !isPDP &&
      imageFlip &&
      !stopFlip
    ) {
      debounce(500, () => {
        setStopFLip(true);
        setCurrentIndex(() => {
          setPreviousIndex(0);
          return 1;
        });
      });
    }
  }, [alternateImagesList?.length, debounce, imageFlip, isPDP, stopFlip]);

  const stopClickPropogation = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleImageClick = useCallback(() => {
    triggerAnalyticsEvent?.();
    onProductClick?.();
  }, []);

  if (!slides?.length) {
    return null;
  }

  return (
    <>
      <div
        className="group/item group relative flex flex-col items-end justify-center"
        style={{ touchAction: "pan-y", height: "auto" }}
        ref={ref}
      >
        <div
          className={`embla group/item group relative z-10 block w-full overflow-hidden  max-h-[${imageContainerStyle?.height}px]`}
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            height: imageContainerStyle?.height ?? "auto"
          }}
        >
          <div
            className="embla__container flex h-full items-center"
            style={{
              ...styles.emblaContainer,
              transform: `translateX(-${(currentIndex - 1) * 100}%)`,
              transition: transitionEnabled
                ? "transform 0.3s ease-in-out"
                : "none"
            }}
            onMouseLeave={handleRemoveFlip}
            onMouseOver={handleFlip}
          >
            {alternateImagesList?.map((item, idx) => (
              <div
                key={idx}
                className={`embla__slide relative z-20 min-w-0 flex-[0_0_100%] justify-around`}
                style={{
                  height: item ? imageContainerStyle?.height || "auto" : 250,
                  cursor: isPDP && item.video ? "pointer" : "default"
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
                        aspectRatio:
                          pdpImageProps?.IMAGE_ASPECT_RATIO["heroImage"]
                      }}
                      src={
                        pdpImageProps?.isHeroImageUrlFailed
                          ? (slides || [])[0]?.imageUrl
                          : presetImage
                          ? presetImage(item?.imageUrl)
                          : item?.imageUrl
                      }
                      containerProps={{
                        className: "flex justify-center"
                      }}
                      alt={item?.caption || item?.imageUrl}
                      preset={
                        `${
                          pdpImageProps?.imagePresetOverride?.length
                            ? pdpImageProps?.imagePresetOverride
                            : "pdp-hero"
                        }-${
                          pdpImageProps?.mediaString
                        }` as ProductImagePresetKeys
                      }
                      onClick={() => {
                        if (item.video) {
                          setVideo?.(
                            item.video.includes(".com")
                              ? item.video // scene 7 url
                              : item.video.split("&")[0] // youtube id
                          );
                        }
                      }}
                      skeletonComponent={() => null}
                    />

                    {item.video !== "" && Boolean(item?.video) && (
                      <PlayIcon
                        className={
                          "pointer-events-none absolute bottom-0 left-0 right-0  top-0 z-10 m-auto cursor-pointer text-[60px] text-white  "
                        }
                      />
                    )}
                  </>
                ) : (
                  <RHLink
                    to={linkToPage}
                    onClick={handleImageClick}
                    aria-label={
                      alternateImagesList?.length > 1
                        ? `${idx + 1} of ${
                            alternateImagesList?.length
                          }, ${imageAlternativeName}`
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
                      src={
                        presetImage
                          ? presetImage(item?.imageUrl)
                          : item?.imageUrl
                      }
                      style={imageStyle}
                      alt={imageAlternativeName}
                      containerProps={{
                        className: "grid content-end",
                        style: {
                          height: imageContainerStyle.height ?? 250
                        }
                      }}
                      refreshImageOnSourceChange={idx === 0}
                      skeletonComponent={RHSpinner}
                      setActualImgHeight={setActualImgHeight}
                    />
                  </RHLink>
                )}
              </div>
            ))}
          </div>

          {/* Action handlers */}
        </div>
        <div
          className={`embla__controls align-center flex w-full items-center justify-center ${
            isPDP ? "mb-2 mt-3 md:mb-3" : "my-1.5 sm:my-2 md:my-2.5"
          } `}
        >
          {/* Dots */}

          {!isPDP && !isMobileOrTablet && (
            <button
              className={`embla__prev relative m-0 inline-flex p-0 pr-2.5 opacity-0 transition-opacity duration-300 ${
                currentIndex !== 1
                  ? "group-hover:cursor-pointer group-hover:opacity-100"
                  : "group-hover:cursor-default group-hover:opacity-0"
              }`}
              onClick={goToPrevSlide}
              aria-label="previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="rotate-180"
              >
                <path d="M6 4L10 8L6 12" stroke="black" />
              </svg>
            </button>
          )}
          {/* dots */}
          <span
            id={`dots-image-carousel-${id}`}
            onClick={stopClickPropogation}
            className="flex h-[8px]"
          >
            {slides.length > 1 && (
              <DotsCarousel
                length={slides?.length}
                maxVisibleIndicators={5}
                current={currentIndex - 1}
              />
            )}
          </span>

          {!isPDP && !isMobileOrTablet && (
            <button
              className={`embla__next relative m-0 inline-flex p-0 pl-2.5 opacity-0 transition-opacity duration-300 ${
                currentIndex !== slides?.length
                  ? "group-hover:cursor-pointer group-hover:opacity-100"
                  : "group-hover:cursor-default group-hover:opacity-0"
              }`}
              onClick={goToNextSlide}
              aria-label="next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path d="M6 4L10 8L6 12" stroke="black" />
              </svg>
            </button>
          )}
        </div>
        {/* Arrows */}
        {isPDP && (
          <div className="absolute z-0 hidden h-full w-full self-center md:block">
            <Arrows
              scrollPrev={goToPrevSlide}
              scrollNext={goToNextSlide}
              index={currentIndex}
              slides={slideCount}
            />
          </div>
        )}
        {isPDP ? (
          <TailwindButton
            className="!absolute bottom-7 z-20 !bg-transparent p-0 sm:right-4 md:bottom-8"
            id="zoom-icon-v3"
            onClick={() => {
              setIsZoomViewerDialogOpen?.(true);
            }}
          >
            <RHZoomInIcon className="!h-8 !w-8" />
          </TailwindButton>
        ) : null}
      </div>

      {isPDP ? (
        <>
          {imageCaptionComponent}
          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "contents" }
            }}
          >
            <Grid item xs={12}>
              {slides?.length > 1 && (
                <RHImageContext.Provider value={{ loading: "eager" }}>
                  <ImageThumbnailWrapper
                    images={slides?.map((item, id) => ({ ...item, id }))}
                    index={currentIndex === 1 ? -1 : currentIndex - 1}
                    onChangeIndex={i => scrollTo(i + 1)}
                    imageCarousels={true}
                    infiniteScroll={false}
                    isPdp={true}
                    extraOperations={{
                      isArrowsClicked,
                      setIsArrowsClicked
                    }}
                  />
                </RHImageContext.Provider>
              )}
            </Grid>
          </Box>
        </>
      ) : null}
    </>
  );
};
export default memoize(ImageCarousel);
