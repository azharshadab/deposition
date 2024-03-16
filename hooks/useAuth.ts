import { authenticationService } from '@services/authentication';
import { useEffect, useState } from 'react';

type AuthState = 'checking' | 'authenticated' | 'unauthenticated';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>('checking');

  useEffect(() => {
    authenticationService.isUserSignedIn().then(authenticated => {
      setAuthState(authenticated ? 'authenticated' : 'unauthenticated');
    });
  }, []);

  return authState;
};
