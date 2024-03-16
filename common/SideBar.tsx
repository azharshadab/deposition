import Navbar from './NavBar';
import styled from 'styled-components';
import Image from './Image';
import { colors } from '@styles/colors';
import { Link } from 'react-router-dom';

const StyledSidebar = styled.aside`
  position: fixed;
  width: 242px;
  height: 100%;
  top: 0;
  max-height: 100vh;
  border-right: 1px solid ${colors.grey[75]};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .logo-container {
    margin: 14px auto;
    width: 216px;
    height: 68px;
  }
  .copyright {
    padding: 30px;
    font-size: 12px;
  }
`;

const Sidebar = () => {
  return (
    <StyledSidebar className="sidebar" data-testid="sidebar">
      <Link to={'/'}>
        <Image className="logo-container" src="/lexitas_logo.jpg" />
      </Link>
      <Navbar />
      <div className="copyright">
        <p>
          &copy; {new Date().getFullYear()} Lexitas. Patent Pending - <br /> All
          rights reserved.{' '}
          <Link to={'https://www.lexitaslegal.com/terms-of-service'}>
            Terms of Service
          </Link>
        </p>
      </div>
    </StyledSidebar>
  );
};

export default Sidebar;
