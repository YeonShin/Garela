import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import Main from "./screen/Main";

import Home from "./screen/Home";
import Auth from "./screen/Auth";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PostList from "./components/home/PostList";
import Board from "./components/home/Board";
import TemplateBoard from "./components/home/templates/TemplateBoard";
import PostDetail from "./components/home/PostDetail";
import CreatePost from "./components/home/CreatePost";
import CreateTemplate from "./components/home/templates/CreateTemplate";
import Create from "./screen/Create";
import Setting from "./components/MyPage";
import MyPage from "./components/MyPage";
import Profile from "./components/mypage/Profile";
import Posts from "./components/mypage/Posts";
import Templates from "./components/mypage/Templates";
import Follows from "./components/mypage/Follows";
import TemplateLibrary from "./components/mypage/TemplateLibrary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, 
    children: [
      {
        path: "",
        element: <Main />
      }
    ]
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      }
    ]
  },
  {
    path: "home",
    element: <Home />,
    children: [
      {
        path: "board",
        element: <Board />,
        children: [
          {
            path: "",
            element: <PostList />
          },
          {
            path: ":postId",
            element: <PostDetail />
          },
        ]
      },
      {
        path: "template",
        element: <TemplateBoard />,
      },
      {
        path: "mypage",
        element: <MyPage />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "posts",
            element: <Posts />,
          },
          {
            path: "templates",
            element: <Templates />,
          },
          {
            path: "follows",
            element: <Follows />,
          },
          {
            path: "library",
            element: <TemplateLibrary />,
          },
        ],
      }
    ]
  },
  {
    path: "create",
    element: <Create />,
    children: [
      {
        path: "post",
        element: <CreatePost />
      },
      {
        path: "template",
        element: <CreateTemplate />
      }
    ]
  }
]);

export default router;