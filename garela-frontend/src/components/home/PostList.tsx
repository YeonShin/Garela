import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ProfileImg from "../../imgs/profile.jpg";
import BasicProfileImg from "../../imgs/basicProfile.png";
import postImg from "../../imgs/postImg.jpg";
import { formatTimeAgo } from "../../Util";
import { useRecoilState, useRecoilValue } from "recoil";
import noImage from "../../imgs/noResult.jpg";

import {
  filterState,
  myInfoState,
  PostListType,
  selectedCategoryState,
  UserInfoType,
} from "../../atom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 612px;
`;

const PostCreationForm = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 15px;
  padding-bottom: 15px;
  border: none;
  outline: none;
  background: ${(props) => props.theme.colors.surface};
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const PostFilters = styled.div`
  display: flex;
  gap: 20px;
  margin-left: 20px;
  margin-bottom: 0px;
`;

interface FilterLinkProps {
  active: boolean;
}

const FilterLink = styled.a<FilterLinkProps>`
  cursor: pointer;
  color: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.text};
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const Divider = styled.hr`
  margin: 10px 10px;
  border: none;
  border-top: 1px solid #e5e5e5;
`;

const PostItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const PostContent = styled.div`
  display: flex;
  background: ${(props) => props.theme.colors.surface};
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const PostImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin-right: 20px;
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled.h3`
  margin: 0 0 10px 0;
`;

const PostText = styled.p`
  margin: 0 0 10px 0;
  color: #666;
`;

const PostActions = styled.div`
  display: flex;
  width: 28vw;
  align-items: center;
  justify-content: space-between;
`;

const Action = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  cursor: pointer;
  padding: 5px;
  padding-left: 15px;
  padding-right: 20px;
  border-radius: 15px;
  &:hover {
    background: ${(props) => props.theme.colors.primary};
    opacity: 0.8;
    color: white;
  }
`;

const ActionIcon = styled.span`
  margin-right: 10px;
`;

const PostList: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useRecoilState(filterState);
  const selectedCategory = useRecoilValue(selectedCategoryState);
  const [posts, setPosts] = useState<PostListType[]>([]);
  const [userInfo, setUserInfo] = useRecoilState<UserInfoType>(myInfoState);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts
    .filter((post) => {
      if (filter === "All") return true;
      if (filter === "Subscribed") return post.subscribed;
      if (filter === "Trending") {
        const today = new Date();
        const postDate = new Date(post.createdAt);
        const diffTime = Math.abs(today.getTime() - postDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      return false;
    })
    .sort((a, b) => {
      if (filter === "Trending") {
        return b.likes - a.likes;
      }
      return 0;
    })
    .filter((post) => {
      if (selectedCategory === "All") return true;
      return post.category === selectedCategory;
    });

  return (
    <PostContainer>
      <PostCreationForm>
        <ProfileImage
          src={userInfo.profileImg ? userInfo.profileImg : BasicProfileImg}
          alt="Profile"
        />
        <Input
          type="text"
          placeholder="Write your post"
          onClick={() => navigate("/create/post")}
        />
      </PostCreationForm>
      <PostFilters>
        <FilterLink active={filter === "All"} onClick={() => setFilter("All")}>
          All
        </FilterLink>
        <FilterLink
          active={filter === "Subscribed"}
          onClick={() => setFilter("Subscribed")}
        >
          Subscribed
        </FilterLink>
        <FilterLink
          active={filter === "Trending"}
          onClick={() => setFilter("Trending")}
        >
          Trending
        </FilterLink>
      </PostFilters>
      <Divider />
      {filteredPosts.length === 0 && (
        <div style={{ minHeight: "60vh" }}>작성된 게시글이 없습니다</div>
      )}
      {filteredPosts.map((post) => (
        <PostItem
          key={post.postId}
          onClick={() => navigate(`/home/board/${post.postId}`)}
        >
          <PostHeader>
            <ProfileImage
              src={post.userImg ? post.userImg : BasicProfileImg}
              alt="Profile"
            />
            <div>
              <div>{post.userName}</div>
              <div>
                {post.category} • {formatTimeAgo(new Date(post.createdAt))}
              </div>
            </div>
          </PostHeader>
          <PostContent>
            <PostImage
              src={post.thumbnailImg ? post.thumbnailImg : noImage}
              alt="Post"
            />
            <PostInfo>
              <PostTitle>{post.title}</PostTitle>
              <PostText>{post.summary}</PostText>
              <PostActions>
                <Action>
                  <ActionIcon>💬</ActionIcon>
                  {post.comments}
                </Action>
                <Action>
                  <ActionIcon>👍</ActionIcon>
                  {post.likes}
                </Action>
                <Action>
                  <ActionIcon>👁️</ActionIcon>
                  {post.views}
                </Action>
                <Action>
                  <ActionIcon>🔗</ActionIcon>
                  Share
                </Action>
              </PostActions>
            </PostInfo>
          </PostContent>
        </PostItem>
      ))}
    </PostContainer>
  );
};

export default PostList;
