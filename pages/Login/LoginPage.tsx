import { FormEvent, useState } from 'react';
import { authenticationService } from '@services/authentication';
import { useNavigate } from 'react-router-dom';
import { SecondaryStyledTextInput } from '@styles/inputs';
import { useForm } from '@hooks/useForm';
import { StyledPrimaryButton } from '@styles/buttons';
import { StyledLink } from '@styles/link';
import { ErrorMessage, StyledForm } from '@styles/form';
import Image from '@common/Image';
import { Logo } from '@common/Logo';

type FormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { formState, handleChange } = useForm<FormValues>({
    email: '',
    password: '',
  });

  const [error, setError] = useState(false);
  const redirect = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await authenticationService.signInUser(
      formState.email,
      formState.password,
    );
    res ? redirect('/') : setError(true);
  };

  return (
    <StyledForm onSubmit={handleSubmit} data-testid="login-page">
      <Logo />
      {error && (
        <ErrorMessage id="login-failed-msg">
          Invalid login attempt. Please check the
          <br /> username and password and try again.
        </ErrorMessage>
      )}
      <SecondaryStyledTextInput htmlFor="login-email-input">
        <input
          id="login-email-input"
          name="email"
          type="email"
          placeholder="Email"
          value={formState.email}
          onChange={handleChange}
        />
      </SecondaryStyledTextInput>
      <SecondaryStyledTextInput htmlFor="login-password-input">
        <input
          id="login-password-input"
          name="password"
          type="password"
          placeholder="Password"
          value={formState.password}
          onChange={handleChange}
        />
      </SecondaryStyledTextInput>
      <div className="btns">
        <StyledPrimaryButton id="login-submit-btn" type="submit">
          Log in
        </StyledPrimaryButton>
        <StyledLink id="forgot-password-link" to="/forgot-password">
          Forgot Password?
        </StyledLink>
      </div>
    </StyledForm>
  );
};

export default LoginForm;
