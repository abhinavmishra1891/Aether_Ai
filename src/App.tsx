import { useEffect, useState } from "react";
import { auth } from "./lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Auth } from "./components/Auth";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { History } from "./components/History";
import { motion, AnimatePresence } from "motion/react";
import { AuthState } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOADING);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setAuthState(AuthState.AUTHENTICATED);
      } else {
        setUser(null);
        setAuthState(AuthState.UNAUTHENTICATED);
      }
    });

    return () => unsubscribe();
  }, []);

  if (authState === AuthState.LOADING) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 bg-primary rounded-full shadow-2xl shadow-primary/50"
        />
      </div>
    );
  }

  if (authState === AuthState.UNAUTHENTICATED) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary/30">
      <Navbar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pt-20">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard />
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <History />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full py-12 border-t border-white/5 mt-xxl bg-black/40">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto space-y-4 md:space-y-0">
          <div className="font-bold text-white font-display text-sm uppercase tracking-widest flex items-center gap-2">
            AETHER <span className="text-[10px] text-slate-600">LUXE AI</span>
          </div>
          <div className="flex space-x-8">
            <a className="text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all" href="#">Support</a>
            <a className="text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all" href="#">Status</a>
            <a className="text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all" href="#">Privacy</a>
          </div>
          <div className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">
            © 2026 AETHER. Engineered for Excellence.
          </div>
        </div>
      </footer>
    </div>
  );
}
