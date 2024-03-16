import { useEffect, useState, useCallback } from 'react';
import { useAbortRef } from './useAbortRef';
interface UseHttpOptions {
  initialData?: any;
  dependencies?: any[];
  callImmediately?: boolean;
}

export const useHttp = <T>(
  promiseFunc: (...args: any[]) => Promise<T>,
  { initialData, callImmediately = true }: UseHttpOptions,
): [T, boolean, () => void, string, () => void] => {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const abortControllerRef = useAbortRef();

  const stablePromiseFunc = useCallback(promiseFunc, []);

  const refresh = useCallback(
    (...args: any[]) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError('');
      return stablePromiseFunc(...args)
        .then((res: T) => {
          if (controller.signal.aborted) return;
          setData(res);
        })
        .catch(e => {
          if (controller.signal.aborted) return;
          console.error(e);
          setError(JSON.stringify(e));
        })
        .finally(() => {
          if (controller.signal.aborted) return;
          setIsLoading(false);
        });
    },
    [stablePromiseFunc],
  );

  useEffect(() => {
    if (callImmediately) {
      refresh();
    }
  }, [refresh, callImmediately]);

  const reset = () => {
    setError('');
    setIsLoading(false);
  };

  return [data, isLoading, refresh, error, reset];
};
