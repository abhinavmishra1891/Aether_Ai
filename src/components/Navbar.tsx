import { motion } from "motion/react";
import { LogOut, LayoutDashboard, History, Zap, Menu, X } from "lucide-react";
import { useState } from "react";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

interface NavbarProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ user, activeTab, setActiveTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl shadow-violet-900/20">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-white uppercase font-display flex items-center gap-2">
          <Zap className="text-primary fill-primary w-8 h-8" />
          Aether
        </div>

        {user && (
          <>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`font-display font-medium tracking-tight transition-all duration-300 active:scale-95 flex items-center gap-2 ${
                  activeTab === "dashboard" ? "text-white border-b-2 border-primary pb-1" : "text-slate-400 hover:text-primary"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`font-display font-medium tracking-tight transition-all duration-300 active:scale-95 flex items-center gap-2 ${
                  activeTab === "history" ? "text-white border-b-2 border-primary pb-1" : "text-slate-400 hover:text-primary"
                }`}
              >
                <History className="w-4 h-4" />
                History
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="flex flex-col items-end mr-2">
                <span className="text-xs font-semibold text-white">{user.displayName || user.email?.split('@')[0]}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Active</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-full border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all active:scale-95"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </>
        )}
      </div>

      {/* Mobile Nav */}
      {user && isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/90 border-b border-white/10 p-6 flex flex-col gap-4"
        >
          <button
            onClick={() => { setActiveTab("dashboard"); setIsOpen(false); }}
            className={`flex items-center gap-2 text-lg ${activeTab === "dashboard" ? "text-primary" : "text-slate-400"}`}
          >
            <LayoutDashboard /> Dashboard
          </button>
          <button
            onClick={() => { setActiveTab("history"); setIsOpen(false); }}
            className={`flex items-center gap-2 text-lg ${activeTab === "history" ? "text-primary" : "text-slate-400"}`}
          >
            <History /> History
          </button>
          <hr className="border-white/10" />
          <button onClick={handleSignOut} className="flex items-center gap-2 text-red-400">
            <LogOut /> Sign Out
          </button>
        </motion.div>
      )}
    </nav>
  );
}
