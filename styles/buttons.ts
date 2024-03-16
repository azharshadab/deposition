import styled from 'styled-components';
import { colors } from './colors';

const StyledButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 2px;
  min-width: 155px;
  padding: 14px 40px;
  height: 40px;
  margin: 5px;
  font-size: 16px;
  font-family: sans-serif;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledPrimaryButton = styled(StyledButton)`
  background-color: ${colors.secondary.border};
  color: white;
`;

export const StyledSecondaryButton = styled(StyledButton)`
  background-color: white;
  color: ${colors.secondary.text};
  outline: solid 1px ${colors.secondary.border};
  outline-offset: -1px;
  outline-style: dashed;
  border-radius: 2px;
`;

export const StyledTertiaryButton = styled(StyledSecondaryButton)`
  border: 2px solid ${colors.secondary.border};
`;

export const StyledTableButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin-top: -7px;
  width: 100%;
  button,
  a {
    span {
      color: black;
    }
    gap: 1.6198px;
    .img {
      width: 19.437px;
      height: 19.437px;
    }
    font-size: 12px;
    line-height: 14.06px;
    margin-right: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;
