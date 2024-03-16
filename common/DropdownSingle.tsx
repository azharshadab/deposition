import React, { HTMLAttributes, MouseEvent, useRef, useState } from 'react';
import Image from './Image';
import useClickOutside from '@hooks/useClickOutside';
import { DropdownOption } from '@interfaces/option';
import {
  DropdownHeader,
  DropdownListContainer,
  DropdownWrapper,
  ListItem,
} from '@styles/dropdown';
import { StyledCheckBoxInput } from './CheckBox';

interface DropdownProps extends HTMLAttributes<HTMLElement> {
  placeholder: string;
  options: DropdownOption[];
  selectedOption: string;
  setSelectedOption: (value: any) => void;
}

const DropdownSingle: React.FC<DropdownProps> = ({
  placeholder,
  options,
  selectedOption,
  setSelectedOption,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value: string | number) => {
    setSelectedOption(value);
  };

  const handleListItemClick = (
    event: React.MouseEvent,
    value: string | number,
  ) => {
    event.stopPropagation();
    handleOptionClick(value);
    setIsOpen(false);
  };

  const [displayOption, setDisplayOption] = useState(placeholder);
  return (
    <DropdownWrapper
      onClick={toggleDropdown}
      ref={dropdownRef as any}
      {...rest}
    >
      <DropdownHeader>
        <span data-testid={placeholder}>{displayOption}</span>
        <Image src="/dropdown_arrow.svg" />
      </DropdownHeader>
      {isOpen && (
        <DropdownListContainer>
          <ul>
            <ListItem>
              <StyledCheckBoxInput
                style={{ display: 'none' }}
                onClick={(e: MouseEvent) => e.stopPropagation()}
                type="checkbox"
                checked={false}
              />
            </ListItem>
            {options.map(option => (
              <ListItem
                className={
                  selectedOption.includes(option.value.toString())
                    ? 'selected'
                    : ''
                }
                key={option.value}
                onClick={(event: MouseEvent) => {
                  handleListItemClick(event, option.value);
                  setDisplayOption(option.label);
                }}
              >
                <StyledCheckBoxInput
                  id={option.value.toString()}
                  type="checkbox"
                  checked={selectedOption.includes(option.value.toString())}
                />
                <span
                  className={
                    selectedOption.includes(option.value.toString())
                      ? 'selected'
                      : ''
                  }
                  data-testid={`option-${option.label}-${option.value}`}
                >
                  {option.label}
                </span>
              </ListItem>
            ))}
          </ul>
        </DropdownListContainer>
      )}
    </DropdownWrapper>
  );
};

export default DropdownSingle;
