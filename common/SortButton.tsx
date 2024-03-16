import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import styled from 'styled-components';

const StyledSortBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const StyledArrow = styled.span`
  display: inline-block;
  transform: scale(1.5);
  padding-left: 10px;
`;

interface SortButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    PropsWithChildren {
  sortOrder?: 'asc' | 'desc';
}

export default function SortButton({
  sortOrder,
  children,
  ...rest
}: SortButtonProps) {
  return (
    <StyledSortBtn {...rest}>
      {children}
      {sortOrder && (
        <StyledArrow>{sortOrder === 'asc' ? '↑' : '↓'}</StyledArrow>
      )}
    </StyledSortBtn>
  );
}
