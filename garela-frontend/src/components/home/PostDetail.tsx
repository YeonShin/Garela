import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatTimeAgo } from "../../Util";
import BasicProfileImg from "../../imgs/basicProfile.png";
import MoreButtonImg from "../../imgs/moreButton.png";
import ProfileImg from "../../imgs/profile.jpg";
import {
  CommentType,
  modeState,
  myInfoState,
  PostType,
  selectedPostIdState,
  UserInfoType,
} from "../../atom";
import { useRecoilState } from "recoil";
import { useLocation } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 74vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 20px;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
`;

const UserName = styled.div`
  font-weight: bold;
`;

const PostMeta = styled.div`
  color: #666;
`;

const Divider = styled.hr`
  margin: 15px 0;
  border: none;
  border-top: 1px solid #e5e5e5;
`;

const Title = styled.h1`
  margin: 0 0 0px 0;
`;

const ContentImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin-bottom: 20px;
  border-radius: 10px;
`;

const Content = styled.div`
  margin-bottom: 20px;
  img {
    width: 100%;
    max-height: 100%; // 원하는 최대 높이로 조절
    object-fit: cover;
    margin-bottom: 20px;
    border-radius: 10px;
  }
  iframe {
    width: 100%;
    height: 300px;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const FollowButton = styled.button<{ isFollowed: boolean }>`
  margin-left: 20px;
  padding: 10px 20px;
  background-color: ${(props) =>
    props.isFollowed ? "white" : props.theme.colors.primary};
  color: ${(props) =>
    props.isFollowed ? props.theme.colors.primary : "white"};
  border: ${(props) =>
    props.isFollowed ? `1px solid ${props.theme.colors.primary}` : "none"};
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.isFollowed ? "#f0f0f0" : `${props.theme.colors.primary}90`};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Action = styled.div<{ liked?: boolean }>`
  display: flex;
  align-items: center;
  color: ${(props) => (props.liked ? props.theme.colors.primary : "#666")};
  font-weight: ${(props) => (props.liked ? "bold" : "normal")};
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
  margin-right: 5px;
`;

const CommentInput = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-right: 10px;
`;

const SendButton = styled.div`
  font-size: 28px;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
`;

const CommentList = styled.div`
  margin: 10px 0;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
`;

const MoreButton = styled.img`
  cursor: pointer;
  width: 24px;
  height: 24px;
  position: absolute;
  right: 0;
  top: -20px;
`;

const DropdownContainer = styled.div`
  width: 100%;
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  overflow: hidden;
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostType | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCommentDropdown, setShowCommentDropdown] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [selectedComment, setSelectedComment] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useRecoilState<UserInfoType>(myInfoState);
  const [mode, setMode] = useRecoilState(modeState);
  const [selectedPostId, setSelectedPostId] = useRecoilState<number | undefined>(selectedPostIdState);


  const location = useLocation();
  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPost(response.data);
        setComments(response.data.commentList);
        setIsFollowed(response.data.followed);
        setIsLiked(response.data.liked);
      } catch (error) {
        console.error("Failed to fetch post detail", error);
      }
    };

    fetchPostDetail();
  }, [postId]);

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

  const toggleDropdown = (postId: number | null) => {
    setSelectedPost(postId);
    setShowDropdown((prev) => !prev);
  };

  const toggleCommentDropdown = (commentId: number | null) => {
    setSelectedComment(commentId);
    setShowCommentDropdown((prev) => !prev);
  };

  const handleFollow = async () => {
    if (!post) return;
    try {
      await axios.put(
        `http://localhost:5000/users/follow/${post.userId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsFollowed((prev) => !prev);
    } catch (error) {
      console.error("Failed to toggle follow status", error);
    }
  };

  const handleCopyClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("클립보드에 링크가 복사되었어요.");
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    try {
      await axios.put(`http://localhost:5000/posts/like/${post.postId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIsLiked((prev) => !prev);
      setPost((prev) =>
        prev ? { ...prev, likes: prev.likes + (isLiked ? -1 : 1) } : prev
      );
    } catch (error) {
      console.error("Failed to toggle like status", error);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!newComment) return;
    try {
      await axios.post(
        `http://localhost:5000/posts/comment/${postId}`,
        {
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNewComment("");
      const response = await axios.get(
        `http://localhost:5000/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments(response.data.commentList);
    } catch (error) {
      console.error("Failed to submit comment", error);
    }
  };

  const handleEditPost = () => {
    navigate(`/edit/post/${postId}`);
    setSelectedPostId(post?.postId)
    setMode("editPost");
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://localhost:5000/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/home/board");
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`http://localhost:5000/posts/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const response = await axios.get(
        `http://localhost:5000/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments(response.data.commentList);
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <Container>
      <Header>
        <ProfileImage
          src={post.userImg ? post.userImg : BasicProfileImg}
          alt="Profile"
        />
        <HeaderInfo>
          <UserName>{post.userName}</UserName>
          <PostMeta>
            {post.category} • {formatTimeAgo(new Date(post.createdAt))}
          </PostMeta>
        </HeaderInfo>
        {post.myPost && (
          <DropdownContainer>
            <MoreButton
              src={MoreButtonImg}
              onClick={() => toggleDropdown(post.userId)}
            />
            {showDropdown && selectedPost === post.userId && (
              <DropdownMenu>
                <DropdownItem onClick={handleEditPost}>수정</DropdownItem>
                <DropdownItem onClick={handleDeletePost}>삭제</DropdownItem>
              </DropdownMenu>
            )}
          </DropdownContainer>
        )}
      </Header>
      <Divider />
      <Title>{post.title}</Title>
      <Divider />
      <Content dangerouslySetInnerHTML={{ __html: post.content }} />
      <AuthorInfo>
        <ProfileImage
          src={post.userImg ? post.userImg : BasicProfileImg}
          alt="Profile"
        />
        <div>
          <UserName>{post.userName}</UserName>
          <div>{post.userInfo}</div>
        </div>
        {userInfo.userId !== post.userId && (
          <FollowButton isFollowed={isFollowed} onClick={handleFollow}>
            {isFollowed ? "Unfollow" : "Follow"}
          </FollowButton>
        )}
      </AuthorInfo>
      <Divider />
      <Actions>
        <Action onClick={() => {}}>
          <ActionIcon>💬</ActionIcon> {post.comments}
        </Action>
        <Action liked={isLiked} onClick={handleLike}>
          <ActionIcon>👍</ActionIcon> {post.likes}
        </Action>
        <Action>
          <ActionIcon>👁️</ActionIcon> {post.views}
        </Action>
        <Action onClick={() => handleCopyClipBoard(`http://localhost:3000/home/board/${post.postId}`)}>
          <ActionIcon>🔗</ActionIcon> Share
        </Action>
      </Actions>
      <CommentInput>
        <ProfileImage
          src={userInfo.profileImg ? userInfo.profileImg : BasicProfileImg}
          alt="Profile"
        />
        <Input
          type="text"
          placeholder="Write your comment"
          value={newComment}
          onChange={handleCommentChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleCommentSubmit();
            }
          }}
        />
        <SendButton onClick={handleCommentSubmit}>➤</SendButton>
      </CommentInput>
      <CommentList>
        {comments !== null &&
          comments.map((comment) => (
            <div key={comment.commentId}>
              <CommentItem>
                <ProfileImage
                  src={comment.userImg ? comment.userImg : BasicProfileImg}
                  alt="Profile"
                />
                <CommentContent>
                  <UserName>{comment.userName}</UserName>
                  <PostMeta>
                    {formatTimeAgo(new Date(comment.createdAt))}
                  </PostMeta>
                  <div>{comment.content}</div>
                </CommentContent>
                {comment.myComment === 1 && (
                  <DropdownContainer>
                    <MoreButton
                      src={MoreButtonImg}
                      onClick={() => toggleCommentDropdown(comment.commentId)}
                    />
                    {showCommentDropdown &&
                      selectedComment === comment.commentId && (
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() =>
                              handleDeleteComment(comment.commentId)
                            }
                          >
                            삭제
                          </DropdownItem>
                        </DropdownMenu>
                      )}
                  </DropdownContainer>
                )}
              </CommentItem>
              <Divider />
            </div>
          ))}
      </CommentList>
    </Container>
  );
};

export default PostDetail;
