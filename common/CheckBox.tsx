import { colors } from '@styles/colors';
import { ChangeEvent, useId } from 'react';
import styled from 'styled-components';

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  id?: string;
}

const StyledCheckbox = styled.label`
  &.checked {
    color: ${colors.secondary.text};
  }
`;

export const StyledCheckBoxInput = styled.input`
  opacity: 0.2;
  cursor: pointer;
  &:checked {
    opacity: 1;
  }
  margin-right: 5px;
  accent-color: ${colors.secondary.border};
`;

const Checkbox = ({
  checked,
  onChange = () => null,
  label,
  ...rest
}: CheckboxProps) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const id = useId();

  return (
    <StyledCheckbox className={checked ? 'checked' : ''} htmlFor={id}>
      <StyledCheckBoxInput
        {...rest}
        type="checkbox"
        checked={checked}
        onChange={handleInputChange}
      />
      <span>{label}</span>
    </StyledCheckbox>
  );
};

export default Checkbox;
