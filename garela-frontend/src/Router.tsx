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
          }
        ]
      },
      {
        path: "template",
        element: <TemplateBoard />
      }
    ]
  },
]);

export default router;