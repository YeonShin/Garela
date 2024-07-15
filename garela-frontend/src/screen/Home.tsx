import styled from "styled-components";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";

const Home: React.FC = () => {
  return (
    <>
      <Navbar />

      <Outlet />
      <ChatBot />
      <Footer />
    </>
  )
}

export default Home;