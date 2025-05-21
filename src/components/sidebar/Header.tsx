import Button from '../common/Buttons'
import { PanelLeft, Search, SquarePen, AlignLeft } from "lucide-react"
import styled from 'styled-components'
import {useEffect, useState} from "react"
import { useSidebarStore } from '../../store/buttonfunctions'
import { useModal } from '../../contexts/ModalContext';
import { useSessionStore } from '../../store/sessionStore';
//import { addSession } from '../../utils/storage';
//import { useNavigate } from 'react-router-dom';

//양쪽에 배치
const ButtonPosition = styled.div`

    padding: 7px 13px;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items:center;
`

export default function Header({ onSelect }: { onSelect: (id: string) => void }) {
  //const navigate = useNavigate();
  const toggleSidebar = useSidebarStore(state => state.toggle);
  const { openModal } = useModal();
  const createSession = useSessionStore(state => state.createSession);

  const [isNarrow, setIsNarrow] = useState(() => {
    const screenHalf = 290;
    return window.innerWidth < screenHalf;
  });

  useEffect(() => {
    const checkWidth = () => {
      //const screenHalf = window.outerWidth / 2;
      setIsNarrow(window.innerWidth < 290);
    };

    checkWidth(); // 초기화
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, []); // 빈 배열: 이벤트는 한 번만 등록됨

  return (
    <>
      <ButtonPosition>
      <Button
      icon={isNarrow ? <AlignLeft size={20} /> : <PanelLeft size={20} />}
      borderRadius="10px"
      hoverColor="#e0e0e0"
      description="사이드바 닫기"
      descriptionPosition="left"
      onClick={() => {console.log("sidebar click\n"); toggleSidebar();}}
      />
      <div>
      <Button
      icon={<Search size={20} />}
      borderRadius="10px"
      hoverColor="#e0e0e0"
      description="채팅 검색"
      onClick={() => {console.log("search click\n"); 
        openModal(<p>sideHeader에서 띄운 팝업</p>);
      }}
      />
      <Button
      icon={<SquarePen size={20} />}
      borderRadius="10px"
      hoverColor="#e0e0e0"
      description="새 채팅"
      onClick={
        () => {console.log("newnote click\n");
        createSession(onSelect);          
      }}
      />
      </div>
      </ButtonPosition>        
    </>
  )
}