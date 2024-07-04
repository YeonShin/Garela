import React, { useEffect } from "react";
import styled from "styled-components";
import { NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { myInfoState, UserInfoType } from "../atom";

const Container = styled.div`
  display: flex;
  padding: 0px 80px;
  height: 100%;
  `;

const Sidebar = styled.div`
  width: 200px;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: 10px;
  margin-top: 120px;
  margin-bottom: 120px;
  height: 100%;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.1);

  :last-child {
  border-radius: 0px 0px 10px 10px;
  }
`;

const SidebarTitle = styled.div`
  text-align: center;
  padding: 3rem;
    background-color: rgba( 90, 103, 216, 1 );
  color: white;
  font-weight: bold;
  border-radius: 10px  10px 0 0;
`

const SidebarItem = styled(NavLink)`
  display: block;
  padding: 1rem;
  color: ${(props) => props.theme.colors.text};
  text-decoration: none;
  border: 1px solid #B3B3B3;
  border-top: 0px solid;


  &.active {
    background-color: rgba( 90, 103, 216, 0.9 );
    border: none;
    color: white;
    font-weight: bold;

  }

  &:hover {
    background-color: rgba( 90, 103, 216, 0.9 );
    border: none;
    color: white;
    font-weight: bold;

  }
`;

const Content = styled.div`
  flex: 1;
  padding: 0 2rem 2rem 0;
  margin-left: 120px;
  margin-top: 120px;
`;

const MyPage: React.FC = () => {


  return (
    <Container>
      <Sidebar>
        <SidebarTitle>마이 페이지</SidebarTitle>
        <SidebarItem to="profile">내 프로필</SidebarItem>
        <SidebarItem to="posts">내 게시글 목록</SidebarItem>
        <SidebarItem to="templates">내 템플릿 목록</SidebarItem>
        <SidebarItem to="follows">팔로우 중인 유저 목록</SidebarItem>
        <SidebarItem to="library">템플릿 라이브러리</SidebarItem>
      </Sidebar>
      <Content>
        <Outlet />
      </Content>
    </Container>
  );
};

export default MyPage;
