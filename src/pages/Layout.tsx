// Outlet 위치
import styled from 'styled-components'
import { Outlet, useNavigate} from 'react-router-dom'
import SideBar from '../components/sidebar/SideBar'
import Header from '../components/Header'
import {useSidebarStore} from '../store/buttonfunctions'
import { useSessionStore } from '../store/sessionStore'
import { useEffect } from 'react'

const Container = styled.div`
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`
const Main = styled.div<{ isSidebarOpen: boolean }>`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '260px' : '0')};
    transition: margin-left 0.3s ease;

    //창 크기 작아지면 화면 다 차지.
    @media (max-width: 768px) {
    margin-left: 0;
    opacity: ${({ isSidebarOpen }) => (isSidebarOpen ? '0.6': '1')};
  }
`

export default function Layout(){

    const {isOpen} = useSidebarStore();
    const navigate = useNavigate();
    const loadSessions = useSessionStore(state => state.loadSessions);
    const sessions = useSessionStore((state) => state.sessions);

    useEffect(() => {
        loadSessions();
    }, []);

    useEffect(() => {
        if (sessions.length === 0) {
            navigate('/');
        }
    }, [sessions]);

     // onSelect 구현: 노트(세션) 클릭 시 해당 경로로 이동
    function handleSelect(id: string) {
        navigate(`/note/${id}`);
    }

    return (
        <Container>
            <SideBar isOpen={isOpen} onSelect={handleSelect}/>
            <Main isSidebarOpen={isOpen}>
                <Header/>
                <Outlet/>
            </Main>
        </Container>
    )
}