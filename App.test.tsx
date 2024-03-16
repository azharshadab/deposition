import App from './App';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactComponentElement } from 'react';
import { act } from 'react-dom/test-utils';
import { useAuth } from '@hooks/useAuth';

jest.mock('@hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@pages/Home/HomePage', () => () => (
  <div data-testid="home-page"></div>
));

window.gtag = jest.fn();

const renderWithRouter = (
  ui: ReactComponentElement<any>,
  { route = '/' } = {},
) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui);
};

describe('Routing test', () => {
  const sideBarIsRendered = () => {
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();
  };

  it('always rendered the side bar', () => {
    (useAuth as jest.Mock).mockReturnValue('authenticated');
    renderWithRouter(<App />);
    sideBarIsRendered();
    const navlinks = screen.getAllByTestId('nav-link');
    const lastLink = navlinks.at(-1)!;
    act(() => {
      userEvent.click(lastLink);
    });
    sideBarIsRendered();
  });
  it('will not render home page if auth is not set up', () => {
    (useAuth as jest.Mock).mockReturnValue('unauthenticated');
    renderWithRouter(<App />);
    const loginPage = screen.getByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
    const homePage = screen.queryByTestId('home-page');
    expect(homePage).not.toBeInTheDocument();
  });

  it('tracks page views on navigation', async () => {
    (useAuth as jest.Mock).mockReturnValue('authenticated');
    renderWithRouter(<App />);

    const navlinks = screen.getAllByTestId('nav-link');
    const someLink = navlinks[0]; // Assuming this is a link to a different page
    act(() => {
      userEvent.click(someLink);
    });

    await waitFor(() => {
      expect(window.gtag).toHaveBeenCalledWith(
        'config',
        'G-SXTHH2DC6G',
        expect.any(Object),
      );
    });
  });
});
