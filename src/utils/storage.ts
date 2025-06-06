//localStorage 관련 로직

//메시지의 형태.
export type Message = { role: 'user' | 'ai'; text: string };

//localStorage[session]에 저장된 문자열 파싱.
export function getSessions(): string[] {
  const sessions = localStorage.getItem('sessions');    //value 읽어오기
  return sessions ? JSON.parse(sessions) : [];
}


export function addSession(sessionId: string) {
  const sessions = getSessions();
  if(!sessions.includes(sessionId)){  //최근 생성된 세션이 위로.
  localStorage.setItem('sessions', JSON.stringify([...sessions, sessionId])); 
  }
}

export function getMessages(sessionId: string): Message[] {
  const data = localStorage.getItem(`session-${sessionId}`);
  return data ? JSON.parse(data) : [];
}

export function saveMessage(sessionId: string, message: Message) {
  const messages = getMessages(sessionId);
  localStorage.setItem(`session-${sessionId}`, JSON.stringify([...messages, message]));
}


//세션 삭제
export function removeSession(sessionId: string) {
  const sessions = getSessions().filter(id => id !== sessionId);
  localStorage.removeItem(`session-${sessionId}`);
  localStorage.setItem('sessions', JSON.stringify(sessions));
}

//요약 저장
export function saveSummary(sessionId: string, summary: string) {
  localStorage.setItem(`summary-${sessionId}`, summary);
}

export function getSummary(sessionId: string): string | null {
  return localStorage.getItem(`summary-${sessionId}`);
}