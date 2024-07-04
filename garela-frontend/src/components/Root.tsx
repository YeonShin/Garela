import { Outlet } from "react-router-dom"
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { UserInfoType, myInfoState } from "../atom";

const Root = () => {

  return (
    <>
      <Outlet />
    </>
  )
}

export default Root;