import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginForm from './LoginPage';
import { authenticationService } from '@services/authentication';
import { useNavigate } from 'react-router-dom';
import { Wrapper } from 'wrapper';

jest.mock('@services/authentication');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('LoginForm', () => {
  const submitForm = () => {
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByText(/log in/i));
  };
  it('redirects to home page when sign in user returns true', async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    (authenticationService.signInUser as jest.Mock).mockResolvedValue(true);

    render(
      <Wrapper>
        <LoginForm />
      </Wrapper>,
    );

    submitForm();

    await waitFor(() =>
      expect(authenticationService.signInUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      ),
    );
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/'));
  });

  it('shows an alert when sign in user returns false', async () => {
    (authenticationService.signInUser as jest.Mock).mockResolvedValue(false);

    render(
      <Wrapper>
        <LoginForm />
      </Wrapper>,
    );

    submitForm();

    await waitFor(() =>
      expect(authenticationService.signInUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      ),
    );
    await waitFor(() =>
      expect(
        screen.getByText(
          'Invalid login attempt. Please check the username and password and try again.',
        ),
      ).toBeInTheDocument(),
    );
  });
});
