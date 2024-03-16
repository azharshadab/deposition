import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SideCard from './SideCard'; 
import { BrowserRouter as Router } from 'react-router-dom';

describe('SideCard', () => {
  const mockProps = {
    clusteringId: 1,
    keywords: ['Keyword1', 'Keyword2'],
    numberOfWords: 100,
    averageWords: 10,
    objectionRatio: 0.5,
    strikeRatio: 0.3,
    contradiction: 2,
    average: 75,
  };

  beforeEach(() => {
    render(
      <Router>
        <SideCard {...mockProps} />
      </Router>
    );
  });

  it('renders View Explorer link', () => {
    expect(screen.getByText('View Explorer')).toBeInTheDocument();
    expect(screen.getByText('View Explorer').closest('a')).toHaveAttribute('href', `/explorer/t/${mockProps.clusteringId}`);
  });

  it('renders the number of words correctly', () => {
    expect(screen.getByTestId('number-of-words')).toHaveTextContent(mockProps.numberOfWords.toString());
  });

  it('renders average words per question correctly', () => {
    expect(screen.getByTestId('average-words')).toHaveTextContent(mockProps.averageWords.toString());
  });

  it('renders objection ratio correctly', () => {
    expect(screen.getByTestId('objection-ratio')).toHaveTextContent(mockProps.objectionRatio.toString());
  });

  it('renders strike ratio correctly', () => {
    expect(screen.getByTestId('strike-ratio')).toHaveTextContent(mockProps.strikeRatio.toString());
  });

  it('renders contradiction correctly', () => {
    expect(screen.getByTestId('contradiction')).toHaveTextContent(mockProps.contradiction.toString());
  });

  it('renders average percentage correctly', () => {
    expect(screen.getByTestId('average-percentage')).toHaveTextContent(mockProps.average.toString());
  });
});
