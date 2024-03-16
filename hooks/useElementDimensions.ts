import { useState, useRef, useLayoutEffect } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

export function useElementDimensions(): [
  Dimensions | undefined,
  React.RefObject<HTMLDivElement>,
] {
  const [size, setSize] = useState<Dimensions>();
  const ref = useRef<HTMLDivElement>(null);
  const prevSize = useRef<Dimensions>();

  const observer = useRef<ResizeObserver>();

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    observer.current?.disconnect();

    observer.current = new ResizeObserver(entries => {
      for (const entry of entries) {
        const newSize = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };
        if (newSize.width === 0) {
          return;
        }
        if (newSize.height === 0) {
          return;
        }
        if (
          !prevSize.current ||
          prevSize.current.width !== newSize.width ||
          prevSize.current.height !== newSize.height
        ) {
          prevSize.current = newSize;
          setSize(newSize);
        }
      }
    });

    observer.current.observe(ref.current);

    return () => observer.current?.disconnect();
  }, [ref.current]);

  return [size, ref];
}
