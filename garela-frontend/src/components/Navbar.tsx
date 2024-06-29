import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useState } from "react";
import LoginModal from "./LoginModal";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${(props) => props.theme.colors.surface};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e5e5e5;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  a {
    margin-left: 1rem;
    text-decoration: none;
    color: ${(props) => props.theme.colors.text};
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Button = styled.button`
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primaryForeground};
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}90;
  }
`;

const MountainIcon = styled.svg`
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
`;

const Navbar: React.FC = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  return (
    <>
      <Nav>
        <Logo>
          <MountainIcon
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
          </MountainIcon>
          Acme Inc
        </Logo>
        <NavLinks>
          <Link to="/">Home</Link>
          <Link to="/board">Board</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/settings">Settings</Link>
          <Button onClick={openLoginModal}>Login</Button>
          <Link to="/auth/register">Register</Link>
        </NavLinks>
      </Nav>
      <LoginModal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal} />
    </>
  );
};

export default Navbar;
