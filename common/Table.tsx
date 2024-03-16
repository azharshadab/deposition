import { colors } from '@styles/colors';
import { HtmlHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

interface TableProps extends HtmlHTMLAttributes<any> {
  headers: ReactNode[];
  rows: ReactNode[];
}

const StyledTable = styled.table`
  width: 100%;
  margin-top: 10px;
  border: 1px solid ${colors.grey[75]};

  thead {
    font-weight: 700;
    line-height: 22px;
    background-color: ${colors.grey[200]};
    th {
      text-align: left;
      width: 100%;
    }
  }
  tr {
    padding: 19px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 10px;
  }
`;

const Table = ({ headers, rows, ...rest }: TableProps) => (
  <StyledTable {...rest}>
    <thead>
      <tr>{headers}</tr>
    </thead>
    <tbody>{rows}</tbody>
  </StyledTable>
);

export default Table;
