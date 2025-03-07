import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Sử dụng useMemo để tạo và ghi nhớ hàm debounce
  const debouncedHandler = useMemo(
    () =>
      debounce((newValue) => {
        setDebouncedValue(newValue);
      }, delay),
    [delay] // Chỉ tạo lại hàm debounce khi delay thay đổi
  );

  useEffect(() => {
    debouncedHandler(value);

    // Hủy bỏ hàm debounce khi component unmount hoặc khi value/delay thay đổi
    return () => {
      debouncedHandler.cancel();
    };
  }, [value, debouncedHandler]);

  return debouncedValue;
}

export default useDebounce;
