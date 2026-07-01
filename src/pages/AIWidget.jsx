import { useState } from "react";

export default function AIWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage("");

    setChat(prev => [...prev, { role: "user", text: userMsg }]);

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg })
    });

    const data = await res.json();

    setChat(prev => [
      ...prev,
      { role: "ai", text: data.response || data.error }
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className="ai-fab"
        onClick={() => setOpen(!open)}
      >
        🤖
      </div>

      {/* Chat Window */}
      {open && (
        <div className="ai-widget">
          <div className="ai-widget-header">
            HAUZRAL AI
          </div>

          <div className="ai-widget-body">
            {chat.map((c, i) => (
              <div key={i} className={c.role}>
                {c.text}
              </div>
            ))}
          </div>

          <div className="ai-widget-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask..."
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}