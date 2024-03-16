import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dropdown from './Dropdown';
const mockOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

describe('Dropdown', () => {
  it('renders with the correct placeholder', () => {
    render(
      <Dropdown
        placeholder="Select an option"
        options={mockOptions}
        selectedOption=""
        setSelectedOption={() => {}}
      />,
    );
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('displays the label when it is provided', () => {
    const { getByText } = render(
      <Dropdown
        label="Test Label"
        placeholder="Select an option"
        options={mockOptions}
        selectedOption=""
        setSelectedOption={() => {}}
      />,
    );
    expect(getByText('Test Label')).toBeInTheDocument();
  });

  it('renders the correct number of options', () => {
    render(
      <Dropdown
        placeholder="Select an option"
        options={mockOptions}
        selectedOption=""
        setSelectedOption={() => {}}
      />,
    );
    expect(screen.getAllByRole('option').length).toBe(3);
  });

  it('calls setSelectedOption when an option is selected', () => {
    const setSelectedOptionMock = jest.fn();
    render(
      <Dropdown
        placeholder="Select an option"
        options={mockOptions}
        selectedOption={mockOptions[0].value}
        setSelectedOption={setSelectedOptionMock}
      />,
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
    expect(setSelectedOptionMock).toHaveBeenCalledWith('2');
  });
});
