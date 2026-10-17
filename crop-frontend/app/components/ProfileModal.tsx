"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import type { FarmerProfile } from "./Sidebar";

interface Props {
  profile: FarmerProfile;
  avatars: string[];
  onSave: (p: FarmerProfile) => void;
  onClose: () => void;
}

export default function ProfileModal({ profile, avatars, onSave, onClose }: Props) {
  const [form, setForm] = useState({ ...profile });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass rounded-3xl p-8 w-full max-w-sm animate-slide-up shadow-2xl shadow-black/60">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-emerald-400/60 hover:text-emerald-300 hover:bg-emerald-500/10 transition"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-emerald-100 mb-6">Edit Farmer Profile</h2>

        {/* Avatar picker */}
        <p className="text-emerald-400/70 text-sm mb-3">Choose your avatar</p>
        <div className="flex gap-3 mb-6">
          {avatars.map((av) => (
            <button
              key={av}
              onClick={() => setForm((f) => ({ ...f, avatar: av }))}
              className={`text-3xl p-2 rounded-xl transition-all duration-200 ${
                form.avatar === av
                  ? "bg-emerald-500/25 border-2 border-emerald-400 scale-110"
                  : "bg-emerald-500/5 border-2 border-transparent hover:border-emerald-500/30"
              }`}
            >
              {av}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-emerald-300/70 mb-1.5 block">Your Name</label>
            <input
              className="w-full rounded-xl border border-emerald-500/20 bg-black/40 px-4 py-3 text-emerald-50 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Raju Farmer"
            />
          </div>
          <div>
            <label className="text-sm text-emerald-300/70 mb-1.5 block">Farm / Village Name</label>
            <input
              className="w-full rounded-xl border border-emerald-500/20 bg-black/40 px-4 py-3 text-emerald-50 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition"
              value={form.farm}
              onChange={(e) => setForm((f) => ({ ...f, farm: e.target.value }))}
              placeholder="e.g. Green Valley Farm"
            />
          </div>
          <div>
            <label className="text-sm text-emerald-300/70 mb-1.5 block">Location / State</label>
            <input
              className="w-full rounded-xl border border-emerald-500/20 bg-black/40 px-4 py-3 text-emerald-50 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. Punjab, India"
            />
          </div>
        </div>

        <button
          onClick={() => onSave(form)}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 py-3.5 font-bold text-black transition hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-95"
        >
          <Check size={18} />
          Save Profile
        </button>
      </div>
    </div>
  );
}
