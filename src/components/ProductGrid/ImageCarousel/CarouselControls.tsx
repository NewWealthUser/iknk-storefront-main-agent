import React, { FC } from "react";
import DotsCarousel from "./DotsCarousel";
import Arrows from "./Arrows";
import { ChevronLeft, ChevronRight } from "@medusajs/icons"; // Using Medusa Icons for arrows

interface CarouselControlsProps {
  slideCount: number;
  currentIndex: number;
  goToPrevSlide: (e: React.MouseEvent | React.TouchEvent | any) => void;
  goToNextSlide: (e: React.MouseEvent | React.TouchEvent | any) => void;
  scrollTo: (index: number, e?: any) => void;
  isPDP: boolean;
  stopClickPropogation: (e: React.MouseEvent | React.TouchEvent | any) => void;
}

const CarouselControls: FC<CarouselControlsProps> = ({
  slideCount,
  currentIndex,
  goToPrevSlide,
  goToNextSlide,
  scrollTo,
  isPDP,
  stopClickPropogation,
}) => {
  const isMobileOrTablet = false; // Simplified for now

  return (
    <>
      <div
        className={`embla__controls align-center flex w-full items-center justify-center ${
          isPDP ? "mb-2 mt-3 md:mb-3" : "my-1.5 sm:my-2 md:my-2.5"
        }`}
      >
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
            <ChevronLeft size={16} />
          </button>
        )}
        <span
          onClick={stopClickPropogation}
          className="flex h-[8px]"
        >
          {slideCount > 1 && (
            <DotsCarousel
              length={slideCount}
              maxVisibleIndicators={5}
              current={currentIndex - 1}
            />
          )}
        </span>
        {!isPDP && !isMobileOrTablet && (
          <button
            className={`embla__next relative m-0 inline-flex p-0 pl-2.5 opacity-0 transition-opacity duration-300 ${
              currentIndex !== slideCount
                ? "group-hover:cursor-pointer group-hover:opacity-100"
                : "group-hover:cursor-default group-hover:opacity-0"
            }`}
            onClick={goToNextSlide}
            aria-label="next"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
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
    </>
  );
};

export default CarouselControls;