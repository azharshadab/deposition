import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GraphCard from './GraphCard'; 
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('@hooks/useElementSize', () => ({
  __esModule: true, 
  default: () => ({ width: 500, height: 300 }),
}));

describe('GraphCard', () => {
  const mockStats = [
    { label: 'Item 1', quantity: 10 },
    { label: 'Item 2', quantity: 20 },
    { label: 'Item 3', quantity: 30 },
    { label: 'Item 4', quantity: 40 },    
  ];

  it('renders the GraphCard with the provided title', () => {
    render(
      <Router>
        <GraphCard
          title="Test Title"
          mainCardIdentifier="test-id"
          stats={mockStats}
          setMainCard={() => {}}
          isMainCard={false}
        />
      </Router>
    );
    expect(screen.getByTestId('statistics-card-title')).toHaveTextContent('Test Title');
  });

  it('renders the View Details link when not a main card', () => {
    render(
      <Router>
        <GraphCard
          title="Test Title"
          mainCardIdentifier="test-id"
          stats={mockStats}
          setMainCard={() => {}}
          isMainCard={false}
        />
      </Router>
    );
    expect(screen.getByTestId('statistics-card-Test Title-details-btn')).toBeInTheDocument();
  });

  it('does not render the View Details link when it is a main card', () => {
    render(
      <Router>
        <GraphCard
          title="Test Title"
          mainCardIdentifier="test-id"
          stats={mockStats}
          setMainCard={() => {}}
          isMainCard={true}
        />
      </Router>
    );
    expect(screen.queryByTestId('statistics-card-Test Title-details-btn')).toBeNull();
  });
});
