import styled from 'styled-components';
import { colors } from './colors';

export const StyledForm = styled.form`
  margin: 200px;
  display: flex;
  align-items: center;
  flex-direction: column;
  label {
    padding-bottom: 20px;
  }
  .btns {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    width: 300px;
  }
`;

export const ErrorMessage = styled.p`
  color: ${colors.red[1]};
  font-weight: 500;
  font-size: 1.2rem;
  margin: 1rem;
`;
