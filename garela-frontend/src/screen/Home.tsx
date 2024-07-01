import styled from "styled-components";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default Home;