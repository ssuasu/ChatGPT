import Header from "./Header"
import Button from "../common/Buttons"
import gpticon from "../../assets/gpticon.svg"
import styled from 'styled-components'
import { Hexagon } from "lucide-react"
import { useSessionStore } from "../../store/sessionStore"
import { PiCirclesFour } from "react-icons/pi";
//import { useNavigate } from "react-router-dom";


const Sidebar = styled.div<{ isOpen: boolean }>`
  background: #f7f7f7;
  width: 260px; // ← 이게 가로 길이 제한
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease;
`;

//버튼 세로 정렬
const ButtonList = styled.div`
    display: flex;
    flex-direction: column;
    padding: 7px 13px;
`
//
const commonProcs = {
  borderRadius: "12px",
  hoverColor: "#dbdbdb",
};

const FooterWrapper = styled.div`
  border: 1px solid #ccc;; // 원하는 스타일 1개
  margin-top: auto;
`

const Menue = styled.div`
`

const List = styled.ul`
  list-style: none;
  padding: 8px;
  margin: 0;
`
const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  

  &:hover {
    background: #eaeaea;
  }
`
const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* 필수: flex container에서 overflow 제대로 동작하도록 */

    /* 스크롤바 전체 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  /* 스크롤바 트랙 (배경) */
  &::-webkit-scrollbar-track {
    background: #f7f7f7; // 사이드바 배경색과 같게
  }

  /* 스크롤바 썸 (움직이는 부분) */
  &::-webkit-scrollbar-thumb {
    background-color:rgb(223, 223, 223); // 연회색
    border-radius: 4px;
  }

  /* 썸 hover 시 색 */
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgb(198, 198, 198);;
  }
  `;



const Inventory = ({ onSelect }: { onSelect: (id: string) => void })=> {
  const sessions = useSessionStore((state) => state.sessions);
  const createSession = useSessionStore((state) => state.createSession);

  const handleCreate = () => {
    createSession(onSelect);
  };


  const mainButtons = [
    {
        icon : <img src={gpticon} alt="GPT Icon" style={{ width: 20, height: 20 }} />,
        label: "ChatGPT",
        onClick: () => {},
    },
    {
    icon: <img src={gpticon} alt="GPT Icon" style={{ width: 20, height: 20 }} />,
    label: "Sora",
    onClick: () => {},
  },
  {
    icon: <img src={gpticon} alt="GPT Icon" style={{ width: 20, height: 20 }} />,
    label: "라이브러리",
    onClick: () => {},
  },
  {
    icon: <PiCirclesFour size={20} />,
    label: "GPT 탐색",
    onClick: () => {},
  },
]

    return (
    <>
      <Menue>
        <List>
            {mainButtons.map((item, i)=>(
              <ListItem key={i} onClick={item.onClick}>
                <>
                {item.icon}
                {item.label}
                </>
              </ListItem>
            ))}
        </List>
      </Menue>
      
      <div className="w-64 bg-gray-100 p-2">
        <List>
          {sessions.map(id => (
            <ListItem key={id} onClick={() => onSelect(id)}>
              <>{id}</>
            </ListItem>
          ))}
        </List>
      </div>
    </>
  )
}



const Footer = () => {
  const footlist = [
    {
      icon : <Hexagon size={20}/>,
      label: "Plus 갱신",
      onclick: () => {},
    },
    {
      icon : <img src={gpticon} alt="GPT Icon" style={{ width: 20, height: 20 }} />,
      label: "userprofile",
      onclick: () => {},
      },
  ]

  return (
    <FooterWrapper>
      <ButtonList>
            {footlist.map((btn, i)=>(
                <Button key={i} {...commonProcs} {...btn} />
            ))}
        </ButtonList>
    </FooterWrapper>
  )
}

export default function SideBar({isOpen, onSelect}:{isOpen:boolean, onSelect:(id: string) => void}) {

    return (
    <Sidebar isOpen={isOpen}>
        <Header onSelect={onSelect}/>
        <ScrollArea>
          <Inventory onSelect={onSelect}/>
        </ScrollArea>
        <Footer />
    </Sidebar>
    );
}


