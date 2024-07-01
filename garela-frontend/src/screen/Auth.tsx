import styled from "styled-components";
import { Outlet } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Auth: React.FC = () => {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  )
}

export default Auth;