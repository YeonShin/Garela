import React, { useState } from "react";
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

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
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

interface FormData {
  email: string;
  password: string;
  passwordCheck: string;
  phone: string;
  name: string;
  information: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    passwordCheck: "",
    phone: "",
    name: "",
    information: "",
  });
  const [userInfo, setUserInfo] = useRecoilState<UserInfoType>(userInfoState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 제출 로직 추가
    console.log("Form Data:", formData);
    setUserInfo({
      email: formData.email,
      photo: null,
      userId: 1,
      name: formData.name
    });

    localStorage.setItem("token", "test");
    navigate("/");
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
            {/* 이미지 추가 가능 */}
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
                  required
                />
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Label>Check Password</Label>
                <Input
                  type="password"
                  name="passwordCheck"
                  value={formData.passwordCheck}
                  onChange={handleChange}
                  required
                />
                <Label>Phone</Label>
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Button type="submit">Next</Button>
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
                  required
                />
                <Label>Information</Label>
                <Textarea
                  name="information"
                  value={formData.information}
                  onChange={handleChange}
                  required
                />
                <Button type="button" onClick={handleBack}>
                  Back
                </Button>
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
