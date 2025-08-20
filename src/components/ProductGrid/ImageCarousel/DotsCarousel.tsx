import React from "react";
import { DotCarouselProps, bounds } from "./helper";

const DotCarousel: React.FC<DotCarouselProps> = ({
  length,
  current,
  maxVisibleIndicators = 4
}) => {
  const dotSize = 5;
  const gap = 4;
  const indicators = Array.from({ length }, (_, index) => index);
  const min = bounds(
    0,
    current - Math.floor(maxVisibleIndicators / 2),
    length - maxVisibleIndicators
  );
  const max = min + maxVisibleIndicators - 1;

  return (
    <div
      className={`flex items-center justify-${
        length > maxVisibleIndicators ? "between" : "center"
      } overflow-hidden`}
      style={{
        maxWidth: dotSize
          ? `${
              (length > maxVisibleIndicators ? maxVisibleIndicators : length) *
              (dotSize + gap)
            }px`
          : "auto"
      }}
      data-testid="dots-container"
    >
      <div
        className="flex transition-transform duration-300"
        style={{
          transform: `translateX(${
            length > maxVisibleIndicators ? -min * (dotSize + gap) : "0"
          }px)`,
          gap: `${gap}px` // Apply gap here instead
        }}
        data-testid="dots-wrapper"
      >
        {indicators.map(index => {
          const isCurrentIndicator = index === current;
          const isEdgeIndicator =
            (index === min && index > 0) ||
            (index === max && index < length - 1);

          return (
            <div
              key={index}
              role="button"
              aria-label={`Dot ${index + 1}`}
              aria-current={isCurrentIndicator ? "true" : "false"}
              className={`rounded-full transition-all duration-300`}
              style={{
                width: dotSize,
                height: dotSize,
                backgroundColor: isCurrentIndicator ? "black" : "#898886",
                scale: isEdgeIndicator ? "70%" : "unset"
              }}
              data-testid={`dot-${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
export default DotCarousel;
