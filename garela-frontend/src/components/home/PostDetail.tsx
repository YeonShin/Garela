import styled from "styled-components";
import DummyPostDetail, { CommentType } from "./DummyPostDetail";
import { formatTimeAgo } from "../../Util";
import BasicProfileImg from "../../imgs/basicProfile.png";
import ProfileImg from "../../imgs/profile.jpg";
import PostImg from "../../imgs/postImg.jpg";
import { useRef, useState } from "react";
import MoreButtonImg from "../../imgs/moreButton.png";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
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

    h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  pre {
    background: #f5f2f0;
    padding: 10px;
    border-radius: 4px;
    overflow: auto;
  }

  blockquote {
    border-left: 4px solid #5A67D8;
    margin: 0;
    padding: 10px 20px;
  }

  a {
    color: #007bff;
    text-decoration: underline;
  }

  .ql-align-center {
    text-align: center;
  }

  .ql-align-right {
    text-align: right;
  }

  .ql-align-justify {
    text-align: justify;
  }

  .ql-indent-1 {
    padding-left: 3em;
  }

  .ql-indent-2 {
    padding-left: 6em;
  }

  .ql-indent-3 {
    padding-left: 9em;
  }

  .ql-indent-4 {
    padding-left: 12em;
  }

  .ql-video {
    width: 100%;
    height: 400px;
  }

  .ql-font-serif {
    font-family: "Georgia", "Times New Roman", serif;
  }

  .ql-font-monospace {
    font-family: "Monaco", "Courier New", monospace;
  }

  .ql-size-small {
    font-size: 0.75em;
  }

  .ql-size-large {
    font-size: 1.5em;
  }

  .ql-size-huge {
    font-size: 2.5em;
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
  background-color: ${(props) => (props.isFollowed ? "white" : props.theme.colors.primary)};
  color: ${(props) => (props.isFollowed ? props.theme.colors.primary : "white")};
  border: ${(props) => (props.isFollowed ? `1px solid ${props.theme.colors.primary}` : "none")};
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isFollowed ? "#f0f0f0" : `${props.theme.colors.primary}90`)};
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
  const navigate = useNavigate();
  const post = DummyPostDetail;
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedComment, setSelectedComment] = useState<number | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.liked);
  const [comments, setComments] = useState(post.comment);
  const [newComment, setNewComment] = useState("");

  const handleCommentClick = () => {
    commentInputRef.current?.focus();
  };

  const toggleDropdown = (commentId: number | null) => {
    setSelectedComment(commentId);
    setShowDropdown((prev) => !prev);
  };

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const handleEditPost = () => {  
    // 추가
  }

  const handleDeletePost = () => {
    navigate("/home/board");
  }


  const handleDeleteComment = () => {
    // 추가
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    const newCommentData = {
      commentId: comments.length + 1, // 새로운 댓글 ID
      userId: Math.random(), // 임시 userId
      userName: "CurrentUser",
      userImg: ProfileImg,
      createdAt: new Date(),
      content: newComment,
      myComment: true,
    };

    setComments([...comments, newCommentData]);
    setNewComment("");
  };

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
                  {showDropdown && selectedComment === post.userId && (
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
      {post.postImg && <ContentImage src={post.postImg} alt="Post" />}
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
        <FollowButton isFollowed={isFollowed} onClick={handleFollow}>
          {isFollowed ? "Unfollow" : "Follow"}
        </FollowButton>
      </AuthorInfo>
      <Divider />
      <Actions>
        <Action onClick={handleCommentClick}>
          <ActionIcon>💬</ActionIcon> {post.comments}
        </Action>
        <Action liked={isLiked} onClick={handleLike}>
          <ActionIcon>👍</ActionIcon> {likes}
        </Action>
        <Action>
          <ActionIcon>👁️</ActionIcon> {post.views}
        </Action>
        <Action>
          <ActionIcon>🔗</ActionIcon> Share
        </Action>
      </Actions>
      <CommentInput>
        <ProfileImage src={ProfileImg} alt="Profile" />
        <Input
          ref={commentInputRef}
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
        {comments.map((comment) => (
          <>
            <CommentItem key={comment.commentId}>
              <ProfileImage
                src={comment.userImg ? comment.userImg : BasicProfileImg}
                alt="Profile"
              />
              <CommentContent>
                <UserName>{comment.userName}</UserName>
                <PostMeta>{formatTimeAgo(new Date(comment.createdAt))}</PostMeta>
                <div>{comment.content}</div>
              </CommentContent>
              {comment.myComment && (
                <DropdownContainer>
                  <MoreButton
                    src={MoreButtonImg}
                    onClick={() => toggleDropdown(comment.commentId)}
                  />
                  {showDropdown && selectedComment === comment.commentId && (
                    <DropdownMenu>
                      <DropdownItem onClick={handleDeleteComment}>삭제</DropdownItem>
                    </DropdownMenu>
                  )}
                </DropdownContainer>
              )}
            </CommentItem>
            <Divider />
          </>
        ))}
      </CommentList>
    </Container>
  );
};

export default PostDetail;
