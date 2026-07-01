import { useState } from "react";

export default function AIAssistant() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    // 🔥 FIX: block empty or whitespace-only messages
    if (!message.trim()) return;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: message.trim() }) // Send clean payload
      });

      const data = await res.json();

      console.log("AI RAW RESPONSE:", data); // 🔥 IMPORTANT DEBUG

      const aiText =
        data.response ||
        data.error ||
        "No response from AI";

      setChat(prev => [
        ...prev,
        { role: "user", text: message.trim() },
        { role: "ai", text: aiText }
      ]);

      setMessage("");

    } catch (error) {
      console.error("Frontend AI Error:", error);

      setChat(prev => [
        ...prev,
        { role: "user", text: message.trim() },
        { role: "ai", text: "Error connecting to AI backend" }
      ]);
    }
  };

  return (
    <div style={{ padding: 20, border: "1px solid #ccc" }}>
      <h3>HAUZRAL AI Assistant</h3>

      <div style={{ minHeight: 200 }}>
        {chat.map((c, i) => (
          <p key={i}>
            <b>{c.role}:</b> {c.text}
          </p>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}