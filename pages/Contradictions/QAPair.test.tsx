import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import QAPair from './QAPair';
describe('QAPair', () => {
  const mockProps = {
    first: true,
    id: 1,
    question: 'What did you see?',
    answer: 'I saw a blue car.',
    page: '15',
    line: '10',
    witness: 'John Doe',
  };

  it('renders the witness name correctly', () => {
    render(<QAPair {...mockProps} />);
    expect(screen.getByTestId('transcript-contradictions-first-witnes-1')).toHaveTextContent(mockProps.witness);
  });

  it('renders the question correctly', () => {
    render(<QAPair {...mockProps} />);
    expect(screen.getByTestId('transcript-contradictions-first-question-1')).toHaveTextContent(mockProps.question);
  });

  it('renders the answer correctly', () => {
    render(<QAPair {...mockProps} />);
    expect(screen.getByTestId('transcript-contradictions-first-answer-1')).toHaveTextContent(mockProps.answer);
  });

  it('renders the page and line number correctly', () => {
    render(<QAPair {...mockProps} />);
    expect(screen.getByTestId('transcript-contradictions-first-page-line-1')).toHaveTextContent(`${mockProps.page}:${mockProps.line}`);
  });
});
