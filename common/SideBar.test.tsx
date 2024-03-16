import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './SideBar';

jest.mock('./NavBar', () => () => <div data-testid="navbar">NavbarMock</div>);
jest.mock('./Image', () => () => <img data-testid="logo" src="/lexitas_logo.jpg" alt="logo" />);

describe('Sidebar', () => {
  it('renders the sidebar', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('contains a logo inside a link', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByTestId('logo').closest('a')).toHaveAttribute('href', '/');
  });

  it('renders the Navbar component', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('includes copyright information with the current year', () => {
    const currentYear = new Date().getFullYear();
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText(`© ${currentYear} Lexitas. Patent Pending - All rights reserved.`)).toBeInTheDocument();
    expect(screen.getByText('Terms of Service').closest('a')).toHaveAttribute('href', 'https://www.lexitaslegal.com/terms-of-service');
  });
});
