import { useState, ChangeEvent, useId, HTMLAttributes } from 'react';
import useDebounce from '@hooks/useDebounce';
import {
  PrimaryStyledTextInput,
  SecondaryStyledTextInput,
} from '@styles/inputs';

interface SearchBarProps extends HTMLAttributes<any> {
  onSearch: (searchValue: string) => void;
  placeholder: string;
  label?: string;
  secondary?: boolean;
}

const SearchBar = ({
  onSearch,
  placeholder,
  label,
  secondary = false,
  id,
  ...rest
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  useDebounce([searchValue], 300, () => onSearch(searchValue));

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
        value={searchValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        id={id}
      />
    </Label>
  );
};

export default SearchBar;
