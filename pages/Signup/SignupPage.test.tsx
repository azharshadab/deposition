import { render, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from './SignupPage';
import { authenticationService } from '@services/authentication';
import { BrowserRouter } from 'react-router-dom';

jest.mock('@services/authentication', () => ({
  authenticationService: {
    signUp: jest.fn(),
  },
}));

const mockMessage = jest.fn();
jest.mock('@common/Dialog', () => ({
  useDialogContext: () => ({ sendMessage: mockMessage, closeDialog: () => {} }),
}));

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('SignupPage', () => {
  const setup = () =>
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>,
    );

  it('navigates to login after successful signup', async () => {
    const mockSignUp = authenticationService.signUp as jest.Mock;
    mockSignUp.mockResolvedValueOnce({});
    const { getByPlaceholderText, getByTestId } = setup();

    fireEvent.change(getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(getByPlaceholderText('Username'), {
      target: { value: 'johndoe' },
    });
    fireEvent.change(getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(getByTestId('terms-and-conditions'));
    fireEvent.click(getByTestId('signup-submit-btn'));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('renders all input fields', () => {
    const { getByPlaceholderText, getByRole } = setup();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(
      getByRole('checkbox', {
        name: 'I agree to the Deposition Insights Terms & Conditions',
      }),
    ).toBeInTheDocument();
  });

  it('does not submit the form if terms are not accepted', () => {
    const { getByText } = setup();
    const submitButton = getByText('Signup');
    fireEvent.click(submitButton);
    expect(mockMessage).toHaveBeenCalledWith(
      expect.stringContaining('You must accept the terms and conditions'),
    );
  });

  it('submits the form with correct data', async () => {
    const mockSignUp = authenticationService.signUp as jest.Mock;
    mockSignUp.mockResolvedValueOnce({});

    const { getByPlaceholderText, getByTestId, getByLabelText } = setup();

    fireEvent.change(getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(getByPlaceholderText('Username'), {
      target: { value: 'johndoe' },
    });
    fireEvent.change(getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(
      getByLabelText(/I agree to the Deposition Insights Terms & Conditions/i),
    );
    fireEvent.click(getByTestId('signup-submit-btn'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        password: 'password123',
        acceptedTermsAndConditions: true,
      });
    });
  });
});
