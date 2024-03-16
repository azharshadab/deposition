import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HomeLink from './HomeLink'; 

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => (
  <Router>{children}</Router>
);

describe('HomeLink', () => {
  it('renders HomeLink and navigates to home on click', () => {
    render(<HomeLink />, { wrapper: Wrapper });
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument(); 
  });
});
