"use client";

import { useState, useEffect } from "react";
import { History, Trash2, Leaf, ChevronDown, ChevronUp, Sprout } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ChatBot from "../components/ChatBot";

interface CropRecord {
  id: number;
  crop: string;
  date: string;
  inputs: {
    N: number; P: number; K: number; ph: number;
    temperature: number; humidity: number; rainfall: number;
  };
}

const CROP_ICONS: Record<string, string> = {
  rice: "🌾", wheat: "🌾", maize: "🌽", cotton: "🌿", jute: "🌿",
  sugarcane: "🎋", coffee: "☕", coconut: "🥥", papaya: "🍈",
  banana: "🍌", mango: "🥭", grapes: "🍇", watermelon: "🍉",
  muskmelon: "🍈", apple: "🍎", orange: "🍊", pomegranate: "🍑",
  lentil: "🫘", chickpea: "🫘", kidneybeans: "🫘", pigeonpeas: "🫘",
  mothbeans: "🫘", mungbean: "🫘", blackgram: "🫘",
};

const FIELD_LABELS: { key: keyof CropRecord["inputs"]; label: string; unit: string }[] = [
  { key: "N", label: "Nitrogen", unit: "" },
  { key: "P", label: "Phosphorus", unit: "" },
  { key: "K", label: "Potassium", unit: "" },
  { key: "ph", label: "Soil pH", unit: "" },
  { key: "temperature", label: "Temp", unit: "°C" },
  { key: "humidity", label: "Humidity", unit: "%" },
  { key: "rainfall", label: "Rainfall", unit: "mm" },
];

function HistoryCard({ record, index }: { record: CropRecord; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const icon = CROP_ICONS[record.crop.toLowerCase()] ?? "🌱";

  return (
    <div
      className="history-card animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl select-none">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-emerald-100 font-bold text-xl capitalize">{record.crop}</p>
          <p className="text-emerald-500/60 text-sm mt-0.5">{record.date}</p>
        </div>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="p-2 rounded-xl text-emerald-400/50 hover:text-emerald-300 hover:bg-emerald-500/10 transition"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-emerald-500/10 grid grid-cols-3 md:grid-cols-7 gap-3">
          {FIELD_LABELS.map(({ key, label, unit }) => (
            <div key={key} className="text-center">
              <p className="text-emerald-400/60 text-xs mb-1">{label}</p>
              <p className="text-emerald-200 font-bold text-sm">
                {record.inputs[key]}{unit}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const [history, setHistory] = useState<CropRecord[]>([]);

  const load = () => {
    const saved = localStorage.getItem("cropHistory");
    setHistory(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    load();
    window.addEventListener("kisanHistoryUpdated", load);
    return () => window.removeEventListener("kisanHistoryUpdated", load);
  }, []);

  const clearHistory = () => {
    if (confirm("Clear all crop history? This cannot be undone.")) {
      localStorage.removeItem("cropHistory");
      setHistory([]);
      window.dispatchEvent(new Event("kisanHistoryUpdated"));
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="main-content flex-1 p-6 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-emerald-400/70 text-sm font-semibold uppercase tracking-widest mb-1">Records</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-green-400">
              Crop History
            </h1>
            <p className="text-emerald-100/50 mt-2 text-base">
              All your past crop recommendations in one place.
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 active:scale-95"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>

        {/* Summary bar */}
        {history.length > 0 && (
          <div className="glass rounded-2xl p-5 mb-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/15 rounded-xl"><History size={18} className="text-emerald-400" /></div>
              <div>
                <p className="text-emerald-200 font-bold text-xl">{history.length}</p>
                <p className="text-emerald-500/60 text-xs">Total recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/15 rounded-xl"><Leaf size={18} className="text-green-400" /></div>
              <div>
                <p className="text-emerald-200 font-bold text-xl capitalize">{history[0].crop}</p>
                <p className="text-emerald-500/60 text-xs">Latest recommendation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/15 rounded-xl"><Sprout size={18} className="text-yellow-400" /></div>
              <div>
                <p className="text-emerald-200 font-bold text-xl capitalize">
                  {/* Most frequent crop */}
                  {Object.entries(
                    history.reduce((acc: Record<string, number>, r) => {
                      acc[r.crop] = (acc[r.crop] || 0) + 1; return acc;
                    }, {})
                  ).sort((a, b) => b[1] - a[1])[0]?.[0]}
                </p>
                <p className="text-emerald-500/60 text-xs">Most recommended crop</p>
              </div>
            </div>
          </div>
        )}

        {/* Cards */}
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-7xl mb-6 opacity-30">🌱</div>
            <h2 className="text-emerald-300/50 text-2xl font-bold">No history yet</h2>
            <p className="text-emerald-500/40 text-base mt-2">
              Go to the Dashboard and get your first crop recommendation!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((record, i) => (
              <HistoryCard key={record.id} record={record} index={i} />
            ))}
          </div>
        )}
      </div>

      <ChatBot />
    </div>
  );
}
