import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchBarOnEnter from './SearchBarOnEnter';

describe('SearchBarOnEnter', () => {
  const mockOnSearch = jest.fn();
  const placeholderText = 'Search...';
  const inputValue = 'test query';
  const label = 'Search Label';
  const id = 'search-bar';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the primary search bar correctly', () => {
    render(
      <SearchBarOnEnter
        onSearch={mockOnSearch}
        placeholder={placeholderText}
        value={inputValue}
        label={label}
        id={id}
      />
    );

    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
    expect(screen.getByLabelText(label)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue(inputValue);
  });

  it('calls onSearch when the Enter key is pressed', () => {
    render(
      <SearchBarOnEnter
        onSearch={mockOnSearch}
        placeholder={placeholderText}
        value={inputValue}
        id={id}
      />
    );

    fireEvent.keyUp(screen.getByRole('textbox'), { key: 'Enter', code: 'Enter' });
    expect(mockOnSearch).toHaveBeenCalledWith(inputValue);
  });

  it('does not call onSearch when a key other than Enter is pressed', () => {
    render(
      <SearchBarOnEnter
        onSearch={mockOnSearch}
        placeholder={placeholderText}
        value={inputValue}
        id={id}
      />
    );

    fireEvent.keyUp(screen.getByRole('textbox'), { key: 'A', code: 'KeyA' });
    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});

