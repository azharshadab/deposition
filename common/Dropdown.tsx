import { DropdownOption } from '@interfaces/option';
import { PrimaryStyledDropdown, SecondaryStyledDropdown } from '@styles/inputs';
import { ChangeEvent, HTMLAttributes } from 'react';

interface DropdownProps extends HTMLAttributes<HTMLSelectElement> {
  options: DropdownOption[];
  label?: string;
  secondary?: boolean;
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  placeholder?: string;
}

const Dropdown = ({
  placeholder,
  options,
  label,
  secondary = false,
  selectedOption,
  setSelectedOption,
  id,
  ...rest
}: DropdownProps) => {
  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const Label = secondary ? SecondaryStyledDropdown : PrimaryStyledDropdown;

  return (
    <Label htmlFor={id}>
      {label && <div>{label}</div>}
      <select
        {...rest}
        id={id}
        value={selectedOption ?? ''}
        onChange={handleOptionChange}
      >
        {placeholder && (
          <option value="" disabled selected hidden>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option
            id={`${option.label}-${option.value}`}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </Label>
  );
};

export default Dropdown;
