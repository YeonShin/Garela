import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProfileImg from "../../imgs/profile.jpg";
import { formatTimeAgo } from "../../Util";
import axios from "axios";
import { PostListType } from "../../atom";
import BasicProfileImg from "../../imgs/basicProfile.png";
import { useNavigate } from "react-router-dom";
import NoResultImg from "../../imgs/noResult.png";

const TrendingPosts = styled.div`
  margin-top: 20px;
  min-height: 40vh;
`;

const TrendingPostContainer = styled.div`
  border-radius: 15px;
  background: ${(props) => props.theme.colors.surface};
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-height: 20vh;
`;

const TrendingPostItem = styled.div`
  display: grid;
  grid-template-columns: auto auto 4fr;
  grid-template-rows: auto auto;
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
  grid-column: 1;
  font-size: 20px;
  font-weight: bold;
  margin-right: 5px;
  color: ${(props) => props.theme.colors.primary};
`;

const ProfileImage = styled.img`
  grid-column: 2;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  grid-column: 3;
  display: flex;
  align-items: center;
`;

const Username = styled.div`
  font-weight: bold;
  margin-right: 5px;
`;

const Category = styled.div`
  color: #666;
  margin-left: 5px;
`;

const Title = styled.div`
  grid-column: span 3;
  grid-row: 2;
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

const NoResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-contents: center;
`

const NoResultImage = styled.img`
  width: 150px;
`

const TrendingPostList: React.FC = () => {
  const today = new Date();
  const [posts, setPosts] = useState<PostListType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const filteredPosts = response.data
          .filter((post: PostListType) => {
            const postDate = new Date(post.createdAt);
            const currentDate = new Date();
            const timeDiff = Math.abs(currentDate.getTime() - postDate.getTime());
            const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            return diffDays <= 3;
          })
          .sort((a: PostListType, b: PostListType) => b.likes - a.likes)
          .slice(0, 3);

        setPosts(filteredPosts);
      } catch (error) {
        console.error("Failed to fetch top posts", error);
      }
    };

    fetchTopPosts();
  }, []);

  return (
    <TrendingPosts>
      <TrendingTitle>🔥 Trending Post</TrendingTitle>
      <TrendingPostContainer>
        {posts.length === 0 && (
          <NoResultContainer>
            <NoResultImage src={NoResultImg}/>
            최근 3일 인기 게시글이 없습니다
          </NoResultContainer>
        )}
        {posts.length > 0 && posts.map((post, index) => (
          <TrendingPostItem key={post.postId} onClick={() => navigate(`/home/board/${post.postId}`)}>
            <RankNumber>{index + 1}</RankNumber>
            <ProfileImage src={post.userImg || BasicProfileImg} alt="Profile" />
            <UserInfo>
              <Username>{post.userName}</Username>
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
