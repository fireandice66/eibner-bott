import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Willkommen bei Eibner & Regnath! Ich bin Ihr digitaler Berater für Fenster, Türen & Sonnenschutz. Wie kann ich Ihnen helfen?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const SYSTEM_PROMPT = `Du bist der professionelle KI-Assistent von Eibner & Regnath Fenster, Türen GmbH in Berching.
Antworte freundlich, kompetent und auf Deutsch. Maximal 3-4 Sätze.
Wenn jemand ein Angebot oder Beratung möchte, bitte um E-Mail oder Telefonnummer.`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 500,
          system: SYSTEM_PROMPT,
          messages: newMessages
        })
      });

      const data = await response.json();
      const reply =
        data.content?.[0]?.text ||
        "Entschuldigung, ich konnte keine Antwort generieren.";

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Entschuldigung, kurze Verbindungsstörung. Bitte versuchen Sie es nochmal." }
      ]);
    }

    setIsTyping(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#EEF4FB", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 440, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
        
        <div style={{ background: "linear-gradient(135deg,#0D3F7A,#1E5FA8)", padding: 18, color: "#fff", fontWeight: 700 }}>
          Eibner & Regnath Assistent
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 16, background: "#F7FAFD", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "82%",
                padding: "11px 15px",
                fontSize: 14,
                lineHeight: 1.6,
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.role === "user" ? "#1E5FA8" : "#fff",
                color: msg.role === "user" ? "#fff" : "#2a2a2a",
                border: msg.role === "assistant" ? "1px solid #C5D9F0" : "none"
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && <div style={{ fontSize: 13, color: "#999" }}>Schreibt...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: 14, borderTop: "1px solid #C5D9F0", background: "#fff" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
              placeholder="Stellen Sie Ihre Frage..."
              rows={1}
              style={{ flex: 1, borderRadius: 10, padding: 10, border: "1px solid #C5D9F0", resize: "none" }}
            />
            <button
              onClick={sendMessage}
              style={{ background: "#1E5FA8", color: "#fff", border: "none", borderRadius: 10, padding: "0 16px", cursor: "pointer" }}
            >
              Senden
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
