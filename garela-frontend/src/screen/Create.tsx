import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Create:React.FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default Create;