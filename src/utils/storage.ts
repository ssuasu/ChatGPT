//localStorage 관련 로직

export type Message = { role: 'user' | 'ai'; text: string };

export function getSessions(): string[] {
  const sessions = localStorage.getItem('sessions');    //value 읽어오기
  return sessions ? JSON.parse(sessions) : [];
}

export function addSession(sessionId: string) {
  const sessions = getSessions();
  localStorage.setItem('sessions', JSON.stringify([...sessions, sessionId]));
}

export function getMessages(sessionId: string): Message[] {
  const data = localStorage.getItem(`session-${sessionId}`);
  return data ? JSON.parse(data) : [];
}

export function saveMessage(sessionId: string, message: Message) {
  const messages = getMessages(sessionId);
  localStorage.setItem(`session-${sessionId}`, JSON.stringify([...messages, message]));
}
