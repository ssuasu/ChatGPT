import Header from "./Header"
import Button from "../common/Buttons"
import gpticon from "../../assets/gpticon.svg"
import styled from 'styled-components'
import { Hexagon } from "lucide-react"
import { useSessionStore } from "../../store/sessionStore"
import { PiCirclesFour } from "react-icons/pi";
import { getSummary } from "../../utils/storage"
import { removeSession } from "../../utils/storage"


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

  @media (max-width: 768px) {
    box-shadow: ${({ isOpen }) => (isOpen ? '0 0 30px -10px gray' : '0')};
    z-index: 1000;
  }
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
  font-size:14px;
  

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
          {sessions.map(id => {
            const summary = getSummary(id) ?? '요약 없음';
            return(
            <ListItem key={id} onClick={() => onSelect(id)} style={{justifyContent:'space-between'}}>
              <>{summary}</>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 클릭 이벤트가 부모에게 전파되지 않도록
                  removeSession(id);
                  location.reload();   // 상태관리로 대체 가능
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 hidden group-hover:inline"
              >
                ✕
              </button>
            </ListItem>
          );})}
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
        <Header/>
        <ScrollArea>
          <Inventory onSelect={onSelect}/>
        </ScrollArea>
        <Footer />
    </Sidebar>
    );
}


