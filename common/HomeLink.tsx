import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Image from './Image';
import { colors } from '@styles/colors';

export const StyledHomeLink = styled(Link)`
  margin-bottom: 11px;
  align-items: center;
  display: flex;
  color: ${colors.secondary.text};
  font-size: 16px;
  .img {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }
`;

export default function HomeLink() {
  return (
    <StyledHomeLink id="main-home-page-link" to="/">
      <Image src="/grey_arrow.svg" /> Home
    </StyledHomeLink>
  );
}
