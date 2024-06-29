import React from "react";
import Globalstyle from "./styles/Globalstyle";
import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { ThemeProvider } from "styled-components";
import Theme from "./styles/Theme";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <ThemeProvider theme={Theme}>
        <Globalstyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
