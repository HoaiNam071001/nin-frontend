import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

// Custom hook for debounce
function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedValue(value);
    }, delay);

    handler();

    // Clean up the debounce on unmount or when value changes
    return () => {
      handler.cancel();
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
