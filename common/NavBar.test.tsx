import React, {ReactElement} from 'react';
import { render, screen, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Navbar from './NavBar';


interface RenderWithRouterOptions {
    route?: string;
  }
  
describe('Navbar', () => {
    const renderWithRouter = (component: ReactElement): RenderResult => {
      return render(<Router>{component}</Router>);
    };

  it('renders Navbar with all navigation links', () => {
    renderWithRouter(<Navbar />);

    expect(screen.getByRole('link', { name: /Home/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Transcript Explorer/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Statistics/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contradictions/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Summary/ })).toBeInTheDocument();
  });

  it('renders images with correct alt text', () => {
    renderWithRouter(<Navbar />);

    expect(screen.getByAltText('home picture')).toBeInTheDocument();
    expect(screen.getByAltText('explorer picture')).toBeInTheDocument();
    expect(screen.getByAltText('statistics picture')).toBeInTheDocument();
    expect(screen.getByAltText('contradictions picture')).toBeInTheDocument();
    expect(screen.getByAltText('summary picture')).toBeInTheDocument();
  });

  it('StyledNavLink should navigate to the correct path', () => {
    renderWithRouter(<Navbar />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  
    const explorerLink = screen.getByRole('link', { name: /transcript explorer/i });
    expect(explorerLink).toHaveAttribute('href', '/explorer');
  
    const statisticsLink = screen.getByRole('link', { name: /statistics/i });
    expect(statisticsLink).toHaveAttribute('href', '/statistics');
  
    const contradictionsLink = screen.getByRole('link', { name: /contradictions/i });
    expect(contradictionsLink).toHaveAttribute('href', '/contradictions');
  
    const summaryLink = screen.getByRole('link', { name: /summary/i });
    expect(summaryLink).toHaveAttribute('href', '/summary');
  });
 });

