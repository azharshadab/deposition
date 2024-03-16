import styled from 'styled-components';
import { colors } from './colors';

export const StyledRow = styled.tr`
  min-height: 60px;
  height: min-content;
  border-bottom: 1px solid ${colors.grey[75]};
  &.checked {
    background-color: ${colors.secondary.background};
    td:first-of-type {
      color: ${colors.secondary.text};
    }
  }
  td {
    color: #131315;
    font-size: 16px;
    line-height: 22px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
`;

export const StyledTableHead = styled.th`
  display: flex;
  align-items: baseline;
`;
