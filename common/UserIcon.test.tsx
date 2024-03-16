import { render, fireEvent, act } from '@testing-library/react';
import UserIcon from './UserIcon';
import { useNavigate } from 'react-router-dom';
import { authenticationService } from '@services/authentication';
import { Wrapper } from 'wrapper';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('@services/authentication', () => ({
  authenticationService: {
    signOut: jest.fn(),
    getUserPayload: jest.fn(),
  },
}));

describe('UserIcon', () => {
  it('calls signOut and redirects to login on sign out button click', async () => {
    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => navigateMock);
    (authenticationService.getUserPayload as jest.Mock).mockResolvedValue({});

    const { findByTestId } = render(
      <Wrapper>
        <UserIcon />
      </Wrapper>,
    );

    fireEvent.click(await findByTestId('user-name'));

    await act(async () => {
      fireEvent.click(await findByTestId('logout-button'));
    });

    expect(authenticationService.signOut).toHaveBeenCalled();

    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  it('renders the user name based on the getUserPayload method', async () => {
    const testUserPayload = {
      given_name: 'John',
      family_name: 'Doe',
    };

    (authenticationService.getUserPayload as jest.Mock).mockResolvedValue(
      testUserPayload,
    );

    const { findByTestId } = render(
      <Wrapper>
        <UserIcon />
      </Wrapper>,
    );

    const userNameElement = await findByTestId('user-name');

    expect(userNameElement).toHaveTextContent('John Doe');
  });
});
