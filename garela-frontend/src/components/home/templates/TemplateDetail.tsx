import styled from "styled-components";
import Modal from "react-modal";
import { TemplateType } from "../../../atom";

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  width: 80%;
  min-height: 70vh;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
    background: #5A67D8;
    opacity: 0.8;
  }
`;

const ActionIcon = styled.span`
  margin-right: 5px;
`;

interface TemplateDetailProps {
  isOpen: boolean;
  onRequestClose: () => void;
  template: TemplateType | null;
}

const TemplateDetail: React.FC<TemplateDetailProps> = ({ isOpen, onRequestClose, template }) => {
  if (!template) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '800px',
            maxHeight: '90vh',
            padding: '0',
            borderRadius: '10px',
            overflow: 'hidden',
            backgroundColor: 'white',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000, // Ensure overlay is below modal actions
          },
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{template.title}</ModalTitle>
          </ModalHeader>
          <ModalDivider />
          <ModalBody>
            <div dangerouslySetInnerHTML={{ __html: template.content }} />
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
