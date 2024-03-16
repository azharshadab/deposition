import { useEffect, useRef } from 'react';

export const useAbortRef = () => {
  const abortRef = useRef<AbortController>();
  useEffect(() => () => abortRef.current?.abort(), []);
  return abortRef;
};
