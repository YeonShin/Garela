import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  padding-left: 80px;
  padding-right: 80px;
  background-color: ${props => props.theme.colors.background};
  border-top: 1px solid ${props => props.theme.colors.input};

  @media (min-width: 576px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const FooterText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.mutedText};
`;

const FooterNav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const FooterLink = styled(Link)`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterText>&copy; 2024 Garela. All rights reserved.</FooterText>
      <FooterNav>
        <FooterLink to="#">Terms of Service</FooterLink>
        <FooterLink to="#">Privacy</FooterLink>
      </FooterNav>
    </FooterContainer>
  );
};

export default Footer;
