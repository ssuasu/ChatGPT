import { useState, useEffect } from "react";
import type {Message} from '../utils/storage';
import { getMessages } from '../utils/storage';
import InputFooter from "./InputFooter";
import styled from "styled-components";
import { useParams } from 'react-router-dom';


const Container = styled.div`
  display: flex;
  flex:1; //Main 안에서 가능한 공간 차지
  flex-direction: column;
  height: 100%;
  width: 100%;//부모 너비 기준으로 채움
  max-width: 750px;
  min-width: 350px;
  margin: 0 auto; //수평 가운데 정렬.     
`
const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  flex-grow: 1;
  overflow-y: auto;
  z-index: 100;
`;

const MessageRow = styled.div<{ isUser: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.span<{ isUser: boolean }>`
  background-color: ${(props) => (props.isUser ? "#ccc" : "#e5e7eb")}; // #e5e7eb ≈ Tailwind의 gray-200
  border-radius: ${(props) => (props.isUser ? "20px" : "8px")};
  padding: 8px 12px;
  max-width: ${(props) => (props.isUser ? "60%" : "80%")};
  text-align: ${(props) => (props.isUser ? "right" : "left")};
  word-wrap: break-word;
`;

const FooterWrapper = styled.div`
  position: sticky;
  bottom: 20px;
  background: inherit; // 배경색 통일
  padding: 12px 16px;
  z-index: 100;
`;

// ?? sessionid를 밖에서 받아오기?
export default function Conversation(){
    const {sessionId} = useParams();
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!sessionId) {
        setMessages([]);
        } else {
            setMessages(getMessages(sessionId));
        }
    }, [sessionId]);


    return (
        <Container>
            
            <MessageList>
                {messages.map((msg, i) => (
                    <MessageRow key={i} isUser={msg.role === 'user'}>
                        <MessageBubble isUser={msg.role === "user"}>
                            {msg.text}
                        </MessageBubble>
                    </MessageRow>
                ))}
                <div style={{ paddingBottom: "100px" }}></div>
            </MessageList>
            <FooterWrapper>
            <InputFooter sessionId={sessionId!} onUpdate={() => setMessages(getMessages(sessionId!))}/>
            </FooterWrapper>
        </Container>
    )
}