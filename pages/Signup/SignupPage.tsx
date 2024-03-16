import { useDialogContext } from '@common/Dialog';
import Image from '@common/Image';
import { useForm } from '@hooks/useForm';
import { authenticationService } from '@services/authentication';
import { SignUpInfo } from '@services/authentication/helper';
import { StyledPrimaryButton } from '@styles/buttons';
import { StyledForm } from '@styles/form';
import { SecondaryStyledTextInput } from '@styles/inputs';
import { Spinner } from '@styles/spinner';
import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledTermsAndConditions = styled.label`
  margin-left: 80px;
  input {
    border: 20rem solid black;
    margin-right: 10px;
  }
`;

export default function SignupPage() {
  const { formState, handleChange } = useForm<SignUpInfo>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    username: '',
    acceptedTermsAndConditions: false,
  });

  const [loading, setLoading] = useState(false);
  const redirect = useNavigate();

  const { sendMessage } = useDialogContext();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.acceptedTermsAndConditions)
      return sendMessage(`
      You must accept the terms and conditions.
    `);
    try {
      setLoading(true);
      await authenticationService.signUp(formState);
      sendMessage(
        `
        A verification email was sent to ${formState.email}. 
        Please confirm your email address before loggin in. 
        It may be in your spam folder.
        `,
      );
      redirect('/login');
    } catch (e) {
      sendMessage(`There was a an error signing you up. ${e}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <StyledForm onSubmit={onSubmit}>
      <Image className="logo-container" src="/lexitas_logo.jpg" />
      <SecondaryStyledTextInput htmlFor="signup-email-input">
        <input
          id="signup-email-input"
          name="email"
          type="email"
          placeholder="Email"
          value={formState.email}
          onChange={handleChange}
        />
      </SecondaryStyledTextInput>
      <SecondaryStyledTextInput htmlFor="signup-first-name-input">
        <input
          id="signup-first-name-input"
          name="first_name"
          type="first_name"
          placeholder="First Name"
          value={formState.first_name}
          onChange={handleChange}
        />
      </SecondaryStyledTextInput>
      <SecondaryStyledTextInput htmlFor="signup-last-name-input">
        <input
          id="signup-last-name-input"
          name="last_name"
          type="last_name"
          placeholder="Last Name"
          value={formState.last_name}
          onChange={handleChange}
        />
      </SecondaryStyledTextInput>
      <SecondaryStyledTextInput htmlFor="signup-username-input">
        <input
          id="signup-username-input"
          name="username"
          type="username"
          placeholder="Username"
          value={formState.username}
          onChange={handleChange}
        />
      </SecondaryStyledTextInput>
      <SecondaryStyledTextInput htmlFor="signup-password-input">
        <input
          id="signup-password-input"
          name="password"
          type="password"
          placeholder="Password"
          value={formState.password}
          onChange={handleChange}
        />
      </SecondaryStyledTextInput>
      <StyledTermsAndConditions htmlFor="terms-and-conditions">
        <input
          id="terms-and-conditions"
          name="acceptedTermsAndConditions"
          type="checkbox"
          checked={formState.acceptedTermsAndConditions}
          onChange={handleChange}
          data-testid="terms-and-conditions"
        />
        I agree to the Deposition Insights{' '}
        <Link to={'https://www.lexitaslegal.com/terms-of-service'}>
          Terms & Conditions
        </Link>
      </StyledTermsAndConditions>
      <div className="btns">
        <StyledPrimaryButton
          id="signup-submit-btn"
          type="submit"
          data-testid="signup-submit-btn"
        >
          Signup
        </StyledPrimaryButton>
      </div>
    </StyledForm>
  );
}
