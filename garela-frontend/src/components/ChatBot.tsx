import React, { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import ChatBotIcon from "../imgs/ChatbotIcon.png";
import CancleIcon from "../imgs/CancleIcon.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { sessionIdState } from "../atom";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOutDown = keyframes`
  from {
    opacity: 1;
    transform: translateY(0px);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const dotFlashing = keyframes`
  0% { content: "."; }
  33% { content: ".."; }
  66% { content: "..."; }
`;

interface ChatBotContainerProps {
  isChatStarted: boolean;
};

const ChatBotContainer = styled.div`
  position: fixed;
  top: 92vh;
  left: 1.5vw;

`;

interface ChatBotButtonProps {
  isFading: boolean;
}

const ChatBotButton = styled.img<ChatBotButtonProps>`
  width: 44px;
  border-radius: 50%;
  transition: box-shadow 0.3s ease-in-out, transform 0.1s ease-in-out, opacity 0.3s ease-in-out;
  opacity: ${props => (props.isFading ? 0.5 : 1)};
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: scale(0.9);
  }
`;

interface ChatBoxProps {
  animation: "fadeInUp" | "fadeOutDown";
}

const ChatBox = styled.div<ChatBoxProps>`
  width: 400px;
  height: 500px;
  background-color: #F0F1FF;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  position: absolute;
  bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${props =>
    props.animation === "fadeInUp"
      ? css`${fadeInUp} 0.4s ease-in-out`
      : css`${fadeOutDown} 0.4s ease-in-out`
  };
`;

const ChatBoxImage = styled.img`
  width: 100px;
  margin: 20px;
`;

const ChatBoxHeader = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ChatBoxContent = styled.div`
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
`;

const StartButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  width: 200px;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #8790DA;
  }
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
  overflow-y: auto;
  flex: 1;
`;

interface Message {
  role: "user" | "bot";
  content: string;
}

const MessageWrapper = styled.div<{ role: "user" | "bot" }>`
  display: flex;
  margin-bottom: 20px;
  justify-content: ${props => props.role === "user" ? "flex-end" : "flex-start"};
`;

const MessageContent = styled.div<{ role: "user" | "bot" }>`
  background-color: ${props => props.role === "user" ? "#FFEB3B" : "#FFF"};
  color: ${props => props.role === "user" ? "#000" : "#000"};
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  align-self: ${props => props.role === "user" ? "flex-end" : "flex-start"};
`;


const BotIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const AnimatedDots = styled.div`
  &::after {
    content: "...";
    animation: ${dotFlashing} 1s infinite steps(3);
  }
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px solid #ddd;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SendButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #8790DA;
  }
`;

const ChatBot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [animation, setAnimation] = useState<"fadeInUp" | "fadeOutDown">("fadeInUp");
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [{ role: "assistant", content: "Hello! I'm Garela. How can I help you?" }];
  });
  const [inputValue, setInputValue] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [sessionId, setSessionId] = useRecoilState(sessionIdState);

  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleIconClick = () => {


    if (isOpen) {
      setAnimation("fadeOutDown");
      setTimeout(() => {
        setIsOpen(false);
      }, 200); // 애니메이션 지속 시간과 일치시킴
    } else {
      setIsFading(true);
      setAnimation("fadeInUp");
      setTimeout(() => {
        setIsOpen(true);
        setIsFading(false);
      }, 200); // 이미지 전환 타이밍 조절

    }

  };

  const handleStartClick = () => {
    if(localStorage.getItem("token") === null) {
      navigate("/auth/login");
      return ;
    }
    setIsChatStarted(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendClick = async () => {
    if (inputValue.trim()) {
      const newMessages: Message[] = [...messages, { role: "user", content: inputValue }];
      setMessages(newMessages);
      setInputValue("");
      setIsWaitingForResponse(true);

      try {
        const response = await axios.post('http://localhost:5000/chat', {
          userPrompt: inputValue,
          sessionId: sessionId,
          history: newMessages.map(msg => ({role: msg.role, content: msg.content}))
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (response.status === 200) {
          const botMessage = response.data.chat;
          setMessages(prevMessages => [...prevMessages, { role: "bot", content: botMessage }]);
        } else {
          setMessages(prevMessages => [...prevMessages, { role: "bot", content: "I'm sorry, I couldn't process your request." }]);
        }
      } catch (error) {
        setMessages(prevMessages => [...prevMessages, { role: "bot", content: "There was an error processing your request." }]);
      }

      setIsWaitingForResponse(false);
    }
  };

  return (
    <ChatBotContainer >
      {!isOpen && (
        <ChatBotButton 
          src={ChatBotIcon} 
          alt="chatbot_icon" 
          onClick={handleIconClick}
          isFading={isFading}
        />
      )}
      {isOpen && (
        <>
          <ChatBotButton 
            src={CancleIcon} 
            alt="cancle_icon" 
            onClick={handleIconClick}
            isFading={isFading}
          />
          {!isChatStarted ? (
            <ChatBox animation={animation}>
              <ChatBoxImage src={ChatBotIcon} />
              <ChatBoxHeader>Garela Bot</ChatBoxHeader>
              <ChatBoxContent>I'm Garela! I'm your personal assistant. <br />I'm here to guide on our platform.</ChatBoxContent>
              <StartButton onClick={handleStartClick}>Start</StartButton>
            </ChatBox>
          ) : (
            <ChatBox animation={animation}>
              <MessageContainer ref={messageContainerRef}>
                {messages.map((message, index) => (
                  <MessageWrapper role={message.role} key={index}>
                    {message.role === "bot" && <BotIcon src={ChatBotIcon} />}
                    <MessageContent role={message.role}>{message.content}</MessageContent>
                  </MessageWrapper>
                ))}
                {isWaitingForResponse && (
                  <MessageWrapper role="bot">
                    <BotIcon src={ChatBotIcon} />
                    <MessageContent role="bot"><AnimatedDots /></MessageContent>
                  </MessageWrapper>
                )}
              </MessageContainer>
              <InputContainer>
                <Input 
                  type="text" 
                  value={inputValue} 
                  onChange={handleInputChange} 
                  placeholder="Talk with Garela bot"
                />
                <SendButton onClick={handleSendClick}>Send</SendButton>
              </InputContainer>
            </ChatBox>
          )}
        </>
      )}
    </ChatBotContainer>
  );
}

export default ChatBot;
