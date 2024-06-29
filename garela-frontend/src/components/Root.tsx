import { Outlet } from "react-router-dom"
import Navbar from "./Navbar";
import Footer from "./Footer";

const Root = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

export default Root;