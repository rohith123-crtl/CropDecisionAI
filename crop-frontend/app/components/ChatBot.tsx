"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

interface Message {
  from: "bot" | "user";
  text: string;
}

const FAQ: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["nitrogen", "n value", "leaf", "leaves"],
    answer:
      "🌿 Nitrogen helps your crop grow big, green leaves. Use a simple soil test kit from your local market to measure it. If leaves look yellow, your soil needs more nitrogen.",
  },
  {
    keywords: ["phosphorus", "p value", "root", "roots"],
    answer:
      "🌱 Phosphorus makes roots strong. Strong roots help your crop survive dry weather. You can add bone meal or phosphate fertiliser to increase it.",
  },
  {
    keywords: ["potassium", "k value", "health", "disease"],
    answer:
      "🌾 Potassium keeps your crop healthy and protects it from diseases. Wood ash or potash fertiliser can increase it in your soil.",
  },
  {
    keywords: ["ph", "soil sourness", "acid", "alkaline"],
    answer:
      "🧪 pH tells us if your soil is sour or sweet. Most crops like a pH of 6 to 7 (slightly sour). If too sour, add lime. If too sweet (alkaline), add sulfur.",
  },
  {
    keywords: ["temperature", "heat", "hot", "cold"],
    answer:
      "🌡️ Temperature is how hot or cold it is where you live. Different crops grow in different temperatures — for example, wheat grows in cooler weather and rice in hotter weather.",
  },
  {
    keywords: ["humidity", "moisture", "air", "damp"],
    answer:
      "💧 Humidity is how much water is in the air. In humid areas, crops like jute and rice do well. In dry areas, crops like sorghum and millet are better.",
  },
  {
    keywords: ["rainfall", "rain", "water", "precipitation"],
    answer:
      "🌧️ Rainfall is how much rain falls in your area. Our app can auto-detect this from your location — just click 'Auto-fill weather from my location'!",
  },
  {
    keywords: ["location", "auto", "detect", "gps", "weather"],
    answer:
      "📍 Click the 'Auto-fill weather from my location' button on the dashboard. Your browser will ask permission — click Allow. The app will then fill in temperature, humidity, and rainfall for you automatically!",
  },
  {
    keywords: ["error", "not working", "backend", "server", "predict", "failed", "unable"],
    answer:
      "⚠️ There seems to be a connection problem with our AI server. Please make sure:\n1. The backend is running (run `uvicorn main:app` in your project folder)\n2. Try refreshing the page\n3. Check that the backend is on port 8000",
  },
  {
    keywords: ["history", "past", "previous", "record"],
    answer:
      "📜 All your past crop recommendations are saved in the History section! Click 'Crop History' in the left menu to see them.",
  },
  {
    keywords: ["profile", "name", "edit", "change", "avatar"],
    answer:
      "👤 To edit your profile, click the pencil icon on your profile card in the sidebar, or click 'Edit Profile' at the bottom of the menu.",
  },
  {
    keywords: ["hello", "hi", "namaste", "help", "start"],
    answer:
      "🙏 Namaste! I'm your KisanAI helper bot. I can answer questions about:\n• Soil values (N, P, K, pH)\n• Weather readings\n• Using the app\n• Fixing errors\n\nWhat do you need help with?",
  },
];

function getBotReply(userText: string): string {
  const lower = userText.toLowerCase();
  for (const faq of FAQ) {
    if (faq.keywords.some((kw) => lower.includes(kw))) {
      return faq.answer;
    }
  }
  return "🤔 I'm not sure about that. Try asking about soil nutrients (N, P, K, pH), weather values, or if the app is giving you an error. I'm here to help!";
}

const WELCOME: Message = {
  from: "bot",
  text: "🙏 Namaste! I'm your KisanAI helper. Ask me anything — about soil, weather, or if something isn't working!",
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const userMsg: Message = { from: "user", text };
    const botMsg: Message = { from: "bot", text: getBotReply(text) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="chat-panel glass-dark animate-chat-pop shadow-2xl shadow-black/60">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-emerald-500/15">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 rounded-xl">
              <Bot size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-emerald-100 text-sm">KisanAI Helper</p>
              <p className="text-emerald-400/60 text-xs">Always here to help</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-emerald-400/60 hover:text-emerald-300 hover:bg-emerald-500/10 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "340px" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`chat-message ${msg.from}`} style={{ whiteSpace: "pre-line" }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-emerald-500/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a question..."
              className="flex-1 rounded-xl border border-emerald-500/20 bg-black/40 px-3 py-2.5 text-sm text-emerald-50 outline-none focus:border-emerald-400 transition placeholder:text-emerald-500/40"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white transition hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="chat-fab animate-pulse-glow"
        title="Need help? Ask KisanAI"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}
