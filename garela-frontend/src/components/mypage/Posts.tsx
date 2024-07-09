import React, { useEffect } from "react";
import styled from "styled-components";
import BasicProfileImg from "../../imgs/basicProfile.png";
import postImg from "../../imgs/postImg.jpg";
import NoResult from "../../imgs/noResult.png";
import { formatTimeAgo } from "../../Util";
import { useRecoilState, useRecoilValue } from "recoil";
import { myInfoState, UserInfoType } from "../../atom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 580px;
  padding-right: 2rem;
  padding-top: 1rem;
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

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 20px;
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
  margin-left: 20px;
  margin-right: 40px;
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
  width: 47vw;
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

const NoPostsMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 2rem;
  color: #666;
`;

const NoResultImage = styled.img`
  width: 200px;
`
const Posts: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useRecoilState<UserInfoType>(myInfoState);


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


  useEffect(() => {
    getUserInfo();
  }, []);

  if (userInfo.myPosts === null) {
    return <NoPostsMessage><NoResultImage src={NoResult} />작성한 게시글이 없습니다</NoPostsMessage>;
  }

  return (
    <PostContainer>
      {userInfo.myPosts.map((post) => (
        <PostItem key={post.postId} onClick={() => navigate(`/home/board/${post.postId}`)}>
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
              src={post.thumbnailImg ? post.thumbnailImg : postImg}
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

export default Posts;
