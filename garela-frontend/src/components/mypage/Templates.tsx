import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { myInfoState, UserInfoType } from "../../atom";
import BasicProfileImg from "../../imgs/basicProfile.png";
import templateImg from "../../imgs/postImg.jpg";
import { formatTimeAgo } from "../../Util";

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 55.2vh;
`;

const TemplateContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  padding: 0px;
`;

const TemplateItem = styled.div`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.surface};
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;

  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;
const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 20px;

`;

const TemplateImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const TemplateInfo = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const TemplateTitle = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0 0 10px 0;

  white-space: nowrap;
`;

const TemplateDetails = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
`;

const TemplateActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Action = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 15px;
  position: relative;
  &:hover {
    background: ${(props) => props.theme.colors.primary};
    opacity: 0.8;
    color: white;
  }
`;

const ActionIcon = styled.span`
  margin-right: 5px;
`;

const NoTemplatesMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
  color: #666;
`;

const Templates: React.FC = () => {
  const userInfo = useRecoilValue<UserInfoType>(myInfoState);

  if (userInfo.myTemplates === null) {
    return <NoTemplatesMessage>작성한 템플릿이 없습니다</NoTemplatesMessage>;
  }

  return (
    <BodyContainer>
      <TemplateContainer>
        {userInfo.myTemplates.map((template) => (
          <TemplateItem key={template.templateId}>
            <TemplateImage
              src={template.thumbnailImg ? template.thumbnailImg : templateImg}
              alt="Template"
            />
            <TemplateInfo>
              <div style={{ display: "flex", width: "100%" }}>
                <ProfileImage
                  src={template.userImg ? template.userImg : BasicProfileImg}
                  alt="Profile"
                />
                <div>
                  <TemplateTitle>{template.title}</TemplateTitle>
                  <TemplateDetails>
                    {template.category} • {formatTimeAgo(new Date(template.createdAt))}
                  </TemplateDetails>
                </div>
              </div>
              <TemplateActions>
                <Action>
                  <ActionIcon>👍</ActionIcon>
                  {template.likes}
                </Action>
                <Action>
                  <ActionIcon>👁️</ActionIcon>
                  {template.views}
                </Action>
              </TemplateActions>
            </TemplateInfo>
          </TemplateItem>
        ))}
      </TemplateContainer>
    </BodyContainer>
  );
};

export default Templates;
