import React from "react";
import styled from "styled-components";
import ProfileImg from "../../imgs/profile.jpg";
import DummyPosts from "./DummyPosts";
import { formatTimeAgo } from "../../Util";

const TrendingPosts = styled.div`
  margin-top: 20px;
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

const TrendingPostList: React.FC = () => {
  // 현재 날짜와 같은 날짜에 작성된 글 필터링
  const today = new Date();
  const filteredPosts = DummyPosts.filter((post) => {
    const postDate = new Date(post.createdAt);
    return (
      postDate.getFullYear() === today.getFullYear() &&
      postDate.getMonth() === today.getMonth() &&
      postDate.getDate() === today.getDate()
    );
  });

  // 좋아요 수 기준으로 정렬
  filteredPosts.sort((a, b) => b.likes - a.likes);

  return (
    <TrendingPosts>
      <TrendingTitle>🔥 Trending Post</TrendingTitle>
      <TrendingPostContainer>
        {filteredPosts.map((post, index) => (
          <TrendingPostItem key={post.postId}>
            <RankNumber>{index + 1}</RankNumber>
            <ProfileImage src={post.userImg || ProfileImg} alt="Profile" />
            <UserInfo>
              <Username>{post.username}</Username>
              <Category>#{post.category}</Category>
            </UserInfo>
            <Title>{post.title}</Title>
          </TrendingPostItem>
        ))}
      </TrendingPostContainer>
    </TrendingPosts>
  );
};

export default TrendingPostList;
