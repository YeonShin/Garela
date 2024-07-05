import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { myInfoState, UserInfoType } from "../../atom";
import BasicProfileImg from "../../imgs/basicProfile.png";

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 1;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ddd;
  border-radius: 15px;
  background-color: ${(props) => props.theme.colors.surface};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserName = styled.div`
  font-weight: bold;
  font-size: 24px;
`;

const UserInfoText = styled.div`
  color: #666;
  font-size: 20px;
`;

const FollowButton = styled.button<{ isFollowing: boolean }>`
  padding: 1rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: ${(props) => (props.isFollowing ? props.theme.colors.primary : "white")};
  background-color: ${(props) => (props.isFollowing ? "white" : props.theme.colors.primary)};
  border: ${(props) => (props.isFollowing ? `2px solid ${props.theme.colors.primary}` : "none")};
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border 0.3s;

  &:hover {
    background-color: ${(props) => (props.isFollowing ? `${props.theme.colors.primary}20` : props.theme.colors.primary)};
    color: ${(props) => (props.isFollowing ? props.theme.colors.primary : "white")};
  }
`;

const NoUsersMessage = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #666;
`;

const Follows: React.FC = () => {
  const [userInfo, setUserInfo] = useRecoilState<UserInfoType>(myInfoState);
  const [following, setFollowing] = useState(
    userInfo.followingUsers ? userInfo.followingUsers.map((user) => ({ ...user, isFollowing: true })) : []
  );

  const getUserInfo = async () => {
    const token = localStorage.getItem("token");
    try {
      const userResponse = await axios.get("http://localhost:5000/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (userResponse.status === 200) {
        setUserInfo(userResponse.data);
      }
    } catch (error) {
      console.error("유저 정보 조회에 실패했습니다.", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const toggleFollow = async (userId: number) => {
    const user = following.find((user) => user.userId === userId);
    if (!user) return;

    try {
      await axios.put(`http://localhost:5000/users/follow/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setFollowing((prev) =>
        prev.map((user) =>
          user.userId === userId
            ? { ...user, isFollowing: !user.isFollowing }
            : user
        )
      );
    } catch (error) {
      console.error("Failed to toggle follow status", error);
    }
  };

  if (!userInfo.followingUsers || userInfo.followingUsers.length === 0) {
    return <NoUsersMessage>팔로우 중인 유저가 없습니다</NoUsersMessage>;
  }

  return (
    <Container>
      <Content>
        <List>
          {following.map((user) => (
            <ListItem key={user.userId}>
              <UserInfo>
                <ProfileImage
                  src={user.profileImg || BasicProfileImg}
                  alt="Profile"
                />
                <div>
                  <UserName>{user.name}</UserName>
                  <UserInfoText>{user.info}</UserInfoText>
                </div>
              </UserInfo>
              <FollowButton
                isFollowing={user.isFollowing}
                onClick={() => toggleFollow(user.userId)}
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </FollowButton>
            </ListItem>
          ))}
        </List>
      </Content>
    </Container>
  );
};

export default Follows;
