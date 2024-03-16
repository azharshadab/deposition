import { render, fireEvent, cleanup, screen } from '@testing-library/react';
import { PasswordForm } from './PasswordForm';
import { Wrapper } from 'wrapper';

let onConfirm: jest.Mock;
let getByText: Function;
let getByPlaceholderText: Function;

beforeEach(() => {
  onConfirm = jest.fn();

  const renderResult = render(
    <Wrapper>
      <PasswordForm onConfirm={onConfirm} />
    </Wrapper>,
  );

  getByPlaceholderText = renderResult.getByPlaceholderText;
  getByText = renderResult.getByText;
});

afterEach(() => {
  cleanup();
});

test('PasswordForm does not submit when code is not defined', () => {
  const passwordInput = getByPlaceholderText('Password');
  const confirmPasswordInput = getByPlaceholderText('Confirm Password');
  const submitButton = getByText('Confirm');

  fireEvent.change(passwordInput, { target: { value: 'password' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });

  fireEvent.click(submitButton);

  expect(onConfirm).not.toHaveBeenCalled();
});

test('PasswordForm does not submit when password is not defined', () => {
  const codeInput = getByPlaceholderText('Code');
  const submitButton = getByText('Confirm');

  fireEvent.change(codeInput, { target: { value: '123456' } });

  fireEvent.click(submitButton);

  expect(onConfirm).not.toHaveBeenCalled();
});

test('PasswordForm does not submit when confirmPassword is not defined', () => {
  const codeInput = getByPlaceholderText('Code');
  const passwordInput = getByPlaceholderText('Password');
  const submitButton = getByText('Confirm');

  fireEvent.change(codeInput, { target: { value: '123456' } });
  fireEvent.change(passwordInput, { target: { value: 'password' } });

  fireEvent.click(submitButton);

  expect(onConfirm).not.toHaveBeenCalled();
});

test('PasswordForm does not submit when passwords do not match', () => {
  const codeInput = getByPlaceholderText('Code');
  const passwordInput = getByPlaceholderText('Password');
  const confirmPasswordInput = getByPlaceholderText('Confirm Password');
  const submitButton = getByText('Confirm');

  fireEvent.change(codeInput, { target: { value: '123456' } });
  fireEvent.change(passwordInput, { target: { value: 'password' } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: 'differentPassword' },
  });

  fireEvent.click(submitButton);

  expect(onConfirm).not.toHaveBeenCalled();
  expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
});

test('PasswordForm does not submit when passwords do not match', () => {
  const codeInput = getByPlaceholderText('Code');
  const passwordInput = getByPlaceholderText('Password');
  const confirmPasswordInput = getByPlaceholderText('Confirm Password');
  const submitButton = getByText('Confirm');

  fireEvent.change(codeInput, { target: { value: '123456' } });
  fireEvent.change(passwordInput, { target: { value: 'password' } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: 'differentPassword' },
  });

  fireEvent.click(submitButton);

  expect(onConfirm).not.toHaveBeenCalled();
  expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
});
