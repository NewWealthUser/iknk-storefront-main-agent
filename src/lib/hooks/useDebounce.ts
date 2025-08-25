import { useEffect } from "react";

/**
 * Use Debounce
 * @returns object.debounce method to trigger debounce action (time: number) => void
 * @returns object.cancel method to cancel a pending debounce () => void
 *
 */
export const useDebounce = () => {
  //@ts-ignore
  let timeout: NodeJS.Timeout = null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cancel = (): void => {
    // Clear previous timeout
    clearTimeout(timeout);
  };
  const debounce = (time: number, cb: () => void) => {
    cancel();
    timeout = setTimeout(cb, time);
  };
  useEffect(() => {
    // Unmount
    return cancel;
  }, [cancel, timeout]);

  return { debounce, cancel };
};