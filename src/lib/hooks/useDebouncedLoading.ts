import { useEffect, useState } from "react";

export const useDebouncedLoading = (initial: boolean, delay = 300) => {
  const [debouncedLoading, setDebouncedLoading] = useState(initial);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLoading(initial);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [initial]);

  return debouncedLoading;
};