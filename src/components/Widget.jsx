import { useState } from "react";

export default function AIWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const toggle = () => setOpen(prev => !prev);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage("");

    // Append user message immediately to the screen
    setChat(prev => [...prev, { role: "user", text: userMsg }]);

    try {
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
    } catch {
      setChat(prev => [
        ...prev,
        { role: "ai", text: "AI connection failed" }
      ]);
    }
  };

  return (
    <>
      {/* TRIGGER FLOATING ACTION BUTTON */}
      <div className="ai-fab" onClick={toggle} role="button" aria-label="Open AI Assistant">
        🤖
      </div>

      {/* FLYOUT COLLAPSIBLE PANEL */}
      {open && (
        <div className="ai-widget">
          <div className="ai-widget-header">
            HAUZRAL AI
            <span onClick={toggle} style={{ float: "right", cursor: "pointer" }} aria-label="Close Panel">
              ✕
            </span>
          </div>

          <div className="ai-widget-body">
            {chat.length === 0 && (
              <div style={{ opacity: 0.6, fontSize: "12px", textAlign: "center", marginTop: "12px" }}>
                Ask me anything about HAUZRAL TECHNOLOGIES...
              </div>
            )}

            {chat.map((c, i) => (
              <div 
                key={i} 
                className={`bubble ${c.role}`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {c.text}
              </div>
            ))}
          </div>

          <div className="ai-widget-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}