import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { UserInfoType, myInfoState } from "../../atom";

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

const RegisterLink = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #333;
  a {
    color: #6a5acd;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProgressStep = styled.div`
  width: 50px;
  height: 5px;
  margin: 0 5px;
  background-color: #6a5acd;
  border-radius: 5px;
`;

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useRecoilState<UserInfoType>(myInfoState);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/users/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);

        getUserInfo();

        alert("로그인에 성공했습니다.");
        navigate("/");
      }
    } catch (error) {
      console.error("로그인에 실패했습니다.", error);
      alert("로그인에 실패했습니다.");
    }
  };

  const getUserInfo = async () => {
    const token = localStorage.getItem("token");
    try {
      const userResponse = await axios.get("http://localhost:5000/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (userResponse.status == 200) {
        setUserInfo(userResponse.data);
      }
    } catch (error) {
      console.error("유저 정보 조회에 실패했습니다.", error);
    }
  };



  return (
    <OuterContainer>
      <ProgressBar>
        <ProgressStep />
      </ProgressBar>
      <InnerContainer>
        <Box>
          <LeftSide>
            <Title>Garela</Title>
            <Subtitle>Best Community</Subtitle>
          </LeftSide>
          <RightSide>
            <Form onSubmit={handleSubmit}>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                required
                onChange={handleChange}
              />
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                required
                onChange={handleChange}
              />
              <Button type="submit">Login</Button>
            </Form>
            <RegisterLink>
              Don't you have an account?{" "}
              <Link to="/auth/register">Register</Link> Now!
            </RegisterLink>
          </RightSide>
        </Box>
      </InnerContainer>
    </OuterContainer>
  );
};

export default Login;
