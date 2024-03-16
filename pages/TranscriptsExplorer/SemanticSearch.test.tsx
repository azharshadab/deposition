import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SemanticSearch from './SemanticSearch';

describe('SemanticSearch', () => {
  const mockSearch = jest.fn();

  beforeEach(() => {
    render(<SemanticSearch search={mockSearch} />);
  });

  it('renders the search input', () => {
    expect(screen.getByPlaceholderText('Semantic Search')).toBeInTheDocument();
  });

 it('calls the search function after pressing the Enter key in the search input', async () => {
    const input = screen.getByPlaceholderText('Semantic Search');
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.keyUp(input, { key: 'Enter', code: 'Enter' });
    expect(mockSearch).toHaveBeenCalledWith('test query');
  });

  it('renders radio options', () => {
    expect(screen.getByLabelText('Who signed the contract?')).toBeInTheDocument();
    expect(screen.getByLabelText('Which factors contributed to this situation?')).toBeInTheDocument();
  });

  it('updates the query and calls the search function when a radio option is selected', () => {
    const radioOption = screen.getByLabelText('Who signed the contract?');
    fireEvent.click(radioOption);
    expect(radioOption).toBeChecked();
    expect(mockSearch).toHaveBeenCalledWith('Who signed the contract?');
  });
});
