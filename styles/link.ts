import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from './colors';

export const StyledNavLink = styled(NavLink)`
  color: black;
  display: flex;
  align-items: center;
`;

export const StyledLink = styled(Link)`
  color: ${colors.secondary.text};
  text-decoration: underline;
  font-size: 12px;
`;

export const StyledLinkAsButton = styled.button`
  color: ${colors.secondary.text};
  text-decoration: underline;
  font-size: 12px;
`;
