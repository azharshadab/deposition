import { useEffect, MutableRefObject } from 'react';

type Callback = (event: MouseEvent) => void;

const useClickOutside = (
  ref: MutableRefObject<HTMLElement | null>,
  callback: Callback,
) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback(event);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
};

export default useClickOutside;
