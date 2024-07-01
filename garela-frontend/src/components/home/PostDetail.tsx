import styled from "styled-components";
import DummyPostDetail from "./DummyPostDetail";
import { formatTimeAgo } from "../../Util";
import BasicProfileImg from "../../imgs/basicProfile.png";
import ProfileImg from "../../imgs/profile.jpg";
import PostImg from "../../imgs/postImg.jpg";

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
  margin: 0 0 20px 0;
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
`;

const AuthorInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const FollowButton = styled.button`
  margin-left: 20px;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}90;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
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
`

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
`;

const PostDetail: React.FC = () => {
  const post = DummyPostDetail;

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
      </Header>
      <Divider />
      <Title>{post.title}</Title>
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
        <FollowButton>Follow</FollowButton>
      </AuthorInfo>
      <Divider />
      <Actions>
        <Action>
          <ActionIcon>💬</ActionIcon> {post.comments}
        </Action>
        <Action>
          <ActionIcon>👍</ActionIcon> {post.likes}
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
        <Input type="text" placeholder="Write your comment" />
        <SendButton>➤</SendButton>
      </CommentInput>
      <CommentList>
        {post.comment.map((comment) => (
          <>
            <CommentItem key={comment.userId}>
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
            </CommentItem>
            <Divider />
          </>
        ))}
      </CommentList>
    </Container>
  );
};

export default PostDetail;
