import styled from "styled-components";
import Modal from "react-modal";
import { TemplateType } from "../../../atom";
import BasicProfileImg from "../../../imgs/basicProfile.png";
import DummyTemplateDetail from "./DummyTemplateDetail";
import { formatTimeAgo } from "../../../Util";

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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
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
  width: 600px;
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

const AddTemplateButton = styled.button<{ isAdd: boolean }>`
  margin-left: 20px;
  padding: 10px 20px;
  background-color: ${(props) => (props.isAdd ? "white" : "#5A67D8")};
  color: ${(props) => (props.isAdd ? "#5A67D8" : "white")};
  border: ${(props) => (props.isAdd ? `1px solid #5A67D8` : "none")};
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isAdd ? "#f0f0f0" : "#4c51bf")};
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
  z-index: 1001; /* 높은 z-index 설정 */
`;

const ModalAction = styled.div`
  display: flex;
  align-items: center;
  color: white;
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

const Content = styled.div`


    h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  pre {
    background: #f5f2f0;
    padding: 10px;
    border-radius: 4px;
    overflow: auto;
  }

  blockquote {
    border-left: 4px solid #5A67D8;
    margin: 0;
    padding: 10px 20px;
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
}

const TemplateDetail: React.FC<TemplateDetailProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const template = DummyTemplateDetail;

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
            zIndex: 1000, // Ensure overlay is below modal actions
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
                  <UserName>{template.username}</UserName>
                  <PostMeta>
                    {template.category} •{" "}
                    {formatTimeAgo(new Date(template.createdAt))}
                  </PostMeta>
                </HeaderInfo>
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
          <ModalAction>
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
          <AddTemplateButton isAdd={false}>Add My Template</AddTemplateButton>
        </ModalActions>
      )}
    </>
  );
};

export default TemplateDetail;
