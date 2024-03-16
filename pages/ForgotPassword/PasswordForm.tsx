import { StyledPrimaryButton } from '@styles/buttons';
import { StyledForm } from '@styles/form';
import { SecondaryStyledTextInput } from '@styles/inputs';
import { useForm } from '@hooks/useForm';
import { FormEvent } from 'react';
import Image from '@common/Image';
import { useDialogContext } from '@common/Dialog';

type FormState = {
  code: string;
  password: string;
  confirmPassword: string;
};

type PasswordFormProps = {
  onConfirm: (code: string, password: string) => void;
};

export const PasswordForm = ({ onConfirm }: PasswordFormProps) => {
  const initialState = { code: '', password: '', confirmPassword: '' };
  const { formState, handleChange } = useForm<FormState>(initialState);
  const { sendMessage } = useDialogContext();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.password) {
      sendMessage(`Password is required`);
      return;
    }
    if (!formState.confirmPassword) {
      sendMessage(`Confirm Password is required`);
      return;
    }
    if (!formState.code) {
      sendMessage(`Code is required`);
      return;
    }
    if (formState.password !== formState.confirmPassword) {
      sendMessage(`Passwords don't match`);
      return;
    }
    onConfirm(formState.code, formState.password);
  };

  return (
    <StyledForm onSubmit={handleSubmit} data-testid="password-form">
      <SecondaryStyledTextInput htmlFor="code">
        <input
          value={formState.code}
          onChange={handleChange}
          id="code"
          name="code"
          type="text"
          placeholder="Code"
          required
          data-testid="code-input"
        />
      </SecondaryStyledTextInput>
      <SecondaryStyledTextInput htmlFor="password">
        <input
          value={formState.password}
          onChange={handleChange}
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required
          data-testid="password-input"
        />
      </SecondaryStyledTextInput>
      <SecondaryStyledTextInput htmlFor="confirmPassword">
        <input
          value={formState.confirmPassword}
          onChange={handleChange}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          data-testid="confirm-password-input"
        />
      </SecondaryStyledTextInput>
      <StyledPrimaryButton data-testid="confirm-button">
        Confirm
      </StyledPrimaryButton>
    </StyledForm>
  );
};
