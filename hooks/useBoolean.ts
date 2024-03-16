import { useState, useCallback } from 'react';

export const useBoolean = (initialValue: boolean): [boolean, () => void] => {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggleValue = useCallback(() => {
    setValue(prevValue => !prevValue);
  }, []);

  return [value, toggleValue];
};
