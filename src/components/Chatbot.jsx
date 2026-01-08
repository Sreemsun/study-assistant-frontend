import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function Chatbot({ onLogout }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "Hello! 👋 I'm your AI study assistant. Ask me anything.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // ✅ BACKEND-CONNECTED FUNCTION
  const sendMessage = async (text) => {
    if (!text || !text.trim() || isTyping) return;

    const user = {
      id: Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((m) => [...m, user]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const reply = {
        id: Date.now() + 1,
        sender: "assistant",
        text: data.reply || "I couldn't generate a response.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((m) => [...m, reply]);
    } catch (error) {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 2,
          sender: "assistant",
          text: "⚠️ Unable to reach the server. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const suggestions = ["What are atoms?", "How are covalent bonds formed?"];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#051329" }}>
      {/* Top bar */}
      <div className="w-full fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-end">
          <button
            onClick={onLogout}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 text-white font-semibold flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="hero-wrapper" style={{ paddingTop: 40 }}>
        <div className="hero-column">
          <p className="small-muted">Supercharged Learning</p>
          <h1 className="hero-title">An AI powered tutor</h1>
          <p className="hero-sub">Get instant answers from your personal AI tutor</p>

          <div className="chat-window glass-card mt-8">
            <div className="window-head">
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ff7b7b" }} />
                <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ffbf6b" }} />
                <span style={{ width: 10, height: 10, borderRadius: 999, background: "#6be58f" }} />
              </div>
              <div style={{ marginLeft: "auto", fontSize: 13 }}>Chemistry</div>
            </div>

            <div ref={messagesRef} className="chat-messages">
              {messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    {m.sender === "assistant" && (
                      <div className="icon-bot">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div style={{ flex: 1, textAlign: m.sender === "user" ? "right" : "left" }}>
                      <div className={`msg ${m.sender}`}>{m.text}</div>
                      <div className="msg-time">{m.timestamp}</div>
                    </div>
                    {m.sender === "user" && (
                      <div className="icon-user">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="msg assistant">AI is typing…</div>
              )}
            </div>

            <div className="suggested-row">
              {suggestions.map((s) => (
                <button key={s} className="suggested" onClick={() => sendMessage(s)}>
                  {s} →
                </button>
              ))}
            </div>

            <div className="chat-input-wrap">
              <input
                ref={inputRef}
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask StudyAI anything..."
              />
              <button className="send-btn" onClick={() => sendMessage(input)} disabled={!input.trim()}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
