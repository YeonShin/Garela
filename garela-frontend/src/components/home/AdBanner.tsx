import React from "react";
import styled from "styled-components";
import AdImg from "../../imgs/advertisement.png";

const AdSection = styled.div`
  width: 100%;
`;

const Advertisement = styled.img`
  display: flex;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const AdBanner: React.FC = () => {
  return (
    <AdSection>
      <Advertisement src={AdImg}/>
    </AdSection>
  );
};

export default AdBanner;
