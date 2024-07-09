import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProfileImg from "../../../imgs/profile.jpg";
import DummyTemplates from "./DummyTemplate";import { TemplateListType } from "../../../atom";
import axios from "axios";
import BasicProfileImg from "../../../imgs/basicProfile.png";
import { useNavigate } from "react-router-dom";
import NoResultImg from "../../../imgs/noResult.png";

const TrendingPosts = styled.div`
  margin-top: 20px;
  min-height: 40vh;
`;

const TrendingPostContainer = styled.div`
  border-radius: 15px;
  background: ${(props) => props.theme.colors.surface};
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TrendingPostItem = styled.div`
  display: grid;
  grid-template-columns: auto auto 4fr; /* Define three columns */
  grid-template-rows: auto auto; /* Define two rows */
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
  }
`;

const RankNumber = styled.div`
  grid-column: 1; /* Position in the first column */
  font-size: 20px;
  font-weight: bold;
  margin-right: 5px;
  color: ${(props) => props.theme.colors.primary};
`;

const ProfileImage = styled.img`
  grid-column: 2; /* Position in the second column */
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  grid-column: 3; /* Position in the second column */
  display: flex;
  align-items: center;
`;

const Username = styled.div`
  font-weight: bold;
  margin-right: 5px;
`;

const Category = styled.div`
  color: #666;
  margin-left: 5px; /* Adjust margin for styling */
`;

const Title = styled.div`
  grid-column: span 3; /* Position in the third column */
  grid-row: 2; /* Span across two rows */
  font-weight: bold;
  margin-top: 5px;
  margin-left: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => props.theme.colors.text};
`;

const TrendingTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ThumbnailImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  margin-right: 10px;
`;

const NoResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-contents: center;
`

const NoResultImage = styled.img`
  width: 150px;
`

const TrendingTemplateList: React.FC = () => {
  // 현재 날짜와 같은 날짜에 작성된 글 필터링
  const [templates, setTemplates] = useState<TemplateListType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/templates", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const filteredTemplates = response.data
          .filter((template: TemplateListType) => {
            const postDate = new Date(template.createdAt);
            const currentDate = new Date();
            const timeDiff = Math.abs(currentDate.getTime() - postDate.getTime());
            const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            return diffDays <= 3;
          })
          .sort((a: TemplateListType, b: TemplateListType) => b.likes - a.likes)
          .slice(0, 3);

        setTemplates(filteredTemplates);
      } catch (error) {
        console.error("Failed to fetch top posts", error);
      }
    };

    fetchTopPosts();
  }, []);



  return (
    <TrendingPosts>
      <TrendingTitle>🔥 Trending Template</TrendingTitle>
      <TrendingPostContainer>
        {templates.length === 0 && (
          <NoResultContainer>
            <NoResultImage src={NoResultImg} />
            최근 3일 인기 템플릿이 없습니다
          </NoResultContainer>
        )}
        {templates.map((template:TemplateListType, index: number) => (
          <TrendingPostItem key={template.templateId}>
            <RankNumber>{index + 1}</RankNumber>
            <ProfileImage src={template.userImg || BasicProfileImg} alt="Profile" />
            <UserInfo>
              <Category>#{template.category}</Category>
            </UserInfo>
            <Title>{template.title}</Title>
          </TrendingPostItem>
        ))}
      </TrendingPostContainer>
    </TrendingPosts>
  );
};

export default TrendingTemplateList;
