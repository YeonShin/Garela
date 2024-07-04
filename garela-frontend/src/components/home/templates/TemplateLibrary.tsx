// TemplateLibrary component
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { applyTemplateIdState, myInfoState, UserInfoType } from '../../../atom';
import noImage from "../../../imgs/noResult.jpg";
import axios from 'axios';

const DropdownMenuTemplate = styled.div`
  position: absolute;
  top: 70px;
  right: 70px;
  width: 300px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.div<{ active: boolean }>`
  flex: 1;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  border-bottom: ${(props) => (props.active ? '2px solid #007bff' : 'none')};
`;

const TemplateList = styled.div`
  min-height: 400px;
  max-height: 400px;
  overflow-y: auto;
`;

const TemplateItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const TemplateImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 5px;
`;

const TemplateDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TemplateCategory = styled.div`
  color: #007bff;
  font-size: 0.9rem;
`;

const TemplateTitle = styled.div`
  font-weight: bold;
`;

const TemplateLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Subscribed' | 'MyTemplate'>('Subscribed');
  const [userInfo, setUserInfo] = useRecoilState<UserInfoType>(myInfoState);
  const [applyTemplateId, setApplyTemplateId] = useRecoilState<number | undefined>(applyTemplateIdState);

  useEffect(() => {
    getUserInfo();
  }, []);

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
    <DropdownMenuTemplate>
      <Tabs>
        <Tab
          active={activeTab === "Subscribed"}
          onClick={() => setActiveTab("Subscribed")}
        >
          Template Library
        </Tab>
      </Tabs>
      <TemplateList>
        {userInfo.templateLibrary && userInfo.templateLibrary.map((template) => (
          <TemplateItem key={template.templateId} onClick={() => {
            if (window.confirm('Do you want to apply this template?')) {
              setApplyTemplateId(template.templateId);
            }
          }}>
            <TemplateImage src={template.thumbnailImg ? template.thumbnailImg : noImage} alt="Template" />
            <TemplateDetails>
              <TemplateCategory>{template.category}</TemplateCategory>
              <TemplateTitle>{template.title}</TemplateTitle>
            </TemplateDetails>
          </TemplateItem>
        ))}
      </TemplateList>
    </DropdownMenuTemplate>
  );
};

export default TemplateLibrary;