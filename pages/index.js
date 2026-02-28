import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Willkommen bei Eibner & Regnath! Wie kann ich Ihnen helfen?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input }
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 500,
        messages: newMessages
      })
    });

    const data = await response.json();

    setMessages([
      ...newMessages,
      { role: "assistant", content: data.content?.[0]?.text || "Fehler bei der Antwort." }
    ]);

    setLoading(false);
  }

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h2>Eibner & Regnath Assistent</h2>

      <div style={{ border: "1px solid #ddd", padding: 10, height: 400, overflowY: "auto", marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{msg.role === "user" ? "Sie" : "Bot"}:</strong>
            <div>{msg.content}</div>
          </div>
        ))}
        {loading && <div>Bot schreibt...</div>}
      </div>

      <div style={{ display: "flex" }}>
        <input
          style={{ flex: 1, padding: 8 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ihre Nachricht..."
        />
        <button
          style={{ padding: "8px 16px", background: "#1e5fa8", color: "white", border: "none" }}
          onClick={sendMessage}
        >
          Senden
        </button>
      </div>
    </div>
  );
}
