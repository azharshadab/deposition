import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './PrivateRoutes';
import { useAuth } from '@hooks/useAuth';

type AuthState = 'checking' | 'authenticated' | 'unauthenticated';

jest.mock('@hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const LoginPage = () => <div>Login page</div>;
const MockProtectedContent = () => <div data-testid="protected-content">Protected Content</div>;

describe('ProtectedRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the login page if unauthenticated', () => {
    (useAuth as jest.Mock<AuthState>).mockReturnValue('unauthenticated');

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoutes />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('should render the outlet if authenticated', () => {
    (useAuth as jest.Mock<AuthState>).mockReturnValue('authenticated');
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ProtectedRoutes />}>
            <Route index element={<MockProtectedContent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should not render anything if authentication status is checking', () => {
    (useAuth as jest.Mock<AuthState>).mockReturnValue('checking');
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoutes />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.queryByTestId('protected-content')).toBeNull();
  });
});


