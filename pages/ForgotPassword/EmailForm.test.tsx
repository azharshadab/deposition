import { render, fireEvent, cleanup, screen } from '@testing-library/react';
import { EmailForm } from './EmailForm';
import { Wrapper } from 'wrapper';

let setEmail: jest.Mock;
let onSubmit: jest.Mock;
let getByText: Function;
let getByPlaceholderText: Function;

beforeEach(() => {
  setEmail = jest.fn();
  onSubmit = jest.fn();

  const renderResult = render(
    <Wrapper>
      <EmailForm email="" setEmail={setEmail} onSubmit={onSubmit} />
    </Wrapper>,
  );

  getByPlaceholderText = renderResult.getByPlaceholderText;
  getByText = renderResult.getByText;
});

afterEach(() => {
  // Cleanup after each test
  cleanup();
});

test('EmailForm does not submit when email is not defined', () => {
  const emailInput = getByPlaceholderText('Email');
  const submitButton = getByText('Change Password');

  fireEvent.change(emailInput, { target: { value: '' } });

  fireEvent.click(submitButton);

  expect(onSubmit).not.toHaveBeenCalled();
});

test('EmailForm shows an alert when submitting without an email', () => {
  const submitButton = getByText('Change Password');

  fireEvent.click(submitButton);

  expect(screen.getByText('Email is required')).toBeInTheDocument();
});
