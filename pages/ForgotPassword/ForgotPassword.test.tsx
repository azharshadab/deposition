import {
  render,
  fireEvent,
  waitFor,
  act,
  RenderResult,
  screen,
} from '@testing-library/react';
import ForgotPassword from './ForgotPassword';
import { authenticationService } from '@services/authentication';
import { Wrapper } from 'wrapper';
import { useNavigate } from 'react-router-dom';

jest.mock('@services/authentication');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockedForgotPassword =
  authenticationService.forgotPassword as jest.MockedFunction<
    typeof authenticationService.forgotPassword
  >;
const mockedConfirmPassword =
  authenticationService.confirmPassword as jest.MockedFunction<
    typeof authenticationService.confirmPassword
  >;
const mockedNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;
window.alert = jest.fn();

describe('ForgotPassword', () => {
  let utils: RenderResult;

  beforeEach(() => {
    mockedForgotPassword.mockClear();
    mockedConfirmPassword.mockClear();
    mockedNavigate.mockClear();

    utils = render(
      <Wrapper>
        <ForgotPassword />
      </Wrapper>,
    );
  });

  const fillFormAndSubmit = async (email: string) => {
    await act(async () => {
      const emailInput = await utils.findByTestId('email-input');
      const submitButton = await utils.findByTestId('change-password-button');

      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.click(submitButton);
    });
  };

  const fillPasswordFormAndSubmit = async (code: string, password: string) => {
    await act(async () => {
      fireEvent.change(await utils.findByTestId('code-input'), {
        target: { value: code },
      });
      fireEvent.change(await utils.findByTestId('password-input'), {
        target: { value: password },
      });
      fireEvent.change(await utils.findByTestId('confirm-password-input'), {
        target: { value: password },
      });
      fireEvent.click(await utils.findByTestId('confirm-button'));
    });
  };

  describe('EmailForm', () => {
    it('calls forgotPassword when EmailForm is submitted', async () => {
      await fillFormAndSubmit('test@example.com');
      await waitFor(() =>
        expect(mockedForgotPassword).toHaveBeenCalledTimes(1),
      );
    });
  });

  describe('PasswordForm', () => {
    it('calls confirmPassword when PasswordForm is submitted and redirects to the login page', async () => {
      mockedForgotPassword.mockResolvedValue('Success');
      const mockedNavigate = jest.fn();
      (useNavigate as jest.Mock).mockReturnValue(mockedNavigate);
      await fillFormAndSubmit('test@example.com');
      const closeDialogBtn = await screen.findByTestId('close-dialog');
      fireEvent.click(closeDialogBtn);

      const passwordForm = await utils.findByTestId('password-form');
      expect(passwordForm).toBeInTheDocument();

      await fillPasswordFormAndSubmit('123456', 'password');

      await waitFor(() =>
        expect(mockedConfirmPassword).toHaveBeenCalledTimes(1),
      );
      await waitFor(() =>
        expect(mockedNavigate).toHaveBeenCalledWith('/login'),
      );
    });
  });
});
