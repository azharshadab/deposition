import styled from 'styled-components';
import { SecondaryStyledDropdown } from './inputs';
import { colors } from './colors';

export const DropdownWrapper = styled(SecondaryStyledDropdown)`
  position: relative;
  height: 26px;
  border-bottom: 1px solid ${colors.secondary.border};
  width: 260px;
  margin: 1rem;
  color: ${colors.grey[300]};
`;

export const DropdownHeader = styled.div`
  cursor: pointer;
  color: #6b6b6b;
  font-size: 16px;
  font-style: italic;
  text-align: start;
  padding: 0px 3px;
  position: relative;
  .img {
    position: absolute;
    top: -3px;
    right: 3px;
    width: 16px;
    height: 16px;
  }
`;

export const DropdownListContainer = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  border-top: 1px solid #ccc;
  background: #fff;
  border: 1px solid ${colors.grey[100]};
  overflow-y: auto;
  max-height: 350px;
`;

export const ListItem = styled.li`
  min-height: 30px;
  &:first-of-type {
    min-height: 1px;
    padding: 0;
  }
  height: min-content;
  border-bottom: 1px solid ${colors.grey[75]};
  color: #131315;
  font-size: 16px;
  line-height: 15px;
  list-style: none;
  cursor: pointer;
  padding: 0.5rem;
  &.selected {
    background-color: ${colors.secondary.background};
    color: ${colors.secondary.text};
  }
`;
