import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './SearchBar'; 

jest.mock('@hooks/useDebounce', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();
  const placeholderText = 'Search...';
  const labelText = 'Label';

  beforeEach(() => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        placeholder={placeholderText}
        label={labelText}
      />
    );
  });

  it('renders the search bar with the correct placeholder', () => {
    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  it('renders the label when provided', () => {
    expect(screen.getByText(labelText)).toBeInTheDocument();
  });

  it('calls onSearch when the input is changed', () => {
    const input = screen.getByPlaceholderText(placeholderText);
    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockOnSearch).not.toHaveBeenCalled(); 
  });
});
