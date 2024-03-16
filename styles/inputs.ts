import styled from 'styled-components';
import { colors } from './colors';

const backgroundImage = `url(${process.env.PUBLIC_URL}/assets/magnifying_glass.png)`;
interface StyledTextInputProps {
  showMagnifyingGlass?: boolean;
}

const StyledTextInput = styled.label<StyledTextInputProps>`
  white-space: nowrap;
  display: flex;
  align-items: baseline;
  input {
    background-image: ${props =>
      props.showMagnifyingGlass ? backgroundImage : 'none'};
    padding-left: ${props =>
      props.showMagnifyingGlass ? '28px !important' : '0px'};
    background-position: 5px center;
    background-repeat: no-repeat;
    width: 315px;
    height: 40px;
    padding: 5px;
    &:focus {
      outline: none;
    }
  }
  display: flex;
`;

export const PrimaryStyledTextInput = styled(StyledTextInput)`
  input {
    background-color: ${colors.grey[50]};
    color: ${colors.grey[150]};
    border: 1px solid ${colors.grey[100]};
    &::placeholder {
      color: ${colors.grey[150]};
    }
    border-bottom: 1px solid ${colors.grey[100]};
  }
`;

export const SecondaryStyledTextInput = styled(StyledTextInput)`
  input {
    background-color: ${colors.grey[0]};
    color: ${colors.grey[300]};
    border: none;
    &::placeholder {
      color: ${colors.grey[300]};
    }
    border-bottom: 1px solid ${colors.secondary.border};
  }
`;

const StyledDropdownBase = styled.label`
  font-size: 16px;
  div {
    margin: 5px 0;
    color: #6b6b6b;
  }
  select {
    line-height: 18.75px;
    border: none;
    accent-color: ${colors.secondary.border};
    margin-right: 35px;
    padding-right: 10px;
  }
`;

export const PrimaryStyledDropdown = styled(StyledDropdownBase)`
  color: ${colors.grey[150]};
  select {
    width: 258px;
    height: 23px;
    font-style: italic;
    border-bottom: 1px solid ${colors.secondary.border};
    color: ${colors.grey[300]};
  }
`;

export const SecondaryStyledDropdown = styled(StyledDropdownBase)`
  color: ${colors.grey[300]};
  select {
    width: 376px;
    height: 40px;
    font-style: none;
    border: 1px solid ${colors.grey[100]};
    border-bottom: 1px solid ${colors.grey[100]};
    color: #3c3c436b;
  }
`;
