import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionsTableRow from './QuestionsTableRow'; 

describe('QuestionsTableRow', () => {
  const mockQuestion = {
    id: 1,
    question: 'What is your name?',
    answer: 'My name is John.',
    question_speaker: 'Interviewer',
    answer_speaker: 'John',
    page_line: 'Page 5, Line 20',
    score: 95,
  };

  beforeEach(() => {
    render(<QuestionsTableRow question={mockQuestion} />);
  });

  it('renders the question and its details', () => {
    expect(screen.getByTestId('transcript-explorer-question-1')).toHaveTextContent('Q: What is your name?');
    expect(screen.getByTestId('transcript-explorer-question-answer-1')).toHaveTextContent('A: My name is John.');
    expect(screen.getByTestId('transcript-explorer-question-speaker-1')).toHaveTextContent('Interviewer');
    expect(screen.getByTestId('transcript-explorer-question-answerer-speaker-1')).toHaveTextContent('John');
    expect(screen.getByTestId('transcript-explorer-question-page-line-1')).toHaveTextContent('Page 5, Line 20');
    
    if (mockQuestion.score) {
      expect(screen.getByTestId('transcript-explorer-question-score-1')).toHaveTextContent('95%');
    }
  });

  it('toggles the checkbox', () => {
    const checkbox = screen.getByTestId(`transcript-explorer-question-checkbox-${mockQuestion.id}`);
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});


