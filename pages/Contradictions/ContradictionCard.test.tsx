import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ContradictionCard from './ContradictionCard';

describe('ContradictionCard', () => {
    const mockContradiction = {
      id: 1,
      score: '85',
      witness1: 'John Doe',
      que1: 'What did you see?',
      ans1: 'I saw a blue car.',
      line1: '10',
      page1: '15',
      witness2: 'Jane Doe',
      que2: 'Can you describe the vehicle?',
      ans2: 'It was a red car.',
      line2: '20',
      page2: '25',
      contradictionStatus: 'Success', 
      str: 'string value' 
    };

  const mockHandleDelete = jest.fn();

  beforeEach(() => {
    render(<ContradictionCard contradiction={mockContradiction} handleDelete={mockHandleDelete} />);
  });
  
  it('should render the contradiction score', () => {
    expect(screen.getByTestId(`transcript-contradictions-score-${mockContradiction.id}`)).toHaveTextContent(`${mockContradiction.score}%`);
  });

  it('should display two QAPair components', () => {
    expect(screen.getAllByText(/What did you see\?/).length).toBe(1);
    expect(screen.getAllByText(/Can you describe the vehicle\?/).length).toBe(1);
  });

  it('should call handleDelete when delete button is clicked', () => {
    fireEvent.click(screen.getByTestId('transcript-contradictions-delete-btn'));
    expect(mockHandleDelete).toHaveBeenCalled();
  });

  it('should correctly display witness names and answers', () => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('I saw a blue car.')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('It was a red car.')).toBeInTheDocument();
  });
});

