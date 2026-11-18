const API_KEY = import.meta.env.VITE_AI_API_KEY;
const MODEL = import.meta.env.VITE_AI_MODEL || "gemini-3.8-flash";
const SYSTEM = {
  en: "You are a calm, clear university tutor for computer science students. Explain concepts accurately and concisely in plain text (no markdown): one-sentence core idea, then 2 to 4 short points, then a quick self-check question.",
  fr: "Tu es un tuteur universitaire calme et clair pour des étudiants en informatique. Explique les notions avec précision et concision en texte brut (sans markdown) : l’idée centrale en une phrase, puis 2 à 4 points courts, puis une question d’auto-évaluation."
};
const MESSAGES = {
  en: {
    missingKey: "The assistant is not configured. Add VITE_AI_API_KEY to .env.local and restart.",
    failed: "The assistant is unavailable right now. Check your connection and try again.",
    empty: "No answer was generated. Try rephrasing your question."
  },
  fr: {
    missingKey: "L’assistant n’est pas configuré. Ajoutez VITE_AI_API_KEY dans .env.local puis relancez.",
    failed: "L’assistant est indisponible. Vérifiez votre connexion et réessayez.",
    empty: "Aucune réponse générée. Essayez de reformuler votre question."
  }
};
async function askAssistant({ question, contextTitle, language, history }) {
  const msg = MESSAGES[language];
  if (!API_KEY) throw new Error(msg.missingKey);
  const parts = [];
  if (contextTitle) parts.push(`Book being studied: "${contextTitle}"`);
  if (history.length > 0) {
    parts.push(history.map((h) => `Student: ${h.question}
Tutor: ${h.answer}`).join("\n\n"));
  }
  parts.push(`Student question: ${question}`);
  let res;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM[language] }] },
          contents: [{ role: "user", parts: [{ text: parts.join("\n\n") }] }]
        })
      }
    );
  } catch {
    throw new Error(msg.failed);
  }
  if (!res.ok) throw new Error(msg.failed);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
  if (!text) throw new Error(msg.empty);
  return text;
}
export {
  askAssistant
};
