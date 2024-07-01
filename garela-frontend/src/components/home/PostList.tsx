import React, { useState } from "react";
import styled from "styled-components";
import ProfileImg from "../../imgs/profile.jpg";
import PostImg from "../../imgs/postImg.jpg";
import DummyPosts, { PostType } from "./DummyPosts";
import BasicProfileImg from "../../imgs/basicProfile.png";
import postImg from "../../imgs/postImg.jpg";
import { formatTimeAgo } from "../../Util";

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  align-items: center;
  justify-content: space-between;
`;

const Action = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  cursor: pointer;
`;

const ActionIcon = styled.span`
  margin-right: 10px;
`;

interface PostListProps {
  selectedCategory: string;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

const PostList: React.FC<PostListProps> = ({
  selectedCategory,
  filter,
  setFilter,
}) => {
  const filteredPosts = DummyPosts.filter((post) => {
    if (filter === "All") return true;
    if (filter === "Subscribed") return post.subscribed;
    if (filter === "Trending") {
      return post.likes > 5;
    }
    return false;
  }).filter((post) => {
    if (selectedCategory === "All") return true;
    return post.category === selectedCategory;
  });

  return (
    <PostContainer>
      <PostCreationForm>
        <ProfileImage src={ProfileImg} alt="Profile" />
        <Input type="text" placeholder="Write your post" disabled />
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

      {filteredPosts.map((post) => (
        <PostItem key={post.postId}>
          <PostHeader>
            <ProfileImage
              src={post.userImg ? post.userImg : BasicProfileImg}
              alt="Profile"
            />
            <div>
              <div>{post.username}</div>
              <div>
                {post.category} • {formatTimeAgo(new Date(post.createdAt))}
              </div>
            </div>
          </PostHeader>
          <PostContent>
            <PostImage
              src={post.thumbnailImg ? post.thumbnailImg : postImg}
              alt="Post"
            />
            <PostInfo>
              <PostTitle>{post.title}</PostTitle>
              <PostText>{post.content}</PostText>
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
