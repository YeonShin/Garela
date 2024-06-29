import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import IntroImg from "../imgs/introImage.webp";
import FeatureImg from "../imgs/main.jpg";  // 새로 업로드된 이미지 파일 import

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
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
`;

const IntroImage = styled.img`
  flex: 1;
  max-width: 550px;
  width: 100%;
  height: auto;
  border-radius: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
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
  max-width: 550px;
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
  return (
    <>
      <Navbar />
      <MainContainer>
        <Section>
          <IntroSection>
            <IntroText>
              <Title>Discover the Power of Our Platform</Title>
              <Subtitle>
                Our cutting-edge platform empowers you to build, deploy, and
                scale web applications with ease. Experience the future of web
                development.
              </Subtitle>
            </IntroText>
            <IntroImage src={IntroImg} alt="Hero" />
          </IntroSection>
        </Section>
        <Section>
          <Content>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Unlock Your Potential</h2>
            <Subtitle>
              Our platform offers a comprehensive suite of tools and features to
              streamline your web development workflow. Discover how we can help
              you achieve your goals.
            </Subtitle>
            <FeaturesSection>
              <FeaturesList>
                <FeatureItem>
                  <FeatureTitle>Rapid Deployment</FeatureTitle>
                  <FeatureDescription>
                    Deploy your applications with a single click and scale
                    effortlessly.
                  </FeatureDescription>
                </FeatureItem>
                <FeatureItem>
                  <FeatureTitle>Seamless Collaboration</FeatureTitle>
                  <FeatureDescription>
                    Empower your team with built-in tools for seamless
                    collaboration.
                  </FeatureDescription>
                </FeatureItem>
                <FeatureItem>
                  <FeatureTitle>Powerful Analytics</FeatureTitle>
                  <FeatureDescription>
                    Gain deep insights into your application's performance and
                    user behavior.
                  </FeatureDescription>
                </FeatureItem>
              </FeaturesList>
              <FeatureImage src={FeatureImg} alt="Features" />
            </FeaturesSection>
          </Content>
        </Section>
        <Section>
          <Content>
            <Title>Elevate Your Web Presence</Title>
            <Subtitle>
              Our platform provides the tools and infrastructure you need to
              build, deploy, and scale your web applications with confidence.
            </Subtitle>
            <CallToAction>
              <Button href="#">Learn More</Button>
              <Button href="#">Contact Sales</Button>
            </CallToAction>
          </Content>
        </Section>
      </MainContainer>
      <Footer />
    </>
  );
};

export default Main;
