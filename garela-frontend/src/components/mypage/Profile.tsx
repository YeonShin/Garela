import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { myInfoState, UserInfoType } from "../../atom";
import axios from "axios";

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 12rem 0 12rem;
  margin-bottom: 8.6rem;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 1.2rem;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Label = styled.label`
  align-self: flex-start;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 1rem;
  width: 100%;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  width: 100%;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: #483d8b;
  }
`;

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useRecoilState<UserInfoType>(myInfoState);
  const [profile, setProfile] = useState({
    name: userInfo.name,
    info: userInfo.info,
    profileImg: userInfo.profileImg || "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getUserInfo();
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profileImg: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("info", profile.info);
    if (fileInputRef.current && fileInputRef.current.files) {
      formData.append("photo", fileInputRef.current.files[0]);
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/users",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status == 200) {
        getUserInfo();
        alert("유저 정보 수정에 성공했습니다.");
      }
    } catch (error) {
      console.error("프로필 업데이트 실패", error);
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
    <ProfileContainer>
      <ProfileImage
        src={profile.profileImg || "default-profile-img-url"}
        alt="Profile"
        onClick={handleImageClick}
      />
      <HiddenInput
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
      />
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        type="text"
        name="name"
        value={profile.name}
        onChange={handleChange}
        placeholder="이름"
      />
      <Label>Information</Label>
      <Textarea
        name="info"
        value={profile.info}
        onChange={handleChange}
        placeholder="자기소개"
      />
      <Button onClick={handleSubmit}>프로필 수정</Button>
    </ProfileContainer>
  );
};

export default Profile;
