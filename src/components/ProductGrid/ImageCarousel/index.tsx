import React, {
  Dispatch,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
// import { Box, Grid } from "@mui/material"; // Removed MUI imports
// import { RHImageContext } from "@RHCommerceDev/rh-image-component/RHImageContext"; // Removed
// import RHLink from "@RHCommerceDev/component-rh-link"; // Removed
// import RHSpinner from "@RHCommerceDev/component-rh-spinner"; // Removed
// import RHImageV2 from "@RHCommerceDev/rh-image-component"; // Removed
import clsx from "clsx";
import { useDebounce } from "@lib/hooks/useDebounce"; // Using local debounce hook
// import { isMobileOrTablet } from "hooks/useDeviceOrientation"; // Removed
// import PlayIcon from "icons/PlayIcon"; // Moved to CarouselSlides
import RHZoomInIcon from "@modules/common/icons/zoom-in"; // Assuming a ZoomInIcon exists or creating one
// import { COUNTER_ONE, COUNTER_TWO } from "utils/constants"; // Removed
// import { ProductImagePresetKeys } from "utils/getImageUrlWithPreset"; // Removed
// import memoize from "utils/memoize"; // Removed
import Arrows from "./Arrows"; // Now used by CarouselControls
// import DotsCarousel from "./DotsCarousel"; // Moved to CarouselControls
import ImageThumbnailWrapper from "./ImageThumbnailWrapper";
// import { useEnv } from "hooks/useEnv"; // Removed
// import TailwindButton from "@RHCommerceDev/component-tailwind-button"; // Removed
import CarouselSlides from "./CarouselSlides";
import CarouselControls from "./CarouselControls";
import { Button } from "@medusajs/ui"; // Using Medusa UI Button

// Placeholder implementations (simplified or removed)
const Box = (props: any) => <div {...props}>{props.children}</div>; // Simplified
const Grid = (props: any) => <div {...props} />; // Simplified
const RHImageContext = React.createContext({}); // Removed
const RHLink = (props: any) => <a href={props.to}>{props.children}</a>; // Removed
const RHSpinner = (props: any) => <div>Loading...</div>; // Removed
const RHImageV2 = (props: any) => <img src={props.src} alt={props.alt} className={props.className} />; // Removed
const isMobileOrTablet = false; // Simplified
const PlayIcon = (props: any) => <div>PlayIcon</div>; // Removed
const COUNTER_ONE = 1; // Re-added if needed for internal logic
const COUNTER_TWO = 2; // Re-added if needed for internal logic
const ProductImagePresetKeys = ""; // Removed
// Removed memoize, using React.memo directly
const useEnv = () => ({}); // Simplified
const TailwindButton = (props: any) => <button {...props}>{props.children}</button>; // Replaced with Medusa Button
const IMAGE_ASPECT_RATIO = { thumbnail: "1/1", heroImage: "1/1" }; // Re-added if needed

interface ProductAlternateImage {
  imageUrl: string;
  video?: string;
  caption?: string;
  id?: number;
}

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
  isPDP?: boolean;
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
  setIsClicked?: Dispatch<React.SetStateAction<boolean>>;
  setActiveIndex?: Dispatch<React.SetStateAction<number | undefined>>;
  setIsZoomViewerDialogOpen?: Dispatch<React.SetStateAction<boolean>>;
  onProductClick?: Function;
  triggerAnalyticsEvent?: Function;
  linkToPage?: string;
  imageAlternativeName?: string;
  fallbackImage?: string;
  setIsColorizable?: Dispatch<React.SetStateAction<boolean>>;
  setIsHeroImageUrlFailed?: Dispatch<React.SetStateAction<boolean>>;
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
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null); // Still needed for touch/hover events
  const ref = useRef<HTMLImageElement>(null); // Not directly used in this component anymore
  const slideCount = slides.length;
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [reverseCount, setReverseCount] = useState(0);
  const [reverseIndex, setReverseIndex] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);
  const [stopFlip, setStopFLip] = useState(false);
  const { debounce } = useDebounce();
  const [isArrowsClicked, setIsArrowsClicked] = useState(false);
  const env = useEnv(); // Still needed if env vars are used for logic

  useEffect(() => {
    if (isClicked) {
      setCurrentIndex(1);
      setIsClicked?.(false);
    }
  }, [isClicked, setIsClicked]);

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

  // Removed pointerover listener as it's now handled by CarouselSlides

  const goToNextSlide = useCallback(
    (e: React.MouseEvent | React.TouchEvent | any) => {
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
    [showCarousel, currentIndex, slides?.length]
  );

  const goToPrevSlide = useCallback(
    (e: React.MouseEvent | React.TouchEvent | any) => {
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
  }, [currentIndex, previousIndex]);

  const handleFlip = useCallback(() => {
    if (
      !isMobileOrTablet &&
      imageFlip &&
      currentIndex === 1 &&
      slides?.length > 1 &&
      !stopFlip
    ) {
      setCurrentIndex(() => {
        setPreviousIndex(COUNTER_ONE);
        return COUNTER_TWO;
      });
    }
  }, [slides?.length, currentIndex, imageFlip, stopFlip]);
  const handleRemoveFlip = useCallback(() => {
    if (
      !isMobileOrTablet &&
      !stopFlip &&
      slides?.length > 1 &&
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
  }, [slides?.length, debounce, imageFlip, isPDP, stopFlip]);

  const stopClickPropogation = (e: React.MouseEvent | React.TouchEvent | any) => {
    e.stopPropagation();
    e.preventDefault();
  };

  if (!slides?.length) {
    return null;
  }

  return (
    <>
      <div
        className="group/item group relative flex flex-col items-end justify-center"
        style={{ touchAction: "pan-y", height: "auto" }}
      >
        <CarouselSlides
          slides={slides}
          currentIndex={currentIndex}
          transitionEnabled={transitionEnabled}
          imageContainerStyle={imageContainerStyle}
          imageStyle={imageStyle}
          presetImage={presetImage}
          imageAlternativeName={imageAlternativeName || "Product image"}
          isPDP={isPDP}
          pdpImageProps={pdpImageProps}
          setVideo={setVideo}
          onProductClick={onProductClick}
          triggerAnalyticsEvent={triggerAnalyticsEvent}
          linkToPage={linkToPage}
          openInNewTab={openInNewTab}
          setActualImgHeight={setActualImgHeight}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
          handleFlip={handleFlip}
          handleRemoveFlip={handleRemoveFlip}
        />

        <CarouselControls
          slideCount={slideCount}
          currentIndex={currentIndex}
          goToPrevSlide={goToPrevSlide}
          goToNextSlide={goToNextSlide}
          scrollTo={scrollTo}
          isPDP={isPDP}
          stopClickPropogation={stopClickPropogation}
        />

        {isPDP ? (
          <Button
            className="!absolute bottom-7 z-20 !bg-transparent p-0 sm:right-4 md:bottom-8"
            id="zoom-icon-v3"
            onClick={() => {
              setIsZoomViewerDialogOpen?.(true);
            }}
          >
            <RHZoomInIcon className="!h-8 !w-8" />
          </Button>
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
                    images={slides?.map((item, id: number) => ({ ...item, id }))}
                    index={currentIndex === 1 ? -1 : currentIndex - 1}
                    onChangeIndex={i => scrollTo((i ?? 0) + 1)}
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
export default ImageCarousel;