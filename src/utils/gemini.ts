//Gemini API 호출
const MY_API = import.meta.env.VITE_API_KEY;
const MODEL = "gemini-2.0-flash";

export async function callGemini(userMessage: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${MY_API}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userMessage }] }]
    })
  });

  if (!res.ok) {
  const errorText = await res.text();
  throw new Error(`API Error: ${res.status} - ${errorText}`);
  }

  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? '응답 없음';
}
