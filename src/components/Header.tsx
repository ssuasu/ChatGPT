import Button from './common/Buttons'
import { PanelLeft, SquarePen, MessageCircleDashed, ChevronDown, Plus, Hexagon, SlidersHorizontal, Settings, Keyboard, SquareArrowOutUpRight, Hamburger } from "lucide-react"
import styled from 'styled-components'
import {useEffect, useState, useRef} from "react"
import gpticon from '../assets/gpticon.svg'
import { useSidebarStore } from '../store/buttonfunctions'
import { BsStars } from "react-icons/bs";
import { useNavigate } from 'react-router-dom'

const DD_SIZE = 15;

const Container = styled.div`

`

//양쪽에 배치
const ButtonPosition = styled.div`
    padding: 7px 13px;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items:center;
`
const ButtonGroup = styled.div`
   display:flex;
    flex-direction: row;
    justify-content: center;
    align-items:center;
    position: relative;
`

const Profile = styled.img`
  border: 1px solid #ccc;
  border-radius: 999px;
  padding: 0.5rem;
  margin-left: 7px;
`

const DropStyle = styled.div`
position: absolute; //버튼 밑에
top: 100%;
right: 0;
z-index: 10;
 background: white;
border: 1px solid #e2e2e2;
border-radius: 12px;
box-shadow: 0 3px 12px rgba(0,0,0,0.1);
padding: 5px;

ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 8px;
    cursor: pointer;
    border-radius: 8px;
    font-size: 14px;
    
    &:hover {
    background-color: #f0f0f0;
  }
`

export default function Header() {

  const toggleSidebar = useSidebarStore(state => state.toggle);
  const {isOpen} = useSidebarStore();
  const [openDropdown,setOpenDropdown] = useState<null | 'chatgpt' | 'profile'>(null);  //드롭다운 열기
  const ref = useRef<HTMLDivElement>(null); //바깥 클릭 시 드롭다운 닫으
  const navigate = useNavigate();

  const toggleDropdown = (type: 'chatgpt' | 'profile') => setOpenDropdown(prev => (prev === type ? null : type));

  useEffect(()=>{
    const handleClickOutside = (e: MouseEvent)=>{
      if (ref.current && !ref.current.contains(e.target as Node)){
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return ()=> document.removeEventListener('mousedown', handleClickOutside);
  })

  return (
    <Container>
      <ButtonPosition ref={ref}>
        <ButtonGroup>
          <div style={{display: isOpen? "none":"block"}}>
            <Button
            icon={<PanelLeft size={20} />}
            borderRadius="10px"
            hoverColor="#e0e0e0"
            description="사이드바 열기"
            descriptionPosition="left"
            onClick={() => {console.log("sidebar click\n"); toggleSidebar();}}
            />
            <Button
            icon={<SquarePen size={20} />}
            borderRadius="10px"
            hoverColor="#e0e0e0"
            description="새 채팅"
            onClick={
              () => {console.log("newnote click\n");
              navigate('/');}}
            />
          </div>
          <Button
          label='ChatGPT'
          icon={<ChevronDown size={15}/>}
          borderRadius="10px"
          hoverColor="#e0e0e0"
          onClick={() => {console.log("newnote click\n"); toggleDropdown('chatgpt');}}
          />
          {
            openDropdown=='chatgpt' && (
              <DropStyle style={{width: '200px',left: 0}}>
                <ul>
                  <li>
                   <BsStars size={DD_SIZE}/>
                    <span style={{fontSize:"13px"}}>ChatGPT Plus</span>
                  </li>
                  <li>
                    <Hamburger size={DD_SIZE}/>
                    <span style={{fontSize:"13px"}}>ChatGPT</span>
                  </li>
                </ul>
              </DropStyle>
            )
          }
        </ButtonGroup>

        <ButtonGroup>
          <Button
          icon={<MessageCircleDashed size={20} />}
          label='임시'
          border
          borderRadius="999px"
          hoverColor="#e0e0e0"
          description="임시 채팅 토글하기"
          onClick={() => {console.log("immshi click\n")}}
          />
          <Profile src={gpticon} alt="GPT Icon" style={{ width: 20, height: 20 }} 
          onClick={()=>toggleDropdown('profile')}/>
          {
            openDropdown=='profile' && (
              <DropStyle style={{width: '300px', right: 0}}>
                <ul>
                  <li style={{  justifyContent: 'space-between', // 버튼을 오른쪽에 두고 싶을 경우
                    }}>
                      <span style={{opacity:0.7}}>사용자 아이디</span>
                    <Button icon={<Plus size={12}/>}/>
                  </li>
                  <hr style={{ margin: '4px auto', border: 'none', borderTop: '1px solid #efefef', width:'95%'}} />
                  <li><Hexagon size={DD_SIZE}/> <span> 플랜 업그레이드</span></li>
                  <li><SlidersHorizontal size={DD_SIZE}/>  ChatGPT 맞춤 설정</li>
                  <li><Settings size={DD_SIZE}/> 설정</li>
                  <li><Keyboard size={DD_SIZE}/>키보드 단축키</li>
                  <hr style={{ margin: '4px auto', border: 'none', borderTop: '1px solid #efefef', width:'95%' }} />
                  <li><SquareArrowOutUpRight size={DD_SIZE}/>도움말 및 자주 묻는 질문(FAQ)</li>
                  <li><SquareArrowOutUpRight size={DD_SIZE}/>릴리즈 노트</li>
                </ul>
              </DropStyle>
            )
          }
        </ButtonGroup>
      </ButtonPosition>        
    </Container>
  )
}