export interface DotCarouselProps {
  length: number;
  current: number;
  maxVisibleIndicators?: number;
}

export const bounds = (
  lower: number,
  current: number,
  upper: number
): number => {
  if (current <= lower) {
    return lower;
  } else if (current >= upper) {
    return upper;
  }

  return current;
};
