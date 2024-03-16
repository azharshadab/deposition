import { useState } from 'react';
import { authenticationService } from '@services/authentication';
import { useBoolean } from '@hooks/useBoolean';
import { EmailForm } from './EmailForm';
import { PasswordForm } from './PasswordForm';
import { useNavigate } from 'react-router-dom';
import { useDialogContext } from '@common/Dialog';
import { Logo } from '@common/Logo';
import styled from 'styled-components';

const StyledForgotPasswordPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .logo-container {
    margin-top: 100px;
    margin-bottom: -150px;
  }
`;

export default function ForgotPassword() {
  const [verificationCodeSent, toggleVerificationCodeSent] = useBoolean(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { sendMessage } = useDialogContext();

  const handleSubmit = async () => {
    try {
      await authenticationService.forgotPassword(email);
      sendMessage(`A confirmation code was sent to ${email}`);
      toggleVerificationCodeSent();
    } catch (e) {
      sendMessage(`That email is invalid`);
      console.log(e);
    }
  };

  const handleConfirm = async (code: string, password: string) => {
    try {
      await authenticationService.confirmPassword(email, code, password);
      navigate('/login');
    } catch (e) {
      sendMessage(`Invalid code provided`);
      console.log(e);
    }
  };

  return (
    <StyledForgotPasswordPage>
      <Logo />
      {verificationCodeSent ? (
        <PasswordForm onConfirm={handleConfirm} />
      ) : (
        <EmailForm email={email} setEmail={setEmail} onSubmit={handleSubmit} />
      )}
    </StyledForgotPasswordPage>
  );
}
