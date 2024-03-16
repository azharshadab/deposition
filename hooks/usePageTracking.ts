import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    window.gtag('config', 'G-SXTHH2DC6G', {
      page_path: location.pathname + location.search,
    });
  }, [location]);
}
