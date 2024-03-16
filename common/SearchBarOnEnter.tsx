import { KeyboardEvent, HTMLAttributes } from 'react';
import {
  PrimaryStyledTextInput,
  SecondaryStyledTextInput,
} from '@styles/inputs';

interface SearchBarOnEnterProps extends HTMLAttributes<any> {
  onSearch: (searchValue: string) => void;
  placeholder: string;
  value: string;
  label?: string;
  secondary?: boolean;
  id: string;
}

const SearchBarOnEnter = ({
  onSearch,
  placeholder,
  value,
  label,
  secondary = false,
  id,
  ...rest
}: SearchBarOnEnterProps) => {
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onSearch(value);
  };

  const Label = secondary ? SecondaryStyledTextInput : PrimaryStyledTextInput;

  return (
    <Label
      showMagnifyingGlass={true}
      className="search-bar"
      htmlFor={id}
      {...rest}
    >
      {label}
      <input
        {...rest}
        type="text"
        value={value}
        onKeyUp={handleKeyPress}
        placeholder={placeholder}
        id={id}
      />
    </Label>
  );
};

export default SearchBarOnEnter;
