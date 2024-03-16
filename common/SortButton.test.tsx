import { render, screen, fireEvent } from '@testing-library/react';
import SortButton from './SortButton'; // Adjust the import path as needed

describe('SortButton', () => {
  it('renders the children passed to it', () => {
    render(<SortButton>Test Button</SortButton>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('renders the appropriate arrow when sortOrder is "asc"', () => {
    render(<SortButton sortOrder="asc">Test Button</SortButton>);
    expect(screen.getByText('↑')).toBeInTheDocument();
  });

  it('renders the appropriate arrow when sortOrder is "desc"', () => {
    render(<SortButton sortOrder="desc">Test Button</SortButton>);
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('does not render an arrow when sortOrder is not provided', () => {
    render(<SortButton>Test Button</SortButton>);
    expect(screen.queryByText('↓')).not.toBeInTheDocument();
    expect(screen.queryByText('↑')).not.toBeInTheDocument();
  });

  it('calls the onClick method when the button is clicked', () => {
    const handleClick = jest.fn();
    render(<SortButton onClick={handleClick}>Test Button</SortButton>);
    fireEvent.click(screen.getByText('Test Button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
