import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import Main from "./screen/Main";

import Home from "./screen/Home";
import Auth from "./screen/Auth";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PostList from "./components/home/PostList";
import Board from "./components/home/Board";

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
        element: <Board />
      },
    ]
  },
]);

export default router;