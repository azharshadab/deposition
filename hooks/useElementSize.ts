import { Size } from '@interfaces/size';
import { useState, useEffect, useRef, RefObject } from 'react';

function useElementSize(
  ref: RefObject<HTMLElement | undefined>,
  ...deps: any[]
): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const prevSize = useRef<Size>(size);

  useEffect(() => {
    function updateSize() {
      if (ref.current) {
        const newSize: Size = {
          width: ref.current.offsetWidth || 0,
          height: ref.current.offsetHeight || 0,
        };

        if (
          newSize.width !== prevSize.current.width ||
          newSize.height !== prevSize.current.height
        ) {
          setSize(newSize);
          prevSize.current = newSize;
        }
      }
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, [ref.current, ...deps]);

  return size;
}

export default useElementSize;
