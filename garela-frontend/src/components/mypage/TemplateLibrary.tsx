import React, { useState } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { myInfoState, UserInfoType } from "../../atom";
import axios from "axios";

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 1;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ddd;
  border-radius: 15px;
  background-color: ${(props) => props.theme.colors.surface};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  &:last-child {
    border-bottom: none;
  }
`;

const TemplateInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
`;

const TemplateDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TemplateTitle = styled.div`
  font-weight: bold;
  font-size: 24px;
`;

const TemplateCategory = styled.div`
  color: #666;
  font-size: 20px;
`;

const ToggleButton = styled.button<{ isRemoved: boolean }>`
  padding: 1rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: ${(props) => (props.isRemoved ? "white" : props.theme.colors.primary)};
  background-color: ${(props) => (props.isRemoved ? props.theme.colors.primary : "white")};
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
    color: white;
  }
`;

const NoTemplatesMessage = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #666;
`;

const TemplateLibrary: React.FC = () => {
  const [userInfo, setUserInfo] = useRecoilState<UserInfoType>(myInfoState);
  const [toggleState, setToggleState] = useState<{ [key: number]: boolean }>({});

  const toggleTemplate = async (templateId: number) => {
    const isRemoved = toggleState[templateId];

    try {
      await axios.put(
        `http://localhost:5000/templates/library/${templateId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setToggleState((prev) => ({
        ...prev,
        [templateId]: !isRemoved,
      }));
    } catch (error) {
      console.error("Failed to toggle template in library", error);
    }
  };

  if (!userInfo.templateLibrary || userInfo.templateLibrary.length === 0) {
    return <NoTemplatesMessage>템플릿 라이브러리에 템플릿이 없습니다</NoTemplatesMessage>;
  }

  return (
    <Container>
      <Content>
        <h2>내 Template Library</h2>
        <List>
          {userInfo.templateLibrary.map((template) => (
            <ListItem key={template.templateId}>
              <TemplateInfo>
                <ProfileImage
                  src={template.thumbnailImg || "default-thumbnail-img-url"}
                  alt="Thumbnail"
                />
                <TemplateDetails>
                  <TemplateTitle>{template.title}</TemplateTitle>
                  <TemplateCategory>#{template.category}</TemplateCategory>
                </TemplateDetails>
              </TemplateInfo>
              {!template.isMyTemplate && (
                <ToggleButton
                  isRemoved={toggleState[template.templateId] || false}
                  onClick={() => toggleTemplate(template.templateId)}
                >
                  {toggleState[template.templateId] ? "Add" : "Remove"}
                </ToggleButton>
              )}
            </ListItem>
          ))}
        </List>
      </Content>
    </Container>
  );
};

export default TemplateLibrary;
