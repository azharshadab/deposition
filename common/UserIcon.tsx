import { useHttp } from '@hooks/useHttp';
import { authenticationService } from '@services/authentication';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Image from './Image';
import useClickOutside from '@hooks/useClickOutside';
import { useRef, useState } from 'react';

const StyledUserIcon = styled.div`
  position: absolute;
  top: 40px;
  right: 50px;
  display: flex;
  align-items: center;
  cursor: pointer;
  p {
    margin-right: 27px;
    color: grey;
    font-size: 15px;
    font-weight: 500;
  }
  .dropdown-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 23px;
    width: 100%;
  }
`;

const DropdownBtn = styled.button`
  text-align: left;
  opacity: 0.7;
  border: hsl(0, 0%, 69.19607843137255%) 1px solid;
  color: grey;
  width: 100%;
  padding: 0.5rem 1rem;
`;

const UserIcon = () => {
  const [dropdownOpen, toggleDropdownOpen] = useState(false);

  const [payload, loading] = useHttp(
    () => authenticationService.getUserPayload(),
    {
      initialData: {},
    },
  );

  const ref = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useClickOutside(ref, () => toggleDropdownOpen(false));

  const signOutAndRedirect = () => {
    authenticationService.signOut();
    navigate('/login');
  };

  if (loading) return <></>;

  return (
    <StyledUserIcon
      ref={ref}
      data-testid="user-name"
      onClick={() => toggleDropdownOpen(!dropdownOpen)}
    >
      <p>
        {payload?.given_name} {payload?.family_name}
      </p>
      <Image
        style={{
          width: '24px',
          height: '24px',
        }}
        src="/user_icon_arrow.svg"
      />
      {dropdownOpen && (
        <div className="dropdown-container">
          <DropdownBtn
            data-testid="logout-button"
            id="logout-button"
            onClick={signOutAndRedirect}
          >
            Logout
          </DropdownBtn>
          <DropdownBtn
            id="supoort-btn"
            as={'a'}
            href="/Deposition Insights User Guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support
          </DropdownBtn>
        </div>
      )}
    </StyledUserIcon>
  );
};

export default UserIcon;
