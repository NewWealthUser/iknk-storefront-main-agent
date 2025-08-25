import { useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";

interface UseInfiniteScrollProps {
  callback: () => void;
  loading: boolean;
  hasMore: boolean;
  rootMargin?: string;
  threshold?: number;
}

export const useInfiniteScroll = ({
  callback,
  loading,
  hasMore,
  rootMargin,
  threshold = 0
}: UseInfiniteScrollProps) => {
  const isWindowDefined = typeof window !== "undefined";
  const defaultRootMargin = `${isWindowDefined ? window?.innerHeight : 0}px`;

  const { ref, inView } = useInView({
    rootMargin: rootMargin || defaultRootMargin,
    threshold,
    initialInView: false
  });

  const handleIntersection = useCallback(() => {
    if (inView && !loading && hasMore) {
      callback();
    }
  }, [inView, callback, loading, hasMore]);

  useEffect(() => {
    handleIntersection();
  }, [handleIntersection]);

  return { ref };
};