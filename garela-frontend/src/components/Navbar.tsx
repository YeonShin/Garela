import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import PostIcon from "../imgs/postBtn.png";
import logo from "../imgs/garela.png";
import ProfileImg from "../imgs/profile.jpg";
import TemplateImg from "../imgs/templateImg.png";
import BasicProfileImg from "../imgs/basicProfile.png";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  UserInfoType,
  modeState,
  myInfoState,
  postCategoryState,
  postEditorState,
  postFileState,
  postSummaryState,
  postTitleState,
  selectedPostIdState,
} from "../atom";
import TemplateLibrary from "./home/templates/TemplateLibrary"; // TemplateLibrary 추가
import axios from "axios";

Modal.setAppElement("#root");

const FixedNavbar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 998;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  padding-left: 80px;
  padding-right: 80px;
  background-color: ${(props) => props.theme.colors.surface};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e5e5e5;
  height: 80px;
  z-index: 998;
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

const PostButton = styled.div`
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
  position: relative;

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
    zIndex: 1000,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
};

const PostCompleteButton = styled.button`
  margin-left: 1rem;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}90;
  }
`;

const PostCancleButton = styled.button`
  margin-left: 1rem;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: black;
  background-color: white;
  border: 1px solid grey;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.text}90;
  }
`;

const TemplateBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  margin-left: 1rem;
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background-color: #ececec;
    background-opacity: 50%;
  }
`;

const TemplateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TemplateButton = styled.img`
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
`;

const TemplateText = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text};
`;

const LogoImg = styled.img`
  width: 40px;
  margin-right: 10px;
`;

const Navbar: React.FC = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isPostDropdownOpen, setPostDropdownOpen] = useState(false); // 상태 추가
  const [isTemplateDropdownOpen, setTemplateDropdownOpen] = useState(false); // 템플릿 드롭다운 상태 추가
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useRecoilState<UserInfoType>(myInfoState);
  const [mode, setMode] = useRecoilState(modeState);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null); // 선택된 템플릿 상태 추가

  const [editorState, setEditorState] = useRecoilState(postEditorState);
  const [title, setTitle] = useRecoilState(postTitleState);
  const [category, setCategory] = useRecoilState(postCategoryState);
  const [summary, setSummary] = useRecoilState(postSummaryState);
  const [file, setFile] = useRecoilState<File | null>(postFileState);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const postDropdownRef = useRef<HTMLDivElement>(null); // ref 추가
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPostId = useRecoilValue<number | undefined>(
    selectedPostIdState
  );

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
      if (
        postDropdownRef.current &&
        !postDropdownRef.current.contains(event.target as Node)
      ) {
        setPostDropdownOpen(false); // Post 드롭다운 닫기
      }
    };

    if (isDropdownOpen || isPostDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isPostDropdownOpen]);

  const defaultUserInfo: UserInfoType = {
    userId: 0,
    email: "",
    profileImg: null,
    name: "",
    info: "",
    myTemplates: [],
    myPosts: [],
    followingUsers: [],
    templateLibrary: [],
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("chatMessages")
    setIsLoggedIn(false);
    setUserInfo(defaultUserInfo);
    navigate("/");
    setLogoutModalOpen(false);
    document.body.style.overflow = "unset";
  };

  const handlePost = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", editorState);
    formData.append("category", category);
    formData.append("summary", summary);
    if (file) {
      formData.append("image", file);
    }
    console.log(editorState);

    try {
      const response = await axios.post(
        "http://localhost:5000/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        alert("게시글 등록 완료");
        navigate("/home/board");
        setMode("default");
        setTitle("");
        setCategory("");
        setSummary("");
        setFile(null);
        setEditorState("");
      }
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  const handleEditPost = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", editorState);
    formData.append("category", category);
    formData.append("summary", summary);
    if (file) {
      formData.append("image", file);
    }
    console.log(editorState);

    try {
      const response = await axios.put(
        `http://localhost:5000/posts/${selectedPostId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        alert("게시글 수정 완료");
        navigate("/home/board");
        setMode("default");
        setTitle("");
        setCategory("");
        setSummary("");
        setFile(null);
        setEditorState("");
      }
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  const handleTemplatePost = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", editorState);
    formData.append("category", category);
    if (file) {
      formData.append("image", file);
    }
    console.log(editorState);

    try {
      const response = await axios.post(
        "http://localhost:5000/templates",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        alert("템플릿 등록 완료");
        navigate("/home/template");
        setMode("default");
        setTitle("");
        setCategory("");
        setFile(null);
        setEditorState("");
      }
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const togglePostDropdown = () => setPostDropdownOpen(!isPostDropdownOpen); // 토글 함수 추가
  const toggleTemplateDropdown = () =>
    setTemplateDropdownOpen(!isTemplateDropdownOpen); // 템플릿 드롭다운 토글 함수 추가
  const openLogoutModal = () => {
    setLogoutModalOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeLogoutModal = () => {
    setLogoutModalOpen(false);
    document.body.style.overflow = "unset";
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      setEditorState(selectedTemplate.content); // 선택된 템플릿의 콘텐츠를 에디터에 적용
      setSelectedTemplate(null);
      setTemplateDropdownOpen(false); // 템플릿 드롭다운 닫기
    }
  };

  return (
    <FixedNavbar>
      <Nav>
        <Link
          to="/"
          onClick={() => {
            setMode("default");
            setMode("default");
            setTitle("");
            setCategory("");
            setSummary("");
            setFile(null);
            setEditorState("");
          }}
        >
          <Logo>
            <LogoImg src={logo}></LogoImg>
            Garela
          </Logo>
        </Link>
        {mode === "default" && (
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
                <PostButton onClick={togglePostDropdown} ref={postDropdownRef}>
                  <IconContainer>
                    <img src={PostIcon} alt="New Post Icon" />
                  </IconContainer>
                  New Post
                  {isPostDropdownOpen && (
                    <DropdownMenu>
                      <DropdownItem
                        to="/create/post"
                        onClick={() => setMode("createPost")}
                      >
                        📝 게시글 작성
                      </DropdownItem>
                      <DropdownItem
                        to="/create/template"
                        onClick={() => setMode("createTemplate")}
                      >
                        📑 템플릿 작성
                      </DropdownItem>
                    </DropdownMenu>
                  )}
                </PostButton>
                <ProfileButton onClick={toggleDropdown}>
                  <ProfileImage
                    src={
                      userInfo.profileImg
                        ? userInfo.profileImg
                        : BasicProfileImg
                    }
                    alt="Profile"
                  />
                  {isDropdownOpen && (
                    <DropdownMenu ref={dropdownRef}>
                      <DropdownHeader>
                        <HeaderImage
                          src={
                            userInfo.profileImg
                              ? userInfo.profileImg
                              : BasicProfileImg
                          }
                          alt="Profile"
                        />
                        <HeaderName>{userInfo.name}</HeaderName>
                      </DropdownHeader>
                      <DropdownItem to="/home/mypage/profile">
                        설정
                      </DropdownItem>
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
        )}
        {mode === "createPost" && (
          <NavLinks>
            <TemplateContainer>
              <TemplateBtnContainer onClick={toggleTemplateDropdown}>
                <TemplateButton src={TemplateImg} alt="Template Icon" />
                <TemplateText>Template</TemplateText>
              </TemplateBtnContainer>
              {isTemplateDropdownOpen && <TemplateLibrary />}
            </TemplateContainer>
            <PostCancleButton
              onClick={() => {
                if (window.confirm("작성중인 내용이 저장되지 않고 삭제됩니다. 계속하시겠습니까?")) {
                  setMode("default");
                  setTitle("");
                  setCategory("");
                  setSummary("");
                  setFile(null);
                  setEditorState("");
                  navigate("/home/board");
                } else {

                }
              }}
            >
              Cancel
            </PostCancleButton>
            <PostCompleteButton onClick={handlePost}>Post</PostCompleteButton>
          </NavLinks>
        )}
        {mode === "createTemplate" && (
          <NavLinks>
            <TemplateContainer>
              <TemplateBtnContainer onClick={toggleTemplateDropdown}>
                <TemplateButton src={TemplateImg} alt="Template Icon" />
                <TemplateText>Template</TemplateText>
              </TemplateBtnContainer>
              {isTemplateDropdownOpen && <TemplateLibrary />}
            </TemplateContainer>
            <PostCancleButton
              onClick={() => {
                if (window.confirm("작성중인 내용이 저장되지 않고 삭제됩니다. 계속 하시겠습니까?")) {
                  setMode("default");
                  setTitle("");
                  setCategory("");
                  setSummary("");
                  setFile(null);
                  setEditorState("");
                  navigate("/home/template");
                } else {

                };
              }}
            >
              Cancel
            </PostCancleButton>
            <PostCompleteButton onClick={handleTemplatePost}>
              Post
            </PostCompleteButton>
          </NavLinks>
        )}
        {mode === "editPost" && (
          <NavLinks>
            <TemplateContainer>
              <TemplateBtnContainer onClick={toggleTemplateDropdown}>
                <TemplateButton src={TemplateImg} alt="Template Icon" />
                <TemplateText>Template</TemplateText>
              </TemplateBtnContainer>
              {isTemplateDropdownOpen && <TemplateLibrary />}
            </TemplateContainer>
            <PostCancleButton
              onClick={() => {
                if (window.confirm("작성중인 내용이 저장되지 않고 삭제됩니다. 계속하시겠습니까?")) {
                  setMode("default");
                  setTitle("");
                  setCategory("");
                  setSummary("");
                  setFile(null);
                  setEditorState("");
                  navigate("/home/board");
                } else {
                  
                }
              }}
            >
              Cancel
            </PostCancleButton>
            <PostCompleteButton onClick={handleEditPost}>
              Post
            </PostCompleteButton>
          </NavLinks>
        )}
        {mode === "editTemplate" && (
          <NavLinks>
            <TemplateContainer>
              <TemplateBtnContainer onClick={toggleTemplateDropdown}>
                <TemplateButton src={TemplateImg} alt="Template Icon" />
                <TemplateText>Template</TemplateText>
              </TemplateBtnContainer>
              {isTemplateDropdownOpen && <TemplateLibrary />}
            </TemplateContainer>
            <PostCancleButton
              onClick={() => {
                if (window.confirm("작성중인 내용이 저장되지 않고 삭제됩니다. 계속 하시겠습니까?")) {
                  setMode("default");
                  setTitle("");
                  setCategory("");
                  setSummary("");
                  setFile(null);
                  setEditorState("");
                  navigate("/home/template");
                } else {

                };


              }}
            >
              Cancel
            </PostCancleButton>
            <PostCompleteButton onClick={handleTemplatePost}>
              Post
            </PostCompleteButton>
          </NavLinks>
        )}
      </Nav>
      <Modal
        isOpen={isLogoutModalOpen}
        onRequestClose={closeLogoutModal}
        style={customStyles}
      >
        <p style={{ textAlign: "center" }}>정말 로그아웃 하시겠습니까?</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "30px",
          }}
        >
          <ConfirmButton onClick={handleLogout}>확인</ConfirmButton>
          <CancelButton onClick={closeLogoutModal}>취소</CancelButton>
        </div>
      </Modal>
    </FixedNavbar>
  );
};

export default Navbar;
