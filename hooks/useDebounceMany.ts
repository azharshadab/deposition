import { useEffect, useRef } from 'react';

function useDebounceMany(
  values: any[],
  delay: number,
  callback: (value: any) => void,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevValuesRef = useRef(values);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const changedValue = values.find(
        (currentValue, index) => currentValue !== prevValuesRef.current[index],
      );

      prevValuesRef.current = values;
      callback(changedValue);
    }, delay);

    // cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [...values, delay]);
}

export default useDebounceMany;
