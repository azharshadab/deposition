import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DropdownMultiple from './DropdownMultiple';

const mockOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

const setup = (selected: string[] = []) => {
  const setSelectedOption = jest.fn();
  const utils = render(
    <DropdownMultiple
      placeholder="Select options"
      options={mockOptions}
      selectedOption={selected}
      setSelectedOption={setSelectedOption}
    />,
  );
  return {
    setSelectedOption,
    ...utils,
  };
};

describe('DropdownMultiple', () => {
  it('renders with the correct placeholder', () => {
    setup();
    expect(screen.getByTestId('Select options')).toBeInTheDocument();
  });

  it('toggles dropdown on click', () => {
    setup();
    const dropdown = screen.getByTestId('Select options').parentElement;
    if (!dropdown) throw new Error('Dropdown element not found');
    fireEvent.click(dropdown);
    expect(screen.getByRole('list')).toBeInTheDocument();
    fireEvent.click(dropdown);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('closes the dropdown when clicking outside', () => {
    setup();
    const dropdown = screen.getByTestId('Select options').parentElement;
    if (!dropdown) throw new Error('Dropdown element not found');
    fireEvent.click(dropdown);
    expect(screen.getByRole('list')).toBeInTheDocument();
    fireEvent.mouseDown(document);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('calls setSelectedOption with the correct values on item click', () => {
    const { setSelectedOption } = setup();
    const dropdown = screen.getByTestId('Select options').parentElement;
    if (!dropdown) throw new Error('Dropdown element not found');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId(`option-Option 1-1`));
    expect(setSelectedOption).toHaveBeenCalledWith(['1']);
  });
});
