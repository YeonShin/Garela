import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { TemplateType } from "../../../atom";
import BasicProfileImg from "../../../imgs/basicProfile.png";
import { formatTimeAgo } from "../../../Util";
import axios from "axios";
import MoreBtn from "../../../imgs/moreButton.png";
import { useRecoilValue } from "recoil";
import { myInfoState } from "../../../atom";

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  width: 100%;
  min-height: 70vh;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0px;
  justify-content: space-between; /* Ensure items are spaced out */
`;

const ModalUserInfo = styled.div``;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 20px;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 570px;
`;

const UserName = styled.div`
  font-weight: bold;
`;

const PostMeta = styled.div`
  color: #666;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: black;
  margin: 0;
`;

const ModalDivider = styled.hr`
  margin: 15px 0;
  border: none;
  border-top: 1px solid #e5e5e5;
`;

const FollowButton = styled.button<{ isFollowed: boolean }>`
  padding: 10px 20px;
  background-color: ${(props) =>
    props.isFollowed ? "white" : props.theme.colors.primary};
  color: ${(props) =>
    props.isFollowed ? props.theme.colors.primary : "white"};
  border: ${(props) =>
    props.isFollowed ? `1px solid ${props.theme.colors.primary}` : "none"};
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.isFollowed ? "#f0f0f0" : `${props.theme.colors.primary}90`};
  }
`;

const AddTemplateButton = styled.button<{ isAdd: boolean }>`
  margin-left: 20px;
  padding: 10px 20px;
  background-color: ${(props) => (props.isAdd ? "#6D6D6D" : "#5A67D8")};
  color: ${(props) => (props.isAdd ? "white" : "white")};
  border: ${(props) => (props.isAdd ? `1px solid #5A67D8` : "none")};
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isAdd ? "#6D6D6D" : "#4c51bf")};
  }
`;

const ModalBody = styled.div`
  margin-bottom: 20px;
  color: black;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  max-width: 800px;
  background-color: #404040;
  padding: 10px 20px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 10px;
  z-index: 1001;
`;

const ModalAction = styled.div<{ liked?: boolean }>`
  display: flex;
  align-items: center;
  color: ${(props) => (props.liked ? "#8890D8": "white")};
  font-weight: ${(props) => (props.liked ? "bold" : "normal")};
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 15px;
  &:hover {
    background: #5a67d8;
    opacity: 0.8;
  }
`;

const ActionIcon = styled.span`
  margin-right: 5px;
`;

const MoreButton = styled.img`
  cursor: pointer;
  width: 24px;
  height: 24px;
`;

const DropdownContainer = styled.div`
  width: 30px;
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  width: 75px;
  top: 30px;
  right: 0px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  overflow: hidden;
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const Content = styled.div`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
  }

  pre {
    background: #f5f2f0;
    padding: 10px;
    border-radius: 4px;
    overflow: auto;
  }

  blockquote {
    border-left: 4px solid #5a67d8;
    margin: 0;
    padding: 10px 20px;
  }

  img {
    width: 100%;
    max-height: 100%; // 원하는 최대 높이로 조절
    object-fit: cover;
    margin-bottom: 20px;
    border-radius: 10px;
  }
  iframe {
    width: 100%;
    height: 300px;
  }

  a {
    color: #007bff;
    text-decoration: underline;
  }

  .ql-align-center {
    text-align: center;
  }

  .ql-align-right {
    text-align: right;
  }

  .ql-align-justify {
    text-align: justify;
  }

  .ql-indent-1 {
    padding-left: 3em;
  }

  .ql-indent-2 {
    padding-left: 6em;
  }

  .ql-indent-3 {
    padding-left: 9em;
  }

  .ql-indent-4 {
    padding-left: 12em;
  }

  .ql-video {
    width: 100%;
    height: 400px;
  }

  .ql-font-serif {
    font-family: "Georgia", "Times New Roman", serif;
  }

  .ql-font-monospace {
    font-family: "Monaco", "Courier New", monospace;
  }

  .ql-size-small {
    font-size: 0.75em;
  }

  .ql-size-large {
    font-size: 1.5em;
  }

  .ql-size-huge {
    font-size: 2.5em;
  }
`;

interface TemplateDetailProps {
  isOpen: boolean;
  onRequestClose: () => void;
  templateId: number;
}

const TemplateDetail: React.FC<TemplateDetailProps> = ({
  isOpen,
  onRequestClose,
  templateId,
}) => {
  const [template, setTemplate] = useState<TemplateType | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const userInfo = useRecoilValue(myInfoState);

  useEffect(() => {
    const fetchTemplateDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/templates/${templateId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTemplate(response.data);
        setIsFollowed(response.data.followed);
        setIsLiked(response.data.liked);
        setIsAdded(response.data.added);
      } catch (error) {
        console.error("Failed to fetch template detail", error);
      }
    };

    if (templateId) {
      fetchTemplateDetail();
    }
  }, [templateId]);

  if (!template) return <div>Loading...</div>;

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleEditTemplate = () => {
    // Add edit functionality here
  };

  const handleDeleteTemplate = () => {
    // Add delete functionality here
  };

  const handleFollowToggle = async () => {
    // Add follow/unfollow functionality here
    try {
      const response = await axios.put(
        `http://localhost:5000/users/follow/${template.userId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsFollowed((prev) => !prev);
    } catch (error) {
      console.error("Failed to toggle follow status", error);
    }
  };

  const handleAddTemplate = async () => {
    // Add add/remove functionality here
    try {
      const response = await axios.put(`http://localhost:5000/templates/library/${template.templateId}`, null, {
        headers : {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setIsAdded((prev) => !prev);
    } catch (error) {
      console.error("Failed to toggle add status", error);
    }
  };

  const handleLikeToggle = async () => {
    if (!template) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/templates/like/${template.templateId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsLiked((prev) => !prev);
      setTemplate((prev) =>
        prev ? { ...prev, likes: prev.likes + (isLiked ? -1 : 1) } : prev
      );
    } catch (error) {
      console.error("Failed to toggle like status", error);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={{
          content: {
            top: "45%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "800px",
            maxHeight: "80vh",
            padding: "0",
            borderRadius: "10px",
            overflow: "hidden",
            backgroundColor: "white",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalUserInfo>
              <ModalTitle>{template.title}</ModalTitle>
              <div style={{ display: "flex", marginTop: "20px" }}>
                <ProfileImage
                  src={template.userImg ? template.userImg : BasicProfileImg}
                  alt="Profile"
                />
                <HeaderInfo>
                  <UserName>{template.userName}</UserName>
                  <PostMeta>
                    {template.category} •{" "}
                    {formatTimeAgo(new Date(template.createdAt))}
                  </PostMeta>
                </HeaderInfo>
                {template.myTemplate ? (
                  <DropdownContainer>
                    <MoreButton src={MoreBtn} onClick={toggleDropdown} />
                    {showDropdown && (
                      <DropdownMenu>
                        <DropdownItem onClick={handleEditTemplate}>
                          수정
                        </DropdownItem>
                        <DropdownItem onClick={handleDeleteTemplate}>
                          삭제
                        </DropdownItem>
                      </DropdownMenu>
                    )}
                  </DropdownContainer>
                ) : (
                  <FollowButton
                    isFollowed={isFollowed}
                    onClick={handleFollowToggle}
                  >
                    {isFollowed ? "Unfollow" : "Follow"}
                  </FollowButton>
                )}
              </div>
            </ModalUserInfo>
          </ModalHeader>
          <ModalDivider />
          <ModalBody>
            <Content dangerouslySetInnerHTML={{ __html: template.content }} />
          </ModalBody>
        </ModalContent>
      </Modal>
      {isOpen && (
        <ModalActions>
          <ModalAction liked={isLiked} onClick={() => handleLikeToggle()}>
            <ActionIcon>👍</ActionIcon>
            {template.likes}
          </ModalAction>
          <ModalAction>
            <ActionIcon>👁️</ActionIcon>
            {template.views}
          </ModalAction>
          <ModalAction>
            <ActionIcon>🔗</ActionIcon>
            Share
          </ModalAction>
          {!template.myTemplate && (
            <AddTemplateButton
              isAdd={isAdded}
              onClick={handleAddTemplate}
            >
              {isAdded ? "Unsubscribe" : "Subscribe"}
            </AddTemplateButton>
          )}
        </ModalActions>
      )}
    </>
  );
};

export default TemplateDetail;
