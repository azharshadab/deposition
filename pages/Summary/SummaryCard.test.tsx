import { render, screen } from '@testing-library/react';
import SummaryCard from './SummaryCard'; // update the path accordingly

describe('SummaryCard Component', () => {
  const renderSummaryCard = (
    textContent: string,
    attorneyName: string,
    date?: string,
  ) => {
    render(
      <SummaryCard
        textContent={textContent}
        attorneyName={attorneyName}
        date={date}
      />,
    );
  };

  describe('Without date', () => {
    beforeEach(() => {
      renderSummaryCard('Test content', 'John Doe', undefined);
    });

    it('displays attorneyName correctly', () => {
      expect(screen.getByText(/Attorney Name:/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    it('displays textContent correctly', () => {
      const textContentElement = screen.getByText('Test content');
      expect(textContentElement).toBeInTheDocument();
    });

    it('does not display date when not provided', () => {
      const dateElement = screen.queryByTestId('deposition-date');
      expect(dateElement).not.toBeInTheDocument();
    });
  });

  describe('With date', () => {
    beforeEach(() => {
      renderSummaryCard('Test content', 'John Doe', '2023-11-01');
    });

    it('displays date correctly when provided', () => {
      const dateElement = screen.getByTestId('deposition-date');
      expect(dateElement).toBeInTheDocument();
      expect(screen.getByText(/2023-11-01/i)).toBeInTheDocument();
    });
  });
});
