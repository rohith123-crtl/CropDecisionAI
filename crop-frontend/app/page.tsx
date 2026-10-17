"use client";

import { FormEvent, useState } from "react";
import {
  Leaf,
  Sprout,
  Wheat,
  FlaskConical,
  ThermometerSun,
  Droplets,
  CloudRain,
  MapPin,
  Loader2,
  Sparkles,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import ChatBot from "./components/ChatBot";

const initialForm = {
  N: 80,
  P: 50,
  K: 40,
  ph: 6.5,
  temperature: 25,
  humidity: 60,
  rainfall: 110,
};

const SOIL_INPUTS = [
  { id: "N",  label: "Nitrogen",   sublabel: "Leaf Growth",   icon: Leaf,         min: 0,  max: 150, step: 1,   color: "text-green-400",   bg: "bg-green-400/10",   border: "border-green-400/20" },
  { id: "P",  label: "Phosphorus", sublabel: "Root Strength", icon: Sprout,       min: 0,  max: 150, step: 1,   color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  { id: "K",  label: "Potassium",  sublabel: "Crop Health",   icon: Wheat,        min: 0,  max: 250, step: 1,   color: "text-yellow-400",  bg: "bg-yellow-400/10",  border: "border-yellow-400/20" },
  { id: "ph", label: "Soil pH",    sublabel: "Sourness Level",icon: FlaskConical, min: 0,  max: 14,  step: 0.1, color: "text-purple-400",  bg: "bg-purple-400/10",  border: "border-purple-400/20" },
];

const WEATHER_INPUTS = [
  { id: "temperature", label: "Temperature", sublabel: "Heat °C",    icon: ThermometerSun, min: 0,  max: 50,  step: 0.1, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
  { id: "humidity",    label: "Humidity",    sublabel: "Air Moisture %", icon: Droplets,       min: 0,  max: 100, step: 0.1, color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/20" },
  { id: "rainfall",    label: "Rainfall",    sublabel: "Rain Water mm",  icon: CloudRain,      min: 0,  max: 300, step: 1,   color: "text-cyan-400",   bg: "bg-cyan-400/10",   border: "border-cyan-400/20" },
];

function SliderInput({
  id, label, sublabel, icon: Icon, min, max, step, value, color, bg, border, onChange,
}: {
  id: string; label: string; sublabel: string;
  icon: React.ElementType; min: number; max: number; step: number;
  value: number; color: string; bg: string; border: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={`rounded-2xl border ${border} bg-black/20 p-5 transition-all duration-300 hover:bg-black/30 hover:shadow-lg group`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-xl ${bg} ${color} transition-transform duration-200 group-hover:scale-110`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-emerald-100 font-semibold leading-none">{label}</p>
          <p className="text-emerald-500/60 text-xs mt-0.5">{sublabel}</p>
        </div>
        <span className={`ml-auto font-mono font-bold text-lg ${color}`}>{value}</span>
      </div>
      <input
        type="range"
        id={`slider-${id}`}
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-emerald-500/40 mt-2">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);

  const handleChange = (field: keyof typeof initialForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: Number(value) }));

  const handleGetLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&daily=precipitation_sum&timezone=auto`
          );
          const data = await res.json();
          setForm((prev) => ({
            ...prev,
            temperature: data.current?.temperature_2m ?? prev.temperature,
            humidity: data.current?.relative_humidity_2m ?? prev.humidity,
            rainfall: data.daily?.precipitation_sum?.[0] ?? prev.rainfall,
          }));
          setLocationName(`Lat ${lat.toFixed(2)}, Lon ${lon.toFixed(2)}`);
        } catch {
          alert("Could not fetch weather data.");
        } finally {
          setLocationLoading(false);
        }
      },
      () => { alert("Location access denied."); setLocationLoading(false); }
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      const crop: string = data.recommended_crop;
      setResult(crop);

      // Save to history
      const history = JSON.parse(localStorage.getItem("cropHistory") || "[]");
      history.unshift({
        id: Date.now(),
        crop,
        date: new Date().toLocaleString(),
        inputs: { ...form },
      });
      localStorage.setItem("cropHistory", JSON.stringify(history));
      window.dispatchEvent(new Event("kisanHistoryUpdated"));
    } catch {
      setResult("__error__");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="main-content flex-1 p-6 md:p-10">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-emerald-400/70 text-sm font-semibold uppercase tracking-widest mb-1">Smart Agriculture</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-green-400">
            What should I plant?
          </h1>
          <p className="text-emerald-100/50 mt-2 text-base max-w-lg">
            Adjust the sliders to match your soil and weather, then let AI pick the perfect crop for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* === SOIL SECTION === */}
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-yellow-400/10 rounded-xl">
                <FlaskConical size={20} className="text-yellow-400" />
              </div>
              <div>
                <h2 className="text-emerald-100 font-bold text-lg">Soil Nutrients</h2>
                <p className="text-emerald-500/60 text-xs">Values from soil test</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {SOIL_INPUTS.map((inp) => (
                <SliderInput
                  key={inp.id}
                  {...inp}
                  value={form[inp.id as keyof typeof initialForm]}
                  onChange={(v) => handleChange(inp.id as keyof typeof initialForm, v)}
                />
              ))}
            </div>
          </div>

          {/* === WEATHER SECTION === */}
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-400/10 rounded-xl">
                  <CloudRain size={20} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-emerald-100 font-bold text-lg">Weather Conditions</h2>
                  <p className="text-emerald-500/60 text-xs">
                    {locationName ? `📍 Auto-filled from ${locationName}` : "Adjust or auto-detect"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locationLoading}
                className="flex items-center gap-2 rounded-xl bg-blue-500/10 border border-blue-500/25 px-4 py-2.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20 active:scale-95 disabled:opacity-50"
              >
                {locationLoading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                {locationLoading ? "Detecting..." : "Use My Location"}
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {WEATHER_INPUTS.map((inp) => (
                <SliderInput
                  key={inp.id}
                  {...inp}
                  value={form[inp.id as keyof typeof initialForm]}
                  onChange={(v) => handleChange(inp.id as keyof typeof initialForm, v)}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden group flex items-center gap-3 px-14 py-5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 font-bold text-xl text-black transition-all duration-200 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:brightness-110 active:scale-95 disabled:opacity-70 disabled:hover:brightness-100"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center gap-3 z-10">
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} className="group-hover:rotate-12 transition-transform duration-300" />}
                {loading ? "Analyzing your field..." : "Find the best crop"}
              </span>
            </button>
          </div>
        </form>

        {/* === RESULT === */}
        {result === "__error__" && (
          <div className="mt-8 rounded-3xl border-2 border-red-500/40 bg-red-500/10 p-8 text-center animate-slide-up">
            <p className="text-red-300 text-lg font-semibold">⚠️ Could not reach the AI server</p>
            <p className="text-red-400/70 text-sm mt-2">Make sure the backend is running. Ask the chatbot (💬 below) for help!</p>
          </div>
        )}

        {result && result !== "__error__" && (
          <div className="mt-8 overflow-hidden rounded-3xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-900/30 to-green-900/20 p-10 text-center animate-slide-up relative shadow-[0_0_60px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-8 -left-8 text-emerald-500/10 rotate-12 pointer-events-none"><Leaf size={120} /></div>
            <div className="absolute -bottom-8 -right-8 text-emerald-500/10 -rotate-12 pointer-events-none"><Wheat size={120} /></div>
            <p className="text-emerald-300 text-base font-semibold uppercase tracking-widest mb-3">🌿 Best crop for your field</p>
            <h2 className="shimmer-text text-6xl md:text-7xl font-black capitalize tracking-tight">
              {result}
            </h2>
            <p className="text-emerald-100/40 text-sm mt-4">Saved to your crop history automatically</p>
          </div>
        )}
      </div>

      <ChatBot />
    </div>
  );
}
