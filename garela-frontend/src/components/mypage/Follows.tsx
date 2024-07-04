import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { myInfoState } from "../../atom";

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }
`;

const Follows: React.FC = () => {
  const userInfo = useRecoilValue(myInfoState);

  return (
    <div>
      <h2>팔로우 중인 유저 목록</h2>
      <List>
        {userInfo.followingUsers.map((user) => (
          <ListItem key={user.userId}>{user.name}</ListItem>
        ))}
      </List>
    </div>
  );
};

export default Follows;
