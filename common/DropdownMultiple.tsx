import React, { HTMLAttributes, MouseEvent, useRef, useState } from 'react';
import Image from './Image';
import useClickOutside from '@hooks/useClickOutside';
import { StyledCheckBoxInput } from './CheckBox';
import {
  DropdownHeader,
  DropdownListContainer,
  DropdownWrapper,
  ListItem,
} from '@styles/dropdown';

interface DropdownOption {
  value: string | number;
  label: string;
}

interface DropdownProps extends HTMLAttributes<HTMLElement> {
  placeholder: string;
  options: DropdownOption[];
  selectedOption: string[];
  setSelectedOption: (value: string[]) => void;
}

const DropdownMultiple: React.FC<DropdownProps> = ({
  placeholder,
  options,
  selectedOption,
  setSelectedOption,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleListItemClick = (
    event: React.MouseEvent,
    value: string | number,
  ) => {
    event.stopPropagation();
    handleOptionClick(value);
  };

  const handleOptionClick = (value: string | number) => {
    const isSelected = selectedOption.includes(value.toString());
    if (isSelected) {
      setSelectedOption(
        selectedOption.filter(option => option !== value.toString()),
      );
    } else {
      setSelectedOption([...selectedOption, value.toString()]);
    }
  };

  return (
    <DropdownWrapper
      onClick={toggleDropdown}
      {...rest}
      ref={dropdownRef as any}
    >
      <DropdownHeader>
        <span data-testid={placeholder}>{placeholder}</span>
        <Image src="/dropdown_arrow.svg" />
      </DropdownHeader>
      {isOpen && (
        <DropdownListContainer>
          <ul>
            {/* 
              Please do not delete this List Item. 
              It prevents a very strange bug where when 
              the dropdown is opend the first List item 
              is auto selcted for some reason. 
            */}
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
                onClick={(event: MouseEvent) =>
                  handleListItemClick(event, option.value)
                }
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

export default DropdownMultiple;
