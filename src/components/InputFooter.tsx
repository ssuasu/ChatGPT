import styled from 'styled-components'
import Button from './common/Buttons'
import React, { useState, useRef} from 'react';
import { Plus, Globe, Lightbulb, Telescope, Brush, Ellipsis, Mic, AudioLines} from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { FaStopCircle, FaArrowCircleUp } from "react-icons/fa";

import { saveMessage, saveSummary } from '../utils/storage';
import { callGemini } from '../utils/gemini';
import { useSessionStore } from '../store/sessionStore';

export const ICON_SIZE = 17;
const LINE_HEIGHT = 25;
const MAX_LINES = 7;

const IFStyle= styled.div`
    display: flex;
    background:white;
    flex-direction: column;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 30px;
    box-shadow: 0px 7px 20px -10px rgb(189, 189, 189);
`

const ButtonPosition = styled.div`
    padding: 7px;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items:center;

    //하위 div에 gap 설정하기
    & > div {
    display:flex;
    gap: 8px;
    }
`

const commonProcs = {
  border: true,
  borderRadius: "999px",
  hoverColor: "#e0e0e0",
  opacity:0.7,
  fontsize: "13px",
};

const Label = styled.span`
  @media (max-width: 700px) {
    display: none;
  }
`

//

export default function InputFooter({ sessionId, onUpdate }: { sessionId: string, onUpdate: () => void }){
    const buttonGroup1 = [
    {
        icon:<Plus size={ICON_SIZE}/>,
        description:'사진 및 파일 추가',
        onClick:()=>{console.log("click plus image or files")}
    },{
        icon : <Globe size={ICON_SIZE}/>,
        label: <Label>검색</Label>,
        description: "웹에서 검색",
        onClick: () => {setPlaceholder("웹에서 검색")},
    },{
        icon : <Lightbulb size={ICON_SIZE}/>,
        label: <Label>이성</Label>,
        description: "응답 전에 생각하기",
        onClick: () => {setPlaceholder("무엇이든 부탁하세요")},
    },{
        icon : <Telescope size={ICON_SIZE}/>,
        label: <Label>심층리서치</Label>,
        description: "디테일한 보고서를 작성하세요",
        onClick: () => {setPlaceholder("디테일한 보고서를 작성하세요")},
    },{
        icon : <Brush size={ICON_SIZE}/>,
        label:<Label>이미지 그리기</Label>,
        description: "무엇이든 시각화하세요",
        onClick: () => {console.log('Brush clicked')},
    },{
        icon : <Ellipsis size={ICON_SIZE}/>,
        description: "도구 보기",
        onClick: () => {console.log('Ellipsis clicked')},
    },
]
    const [placeholder, setPlaceholder] = useState("무엇이든 물어보세요");
    //const [showLabel, setShowLabel] = useState(true);
    const [input, setInput] =useState('');  //입력처리

    //자동높이조절 textarea 만들기
    const textarea = useRef<HTMLTextAreaElement>(null);
    const leftGroupRef = useRef<HTMLDivElement>(null);
    const rightGroupRef = useRef<HTMLDivElement>(null);
    const handleResizeHeight = () => {
        const el = textarea.current;
        if (!el) return;

        el.style.height = 'auto'

        const scrollHeight = el.scrollHeight;
        const maxHeight = LINE_HEIGHT * MAX_LINES;

        const newHeight = Math.min(scrollHeight, maxHeight)
        el.style.height = `${newHeight}px`;

        //스크롤 표시여부
        el.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }

    const [isTyping, setIsTyping] = useState(false);  // 사용자 입력 중 여부
    const [isLoading, setIsLoading] = useState(false);  // AI 응답 대기 중 여부
    const navigate=useNavigate();
    const createSessionAsync = useSessionStore(state => state.createSessionAsync);
    //입력처리

    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const userText = input.trim();  //양쪽 공백 정리.
        if (!userText) return;

        let id = sessionId;

    // 새로운 세션이면 생성
        if (!id) {
            navigate(`/note/${id}`);
            id = await createSessionAsync();

            
            // Gemini 요약 처리
            const summary = await callGemini(`다음 문장을 15글자 이내로 요약해줘: ${userText}`);
            saveSummary(id, summary);
            
        }
        //message 저장 처리
        saveMessage(id, { role: 'user', text: userText });
        onUpdate();  // 메시지 갱신용
        setInput('');
        setIsTyping(false);

        setIsLoading(true);
        const aiReply = await callGemini(userText);
        saveMessage(id, { role: 'ai', text: aiReply });
        onUpdate();
        setIsLoading(false);
    }


    return (
        <>
        <IFStyle>
            <textarea
            value={input}
            ref={textarea}  //얘 없으면 textarea.current가 null됨.
            onChange={(e) => {
                const value = e.target.value;
                setInput(value);
                setIsTyping(value.trim().length > 0);
                handleResizeHeight();
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter'&& !e.shiftKey){
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            rows={1} //텍스트 입력 중 보이는 영역의 라인수 명시. 기본 세팅이 2줄임.
            placeholder={placeholder}
            style={{       
                padding: "10px 12px",
                width: "100%",
                fontSize: "16px",
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
                 border: "none",
                resize: "none",
                overflow: "hidden",
            }}
            />
            <ButtonPosition>
                <div ref={leftGroupRef} style={{}}>
                {buttonGroup1.map((btn, i)=>{
                    return <Button key={i} {...commonProcs} {...btn}/>
                })}
                </div>

                <div ref={rightGroupRef}>
                    <Button 
                    {...commonProcs}
                    icon={<Mic size={ICON_SIZE}/>}
                    description='음성 입력'
                    onClick={()=>{console.log('마이크\n')}}
                    />
                    <Button 
                    {...commonProcs}
                    icon={
                        isLoading
                            ? <FaStopCircle size={ICON_SIZE}/>
                            : isTyping
                                ? <FaArrowCircleUp size={ICON_SIZE}/>
                                : <AudioLines size={ICON_SIZE}/>
                    }
                    description='음성 모드 사용'
                    onClick={()=>{console.log('음성 모드\n')}}
                    />
                </div>
            </ButtonPosition>
        </IFStyle>

        
        </>
    )
}