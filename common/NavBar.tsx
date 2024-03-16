import styled from 'styled-components';
import { StyledNavLink } from '@styles/link';
import Image from './Image';
import { colors } from '@styles/colors';

const StyledNavBar = styled.nav`
  width: 100%;
  ul,
  li,
  a {
    width: 100%;
  }
  position: absolute;
  left: 0;
  top: 136px;

  a {
    padding: 10px 10px 10px 24px;
    margin-bottom: 10px;
    display: flex;
    height: 52px;
    text-align: center;
    font-weight: 400;
    color: #1d1d1d;
    font-size: 16px;
    &.active {
      background-color: ${colors.secondary.background};
      color: ${colors.secondary.text};
      border-right: 4px solid ${colors.secondary.border};
    }
  }

  .img {
    margin-right: 9px;
    width: 24px;
    height: 24px;
  }
`;

const Navbar = () => {
  return (
    <StyledNavBar>
      <ul>
        <li>
          <StyledNavLink id="home-page-link" data-testid="nav-link" to="/">
            {({ isActive }: { isActive: boolean }) => (
              <>
                <Image
                  alt="home picture"
                  src={`/home${isActive ? '_colored' : ''}.svg`}
                />
                <span>Home</span>
              </>
            )}
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            id="explorer-page-link"
            data-testid="nav-link"
            to="/explorer"
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <Image
                  alt="explorer picture"
                  src={`/explorer${isActive ? '_colored' : ''}.svg`}
                />
                <span>Transcript Explorer</span>
              </>
            )}
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            id="statistics-page-link"
            data-testid="nav-link"
            to="/statistics"
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <Image
                  alt="statistics picture"
                  src={`/statistics${isActive ? '_colored' : ''}.svg`}
                />
                <span>Statistics</span>
              </>
            )}
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            id="contradictions-page-link"
            data-testid="nav-link"
            to="/contradictions"
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <Image
                  alt="contradictions picture"
                  src={`/contradictions${isActive ? '_colored' : ''}.svg`}
                />
                <span>Contradictions</span>
              </>
            )}
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            id="summary-page-link"
            data-testid="nav-link"
            to="/summary"
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <Image
                  alt="summary picture"
                  src={`/summary${isActive ? '_colored' : ''}.svg`}
                />
                <span>Summary</span>
              </>
            )}
          </StyledNavLink>
        </li>
      </ul>
    </StyledNavBar>
  );
};

export default Navbar;
