import { useEffect } from 'react';
import { authenticationService } from '@services/authentication';
import config from '@config';

const useSessionTimeout = () => {
  const localStorageKey = 'lastActivityTime';
  const logoutKey = 'logoutEvent';
  const tabClosedKey = 'tabClosed';
  const timeout = config.TranscriptAnalysis.FeatureFlags.SessionTimeoutMinutes * 60 * 1000;
  const alertBeforeLogout = config.TranscriptAnalysis.FeatureFlags.AlertBeforeLogoutMinutes * 60 * 1000;

  const updateLastActivityTime = () => {
    localStorage.setItem(localStorageKey, Date.now().toString());
  };

  const checkSessionTimeout = async () => {
    const lastActivityTime = parseInt(localStorage.getItem(localStorageKey) || '0');
    const currentTime = Date.now();

    if (currentTime - lastActivityTime > timeout) {
      if (await authenticationService.isUserSignedIn()) {
        authenticationService.signOut();
        localStorage.setItem(logoutKey, Date.now().toString());
      }
    } else if (currentTime - lastActivityTime > timeout - alertBeforeLogout) {
      if (await authenticationService.isUserSignedIn()) {
        alert('You will be logged out soon due to inactivity.');
      }
    }
  };

  useEffect(() => {
    const tabClosed = localStorage.getItem(tabClosedKey);
    if (tabClosed) {
      checkSessionTimeout();
    }

    window.addEventListener('beforeunload', () => {
      localStorage.setItem(tabClosedKey, 'true');
    });

    window.addEventListener('mousemove', updateLastActivityTime);
    window.addEventListener('keydown', updateLastActivityTime);
    window.addEventListener('scroll', updateLastActivityTime);
    window.addEventListener('click', updateLastActivityTime);

    const intervalId = setInterval(checkSessionTimeout, 1000);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === logoutKey && event.newValue) {
        window.location.href = '/login';
      }
    };

    window.addEventListener('storage', handleStorageChange);

    updateLastActivityTime();

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', () => {
        localStorage.removeItem(tabClosedKey);
        });
        window.removeEventListener('mousemove', updateLastActivityTime);
        window.removeEventListener('keydown', updateLastActivityTime);
        window.removeEventListener('scroll', updateLastActivityTime);
        window.removeEventListener('click', updateLastActivityTime);
        window.removeEventListener('storage', handleStorageChange);
        };
        }, []);       
        };

        export default useSessionTimeout;