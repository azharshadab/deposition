import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GraphList } from './GraphList'; 

describe('GraphList', () => {
  const mockStats = [
    { lawyer_name: 'Lawyer 1', num_que: 10, avg_words: 20, obj_ratio: 0.5, strike_ratio: 0.2 },
    { lawyer_name: 'Lawyer 2', num_que: 15, avg_words: 25, obj_ratio: 0.6, strike_ratio: 0.3 },
    { lawyer_name: 'Lawyer 3', num_que: 20, avg_words: 30, obj_ratio: 0.7, strike_ratio: 0.4 },
  ];

  const renderComponent = (mainCard: string) => {
    render(
      <GraphList
        mainCard={mainCard}
        setMainCard={() => {}}
        currentStats={mockStats}
      />
    );
  };

  it('renders No. of Questions card when mainCard is "No. of Questions"', () => {
    renderComponent('No. of Questions');
    expect(screen.getByTestId('statistics-card-title')).toHaveTextContent('No. of Questions');
  });

  it('renders Average Words Per Question card when mainCard is "Average Words Per Question"', () => {
    renderComponent('Average Words Per Question');
    expect(screen.getByTestId('statistics-card-title')).toHaveTextContent('Average Words Per Question');
  });

  it('renders Objection Ratio card when mainCard is "Objection Ratio"', () => {
    renderComponent('Objection Ratio');
    expect(screen.getByTestId('statistics-card-title')).toHaveTextContent('Objection Ratio');
  });

  it('renders Strike Ratio card when mainCard is "Strike Ratio"', () => {
    renderComponent('Strike Ratio');
    expect(screen.getByTestId('statistics-card-title')).toHaveTextContent('Strike Ratio');
  });
});
