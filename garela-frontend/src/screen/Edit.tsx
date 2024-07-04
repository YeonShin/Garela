import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Edit:React.FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default Edit;