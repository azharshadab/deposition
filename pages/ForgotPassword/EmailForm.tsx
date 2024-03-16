import { useDialogContext } from '@common/Dialog';
import { StyledPrimaryButton } from '@styles/buttons';
import { StyledForm } from '@styles/form';
import { SecondaryStyledTextInput } from '@styles/inputs';
import { FormEvent } from 'react';

type EmailFormProps = {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: () => void;
};

export const EmailForm = ({ email, setEmail, onSubmit }: EmailFormProps) => {
  const { sendMessage } = useDialogContext();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return sendMessage(`Email is required`);
    onSubmit();
  };

  return (
    <StyledForm onSubmit={submit} data-testid="email-form">
      <SecondaryStyledTextInput htmlFor="email">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          required
          data-testid="email-input"
        />
      </SecondaryStyledTextInput>
      <StyledPrimaryButton data-testid="change-password-button">
        Change Password
      </StyledPrimaryButton>
    </StyledForm>
  );
};
