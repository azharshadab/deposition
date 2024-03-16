import { useEffect } from 'react';

const useTitle = (content: string): void => {
  useEffect(() => {
    const metaTitle = document.querySelector('title');
    if (metaTitle) metaTitle.textContent = content;
  }, [content]);
};

export default useTitle;
