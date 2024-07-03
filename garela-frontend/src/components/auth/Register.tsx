import React, { useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { UserInfoType, userInfoState } from "../../atom";
import { useNavigate } from "react-router-dom";

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  background-color: ${(props) => props.theme.colors.background};
`;

const InnerContainer = styled.div`
  border: 2px solid ${(props) => props.theme.colors.primaryBorder};
  border-radius: 10px;
  padding: 2rem;
  background-color: ${(props) => props.theme.colors.surface};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55vw;
  background: ${(props) => props.theme.colors.surface};
  border-radius: 10px;
  overflow: hidden;
`;

const LeftSide = styled.div`
  flex: 1;
  background: #f1f1f1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RightSide = styled.div`
  flex: 2;
  padding: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #333;
`;

const Input = styled.input<{ isChecked: boolean | null; isError?: boolean }>`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid
    ${(props) =>
      props.isChecked === null ? "#ddd" : props.isChecked ? "green" : "red"};
  border-color: ${(props) => (props.isError ? "red" : "")};
  border-radius: 5px;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #6a5acd;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #483d8b;
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProgressStep = styled.div<{ active: boolean }>`
  width: 50px;
  height: 5px;
  margin: 0 5px;
  background-color: ${(props) => (props.active ? "#6a5acd" : "#ddd")};
  border-radius: 5px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.9rem;
`;

interface FormData {
  email: string;
  password: string;
  passwordCheck: string;
  name: string;
  information: string;
}

interface UserInfo {
  email: string;
  password: string;
  name: string;
  info : string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    passwordCheck: "",
    name: "",
    information: "",
  });
  const [isEmailChecked, setIsEmailChecked] = useState<boolean | null>(null);
  const [isPasswordError, setIsPasswordError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "email") {
      setIsEmailChecked(null);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
      alert("비밀번호는 영문과 숫자를 포함한 8자 이상이어야 합니다.");
      return;
    }
    if (formData.password !== formData.passwordCheck) {
      setIsPasswordError(true);
      return;
    } else {
      setIsPasswordError(false);
    }
    setIsPasswordError(false);
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/users/register",
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          info: formData.information
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      if (response.status === 200) {
        alert("회원가입이 완료되었습니다!");
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("회원가입 중 오류가 발생했습니다.", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }

  };

  const handleEmailCheck = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/email`, {
        headers: {
          Accept: "application/json",
        },
        params: {
          email: formData.email,
        },
      });

      if (response.data.result) {
        alert("이미 사용중인 이메일입니다!");
        setIsEmailChecked(false);
      } else {
        alert("사용가능한 이메일입니다.");
        setIsEmailChecked(true);
      }
    } catch (error) {
      console.error("There was an error checking the email!", error);
    }
  };

  return (
    <OuterContainer>
      <ProgressBar>
        <ProgressStep active={step === 1} />
        <ProgressStep active={step === 2} />
      </ProgressBar>
      <InnerContainer>
        <Box>
          <LeftSide>
            <Title>Garela</Title>
            <Subtitle>Best Community</Subtitle>
          </LeftSide>
          <RightSide>
            {step === 1 && (
              <Form onSubmit={handleNext}>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isChecked={isEmailChecked}
                  required
                />
                <Button type="button" onClick={handleEmailCheck}>
                  Check Email
                </Button>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isChecked={null}
                  isError={isPasswordError}
                  required
                />

                <Label>Check Password</Label>
                <Input
                  type="password"
                  name="passwordCheck"
                  value={formData.passwordCheck}
                  onChange={handleChange}
                  isChecked={null}
                  isError={isPasswordError}
                  required
                />
                {isPasswordError && (
                  <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
                )}
                <Button type="submit" disabled={!isEmailChecked}>
                  Next
                </Button>
              </Form>
            )}
            {step === 2 && (
              <Form onSubmit={handleSubmit}>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isChecked={null}
                  required
                />
                <Label>Information</Label>
                <Textarea
                  name="information"
                  value={formData.information}
                  onChange={handleChange}
                  required
                />
                <Button type="submit">Register</Button>
              </Form>
            )}
          </RightSide>
        </Box>
      </InnerContainer>
    </OuterContainer>
  );
};

export default Register;
