import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import IntroImg from "../imgs/introImage.webp";
import FeatureImg from "../imgs/main.jpg";  // 새로 업로드된 이미지 파일 import
import { useNavigate } from "react-router-dom";
import logo from "../imgs/garela.png";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  margin-top: 80px; /* 네비게이션 바의 높이를 고려한 마진 */
`;

const Section = styled.section`
  width: 100%;
  padding: 3rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.background};

  &:nth-child(even) {
    background-color: ${(props) => props.theme.colors.surface};
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  padding: 0 1rem;
  text-align: center;
`;

const IntroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  padding: 2rem 0;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
  }
`;

const IntroText = styled.div`
  flex: 1;
  padding: 1rem;
  text-align: center;
`;

const IntroImage = styled.img`
  flex: 1;
  max-width: 550px;
  width: 100%;
  height: auto;
  border-radius: 1rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.mutedText};
  margin-bottom: 2rem;
`;

const FeaturesSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  padding: 2rem 0;

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  flex: 1;

  @media (min-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.li`
  text-align: left;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.mutedText};
`;

const FeatureImage = styled.img`
  flex: 1;
  max-width: 480px;
  width: 100%;
  height: auto;
  border-radius: 1rem;
`;

const CallToAction = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 400px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 2rem;
  font-size: 1rem;
  font-weight: medium;
  text-decoration: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:first-child {
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primaryForeground};
    &:hover {
      background-color: ${(props) => props.theme.colors.primary}90;
    }
  }

  &:last-child {
    border: 1px solid ${(props) => props.theme.colors.input};
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    &:hover {
      background-color: ${(props) => props.theme.colors.accent};
      color: ${(props) => props.theme.colors.primaryForeground};
    }
  }
`;

const Main: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <>
      <Navbar />
      <MainContainer>
        <Section>
          <IntroSection>
            <IntroText>
              <Title>Garela와 함께 나만의 스토리를 작성하세요!</Title>
              <Subtitle>
              간편한 템플릿으로 누구나 쉽고 빠르게 고퀄리티의 <br /> 게시글을 작성할 수 있는 플랫폼
              </Subtitle>
            </IntroText>
            <IntroImage src={IntroImg} alt="Hero" />
          </IntroSection>
        </Section>
        <Section>
          <Content>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">여러분의 글쓰기 잠재력을 발휘하세요</h2>
            <FeaturesSection>
              <FeaturesList>
                <FeatureItem>
                  <FeatureTitle>손쉬운 작성</FeatureTitle>
                  <FeatureDescription>
                   템플릿을 통해 누구나 손쉽게 글을 작성할 수 있습니다.
                  </FeatureDescription>
                </FeatureItem>
                <FeatureItem>
                  <FeatureTitle>공유와 협업</FeatureTitle>
                  <FeatureDescription>
                    당신의 템플릿을 다른 사용자와 공유하고 협업하세요.
                  </FeatureDescription>
                </FeatureItem>
                <FeatureItem>
                  <FeatureTitle>고품질 콘텐츠</FeatureTitle>
                  <FeatureDescription>
                  최고의 퀄리티를 유지하면서도 간편하게 글을 작성하세요.
                  </FeatureDescription>
                </FeatureItem>
              </FeaturesList>
              <FeatureImage src={logo} alt="Features" />
            </FeaturesSection>
          </Content>
        </Section>
        <Section>
          <Content>
            <Title>당신의 이야기, 우리의 플랫폼</Title>
            <Subtitle>
            템플릿을 활용하여 글쓰기의 즐거움을 느끼고, 당신만의 독창적인 콘텐츠를 만들어보세요.
            </Subtitle>
            <CallToAction>
              <Button onClick={() => navigate("/home/board")}>더 알아보기</Button>
              <Button onClick={() => (token === null || token === "" ? navigate("/auth/login") : navigate("create/board"))}>지금 시작하기</Button>
            </CallToAction>
          </Content>
        </Section>
      </MainContainer>
      <Footer />
    </>
  );
};

export default Main;
