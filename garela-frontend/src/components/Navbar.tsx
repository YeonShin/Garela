import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import PostIcon from "../imgs/postBtn.png";
import ProfileImg from "../imgs/profile.jpg";
import BasicProfileImg from "../imgs/basicProfile.png";
import { useRecoilState } from "recoil";
import { UserInfoType, userInfoState } from "../atom";

Modal.setAppElement("#root");

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
`;

const StyledLink = styled(Link)<{ active?: boolean }>`
  margin-left: 1rem;
  text-decoration: none;
  color: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.text};
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const LoginButton = styled(Link)`
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: black;
  background-color: white;
  border: 1px solid grey;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.text}90;
  }
`;

const RegisterButton = styled(Link)`
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}90;
  }
`;

const PostButton = styled(Link)`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  padding: 0.4rem 0.8rem;
  font-size: 1rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  background-color: white;
  border: 1px solid grey;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.hoverButton}90;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  color: white;
  img {
    width: 16px;
    height: 16px;
  }
`;

const ProfileButton = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  cursor: pointer;
  position: relative;
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 200px;
  z-index: 10;
`;

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e5e5;
`;

const HeaderImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const HeaderName = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
`;

const DropdownItem = styled(Link)`
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: black;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const DropdownButton = styled.div`
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: black;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ConfirmButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}90;
  }
`;

const CancelButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: black;
  background-color: white;
  border: 1px solid grey;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.text}90;
  }
`;

const MountainIcon = styled.svg`
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
`;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    padding: "2rem",
    borderRadius: "10px",
    border: "none",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

const Navbar: React.FC = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useRecoilState<UserInfoType>(userInfoState);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
    setLogoutModalOpen(false);
  };

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const openLogoutModal = () => setLogoutModalOpen(true);
  const closeLogoutModal = () => setLogoutModalOpen(false);

  return (
    <>
      <Nav>
        <Link to="/">
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
            Garela
          </Logo>
        </Link>

        <NavLinks>
          <StyledLink
            to="/home/board"
            active={location.pathname === "/home/board"}
          >
            Board
          </StyledLink>
          <StyledLink
            to="/home/template"
            active={location.pathname === "/home/template"}
          >
            Template
          </StyledLink>
          {isLoggedIn ? (
            <>
              <PostButton to="/home/newpost">
                <IconContainer>
                  <img src={PostIcon} alt="New Post Icon" />
                </IconContainer>
                New Post
              </PostButton>
              <ProfileButton onClick={toggleDropdown}>
                <ProfileImage
                  src={userInfo.photo ? ProfileImg : BasicProfileImg}
                  alt="Profile"
                />
                {isDropdownOpen && (
                  <DropdownMenu ref={dropdownRef}>
                    <DropdownHeader>
                      <HeaderImage
                        src={userInfo.photo ? ProfileImg : BasicProfileImg}
                        alt="Profile"
                      />
                      <HeaderName>{userInfo.name}</HeaderName>
                    </DropdownHeader>
                    <DropdownItem to="/profile">내 프로필</DropdownItem>
                    <DropdownItem to="/settings">설정</DropdownItem>
                    <DropdownButton onClick={openLogoutModal}>
                      로그아웃
                    </DropdownButton>
                  </DropdownMenu>
                )}
              </ProfileButton>
            </>
          ) : (
            <>
              <LoginButton to="/auth/login">Login</LoginButton>
              <RegisterButton to="/auth/register">Register</RegisterButton>
            </>
          )}
        </NavLinks>
      </Nav>
      <Modal
        isOpen={isLogoutModalOpen}
        onRequestClose={closeLogoutModal}
        style={customStyles}
      >
        <p>정말 로그아웃 하시겠습니까?</p>
        <ConfirmButton onClick={handleLogout}>확인</ConfirmButton>
        <CancelButton onClick={closeLogoutModal}>취소</CancelButton>
      </Modal>
    </>
  );
};

export default Navbar;
