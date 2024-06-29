import Modal from "react-modal";
import styled from "styled-components";
import { FaGoogle } from "react-icons/fa";

Modal.setAppElement("#root");

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

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.mutedText};
  margin-bottom: 2rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem;
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

  svg {
    margin-right: 0.5rem;
  }
`;

interface LoginModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onRequestClose }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <Title>로그인</Title>
      <Description>
        우리 웹사이트에 오신 것을 환영합니다. 구글 아이디로 로그인하세요.
      </Description>
      <Button>
        <FaGoogle />
        구글 아이디로 로그인
      </Button>
    </Modal>
  );
};

export default LoginModal;
