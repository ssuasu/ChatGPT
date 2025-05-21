import styled from 'styled-components'
import Button from './common/Buttons'
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Globe, Lightbulb, Telescope, Brush, Ellipsis, Mic, AudioLines} from 'lucide-react'
import debounce from 'lodash.debounce'
import { useNavigate } from 'react-router-dom';

import { saveMessage } from '../utils/storage';
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
  border: '1px solid #ccc',
  borderRadius: "999px",
  hoverColor: "#e0e0e0",
  opacity:0.6,
  fontsize: "13px",
};

//

export default function InputFooter({ sessionId, onUpdate }: { sessionId: string, onUpdate: () => void }){
    const buttonGroup1 = [
    {
        icon:<Plus size={ICON_SIZE}/>,
        description:'사진 및 파일 추가',
        onClick:()=>{console.log("click plus image or files")}
    },{
        icon : <Globe size={ICON_SIZE}/>,
        label: "검색",
        description: "웹에서 검색",
        onClick: () => {setPlaceholder("웹에서 검색")},
    },{
        icon : <Lightbulb size={ICON_SIZE}/>,
        label: "이성",
        description: "응답 전에 생각하기",
        onClick: () => {setPlaceholder("무엇이든 부탁하세요")},
    },{
        icon : <Telescope size={ICON_SIZE}/>,
        label: "심층 리서치",
        description: "디테일한 보고서를 작성하세요",
        onClick: () => {setPlaceholder("디테일한 보고서를 작성하세요")},
    },{
        icon : <Brush size={ICON_SIZE}/>,
        label: "이미지 그리기",
        description: "무엇이든 시각화하세요",
        onClick: () => {console.log('Brush clicked')},
    },{
        icon : <Ellipsis size={ICON_SIZE}/>,
        description: "도구 보기",
        onClick: () => {console.log('Ellipsis clicked')},
    },
]
    const [placeholder, setPlaceholder] = useState("무엇이든 물어보세요");
    const [showLabel, setShowLabel] = useState(true);
    const [input, setInput] =useState('');  //입력처리

    //자동높이조절 textarea 만들기
    const textarea = useRef<HTMLTextAreaElement>(null);
    const leftGroupRef = useRef<HTMLDivElement>(null);
    const rightGroupRef = useRef<HTMLDivElement>(null);
    const handleResizeHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

    const navigate=useNavigate();
    const createSessionAsync = useSessionStore(state => state.createSessionAsync);
    //입력처리
    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const userText = input.trim();
    if (!userText) return;

    let id = sessionId;

  // 새로운 세션이면 생성
    if (!id) {
        id = await createSessionAsync(); // 반드시 Promise<string>을 반환하도록 구현되어야 함
        navigate(`/note/${id}`);
    }
    //message 저장 처리
    saveMessage(sessionId, { role: 'user', text: userText });
    onUpdate();  // 메시지 갱신용
    setInput('');

    const aiReply = await callGemini(userText);
    saveMessage(sessionId, { role: 'ai', text: aiReply });
    onUpdate();
  }

  

    useEffect(() => {
        const updateLabelVisibility = () => {
            requestAnimationFrame(() => {
                if (!leftGroupRef.current || !rightGroupRef.current) return;

                const leftRect = leftGroupRef.current.getBoundingClientRect();
                const rightRect = rightGroupRef.current.getBoundingClientRect();

                const gap = rightRect.left - leftRect.right;
                console.log(gap);

                const shouldShow = gap > 50;
                setShowLabel(prev => (prev !== shouldShow ? shouldShow : prev));

            });
        };

        const debouncedUpdate = debounce(updateLabelVisibility, 50); // debounce 시간은 상황에 따라 조절

        window.addEventListener('resize', debouncedUpdate);
        updateLabelVisibility();

        return () => {
            window.removeEventListener('resize', debouncedUpdate);

        };
    }, []);



    return (
        <>
        <IFStyle>
            <textarea
            value={input}
            ref={textarea}  //얘 없으면 textarea.current가 null됨.
            onChange={(e) => {
                setInput(e.target.value);
                handleResizeHeight(e);
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
                    return <Button key={i} {...commonProcs} {...btn} label={showLabel ? btn.label : undefined} />
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
                    icon={<AudioLines size={ICON_SIZE}/>}
                    description='음성 모드 사용'
                    onClick={()=>{console.log('음성 모드\n')}}
                    />
                </div>
            </ButtonPosition>
        </IFStyle>

        
        </>
    )
}