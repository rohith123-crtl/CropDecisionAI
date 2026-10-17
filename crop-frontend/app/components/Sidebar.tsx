"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  LayoutDashboard,
  History,
  User,
  Pencil,
  Leaf,
} from "lucide-react";
import ProfileModal from "./ProfileModal";

export interface FarmerProfile {
  name: string;
  farm: string;
  location: string;
  avatar: string;
}

const DEFAULT_PROFILE: FarmerProfile = {
  name: "Raju Farmer",
  farm: "Green Valley Farm",
  location: "India",
  avatar: "🧑‍🌾",
};

const AVATARS = ["🧑‍🌾", "👩‍🌾", "🌾", "🌻", "🌱"];

export default function Sidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<FarmerProfile>(DEFAULT_PROFILE);
  const [showModal, setShowModal] = useState(false);
  const [cropCount, setCropCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("farmerProfile");
    if (saved) setProfile(JSON.parse(saved));

    const history = localStorage.getItem("cropHistory");
    if (history) setCropCount(JSON.parse(history).length);

    // Listen for history updates
    const onStorage = () => {
      const h = localStorage.getItem("cropHistory");
      setCropCount(h ? JSON.parse(h).length : 0);
      const p = localStorage.getItem("farmerProfile");
      if (p) setProfile(JSON.parse(p));
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("kisanHistoryUpdated", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("kisanHistoryUpdated", onStorage);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/history", label: "Crop History", icon: History, badge: cropCount },
  ];

  return (
    <>
      <aside className="sidebar glass-dark flex flex-col py-6 px-4">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-gradient-to-br from-emerald-400 to-green-600 p-2 rounded-xl shadow-lg shadow-emerald-900/40">
            <Sprout size={22} className="text-white" />
          </div>
          <div>
            <p className="text-emerald-300 font-bold text-lg leading-none">KisanAI</p>
            <p className="text-emerald-500/60 text-xs mt-0.5">Smart Crop Advisor</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass rounded-2xl p-4 mb-6 relative group">
          <button
            onClick={() => setShowModal(true)}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500/20"
            title="Edit Profile"
          >
            <Pencil size={14} />
          </button>
          <div className="flex items-center gap-3">
            <div className="text-4xl select-none">{profile.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-emerald-100 font-semibold truncate text-sm">{profile.name}</p>
              <p className="text-emerald-400/70 text-xs truncate">{profile.farm}</p>
              <p className="text-emerald-500/50 text-xs flex items-center gap-1 mt-0.5">
                <Leaf size={10} />
                {profile.location}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/10 flex justify-between text-center">
            <div>
              <p className="text-emerald-300 font-bold text-lg">{cropCount}</p>
              <p className="text-emerald-500/60 text-xs">Crops tested</p>
            </div>
            <div className="w-px bg-emerald-500/10" />
            <div>
              <p className="text-emerald-300 font-bold text-lg">AI</p>
              <p className="text-emerald-500/60 text-xs">Powered</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          <p className="text-emerald-500/50 text-xs font-semibold uppercase tracking-wider px-3 mb-2">Menu</p>
          {navLinks.map(({ href, label, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${pathname === href ? "active" : ""}`}
            >
              <Icon size={20} />
              <span className="flex-1">{label}</span>
              {badge !== undefined && badge > 0 && (
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-emerald-500/10">
          <button
            onClick={() => setShowModal(true)}
            className="nav-link w-full text-left"
          >
            <User size={18} />
            <span>Edit Profile</span>
          </button>
        </div>
      </aside>

      {showModal && (
        <ProfileModal
          profile={profile}
          avatars={AVATARS}
          onSave={(p) => {
            setProfile(p);
            localStorage.setItem("farmerProfile", JSON.stringify(p));
            setShowModal(false);
            window.dispatchEvent(new Event("kisanHistoryUpdated"));
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
