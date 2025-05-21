import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Conversation from './components/Conversation';
import { ModalProvider } from './contexts/ModalContext';

function App() {

  /*부모 컴포넌트인 Layout 안에 
  자식 컴포넌트 Indexpage, NotePage가 주소에 따라 랜더링됨*/

  return (
    <ModalProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Conversation/>}/>
          <Route path='/note/:sessionId' element={<Conversation/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </ModalProvider>
  )
}

export default App

